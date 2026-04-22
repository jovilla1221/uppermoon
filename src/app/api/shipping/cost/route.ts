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
    
    // Normalize IDs: BinderByte requires 'dist_' prefix for Kecamatan/District level
    const finalDestination = destination.startsWith('dist_') ? destination : `dist_${destination}`;
    const origin = process.env.SHIPPING_ORIGIN_ID || "dist_35.72.03"; // Kota Blitar (Sananwetan)

    // Binderbyte expects weight in KG, frontend provides weight in Grams
    const weightInKg = Math.max(1, Math.ceil((weight || 1000) / 1000));

    console.log(`[SHIPPING] Calculating cost: origin=${origin}, destination=${finalDestination}, weightKg=${weightInKg}, courier=${courier}`);

    const result = await getShippingCost(
      origin,
      finalDestination,
      weightInKg,
      courier
    );

    // Binderbyte actual response:
    // { code: "200", data: { results: [{ code, name, costs: [{ service, type, price, estimated }] }] } }
    if (result.code === "200" && result.data?.results?.length > 0) {
      const courierResult = result.data.results[0];
      const costs = (courierResult.costs || []).map((c: any) => ({
        service: c.service || c.type,
        description: `${courierResult.name} - ${c.service}`,
        cost: Number(c.price) || 0,
        etd: c.estimated || "-",
      }));

      // Filter out cargo/bulk services with unreasonable prices 
      const filteredCosts = costs.filter((c: any) => c.cost > 0 && c.cost < 500000);

      return NextResponse.json({ 
        success: true, 
        costs: filteredCosts 
      });
    }

    console.error("[SHIPPING] Unexpected response:", JSON.stringify(result));
    return NextResponse.json({ 
      success: false, 
      error: result.message || "No shipping services available for this route." 
    }, { status: 400 });

  } catch (error: any) {
    console.error("[SHIPPING] Failed to calculate cost:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
