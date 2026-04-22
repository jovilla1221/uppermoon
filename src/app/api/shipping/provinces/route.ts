import { NextResponse } from "next/server";
import { getProvinces } from "@/lib/binderbyte";

export async function GET() {
  try {
    const provinces = await getProvinces();
    return NextResponse.json({ success: true, data: provinces });
  } catch (error: any) {
    console.error("[SHIPPING] Failed to fetch provinces:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
