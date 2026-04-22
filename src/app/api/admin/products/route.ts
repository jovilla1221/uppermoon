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
      sizes: (body.variants || []).map((v: any) => v.size), // Keep sizes for compatibility
      variants: (body.variants || []).map((v: any, idx: number) => ({
        _key: `v-${idx}-${Date.now()}`,
        size: v.size,
        stock: Number(v.stock)
      })),
      featured: body.featured || false,
      images: body.newAssetIds
        ? body.newAssetIds.map((id: string, idx: number) => ({
            _type: "image",
            _key: `img-${idx}-${Date.now()}`,
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

// PATCH update product
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const patchData: any = {
      name: updates.name,
      slug: { _type: "slug", current: updates.slug },
      price: Number(updates.price),
      category: updates.category,
      collection: updates.collection || "",
      description: updates.description || "",
      sizes: (updates.variants || []).map((v: any) => v.size),
      variants: (updates.variants || []).map((v: any, idx: number) => ({
        _key: `v-${idx}-${Date.now()}`,
        size: v.size,
        stock: Number(v.stock)
      })),
      featured: updates.featured || false,
    };

    // Combine existing and new asset IDs to form the new images array
    const allImages: any[] = [];
    
    if (updates.existingAssetRefs && updates.existingAssetRefs.length > 0) {
      updates.existingAssetRefs.forEach((ref: string, idx: number) => {
        allImages.push({
          _type: "image",
          _key: `img-exist-${idx}-${Date.now()}`,
          asset: { _type: "reference", _ref: ref }
        });
      });
    }

    if (updates.newAssetIds && updates.newAssetIds.length > 0) {
      updates.newAssetIds.forEach((id: string, idx: number) => {
        allImages.push({
          _type: "image",
          _key: `img-new-${idx}-${Date.now()}`,
          asset: { _type: "reference", _ref: id },
        });
      });
    }

    patchData.images = allImages;

    const result = await writeClient.patch(id).set(patchData).commit();
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
