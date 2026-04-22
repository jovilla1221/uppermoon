import { NextRequest, NextResponse } from "next/server";
import { getCities } from "@/lib/binderbyte";

export async function GET(req: NextRequest) {
  try {
    const provinceId = req.nextUrl.searchParams.get("provinceId");
    if (!provinceId) {
      return NextResponse.json(
        { success: false, error: "provinceId is required" },
        { status: 400 }
      );
    }

    const cities = await getCities(provinceId);
    return NextResponse.json({ success: true, data: cities });
  } catch (error: any) {
    console.error("[SHIPPING] Failed to fetch cities:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
