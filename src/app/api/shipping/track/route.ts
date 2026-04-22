import { NextRequest, NextResponse } from "next/server";
import { trackPackage } from "@/lib/binderbyte";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { awb, courier } = body;

    if (!awb) {
      return NextResponse.json(
        { success: false, error: "Waybill / Resi number is required" },
        { status: 400 }
      );
    }

    const result = await trackPackage(awb, courier || "sicepat");
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[SHIPPING] Failed to track package:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

