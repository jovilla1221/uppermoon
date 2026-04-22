import { NextRequest, NextResponse } from "next/server";
import { getCouriers, getShippingCost } from "@/lib/binderbyte";

// GET: List available couriers
export async function GET() {
  try {
    const couriers = await getCouriers();
    return NextResponse.json({ success: true, data: couriers });
  } catch (error: any) {
    console.error("[SHIPPING] Failed to fetch couriers:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Calculate shipping cost
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, weight, courier } = body;
    
    // Normalize IDs: some APIs dislike dots or extra characters
    const cleanDestination = destination.replace(/[^0-9]/g, '');
    const origin = process.env.SHIPPING_ORIGIN_ID || "3171010"; // Jakarta Pusat (Gambir)

    console.log(`[SHIPPING] Calculating cost: origin=${origin}, destination=${cleanDestination}, weight=${weight}, courier=${courier}`);

    const result = await getShippingCost(
      origin,
      cleanDestination,
      weight || 1000,
      courier
    );

    // Binderbyte returns { status, message, data: { costs: [...] } }
    if (result.status === 200 && result.data && result.data.costs) {
      return NextResponse.json({ 
        success: true, 
        costs: result.data.costs 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: result.message || "Failed to calculate cost" 
    }, { status: 400 });

  } catch (error: any) {
    console.error("[SHIPPING] Failed to calculate cost:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
