import { NextRequest, NextResponse } from "next/server";
import { trackPackage } from "@/lib/binderbyte";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { awb, courier } = body;

    if (!awb || !courier) {
      return NextResponse.json(
        { success: false, error: "awb (tracking number) and courier are required" },
        { status: 400 }
      );
    }

    const result = await trackPackage(awb, courier);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[SHIPPING] Failed to track package:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
