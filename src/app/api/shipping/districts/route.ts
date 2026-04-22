import { NextRequest, NextResponse } from "next/server";
import { getKecamatan } from "@/lib/binderbyte";

export async function GET(req: NextRequest) {
  try {
    const cityId = req.nextUrl.searchParams.get("cityId");
    if (!cityId) {
      return NextResponse.json(
        { success: false, error: "cityId is required" },
        { status: 400 }
      );
    }

    const districts = await getKecamatan(cityId);
    return NextResponse.json({ success: true, data: districts });
  } catch (error: any) {
    console.error("[SHIPPING] Failed to fetch districts:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
