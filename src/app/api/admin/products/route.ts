import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { allProductsQuery } from "@/sanity/lib/queries";

// GET all products
export async function GET() {
  try {
    const products = await writeClient.fetch(allProductsQuery);
    return NextResponse.json(products || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const doc = {
      _type: "product",
      name: body.name,
      slug: { _type: "slug", current: body.slug },
      price: Number(body.price),
      category: body.category,
      collection: body.collection || "",
      description: body.description || "",
      sizes: body.sizes || ["S", "M", "L", "XL"],
      featured: body.featured || false,
      images: body.imageAssetIds
        ? body.imageAssetIds.map((id: string, idx: number) => ({
            _type: "image",
            _key: `img-${idx}`,
            asset: { _type: "reference", _ref: id },
          }))
        : [],
    };

    const result = await writeClient.create(doc);
    return NextResponse.json({ success: true, id: result._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
