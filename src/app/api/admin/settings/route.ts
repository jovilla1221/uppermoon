import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { groq } from "next-sanity";

export async function GET() {
  try {
    const settings = await writeClient.fetch(groq`*[_type == "siteSettings"][0] {
      _id,
      "logoUrl": logo.asset->url,
      "logoRef": logo.asset->_id,
      "hero1Url": heroSlide1.asset->url,
      "hero1Ref": heroSlide1.asset->_id,
      "hero2Url": heroSlide2.asset->url,
      "hero2Ref": heroSlide2.asset->_id,
      "community1Url": community1.asset->url,
      "community1Ref": community1.asset->_id,
      "community2Url": community2.asset->url,
      "community2Ref": community2.asset->_id,
      "community3Url": community3.asset->url,
      "community3Ref": community3.asset->_id,
      "hero3Url": heroSlide3.asset->url,
      "hero3Ref": heroSlide3.asset->_id
    }`, {}, { cache: 'no-store' }); // Ensure fresh fetch for admin
    return NextResponse.json(settings || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const doc: any = {
      _type: "siteSettings",
      _id: "siteSettings"
    };

    if (body.logoRef) {
      doc.logo = { _type: "image", asset: { _type: "reference", _ref: body.logoRef } };
    }
    if (body.heroSlide1Ref) {
      doc.heroSlide1 = { _type: "image", asset: { _type: "reference", _ref: body.heroSlide1Ref } };
    }
    if (body.heroSlide2Ref) {
      doc.heroSlide2 = { _type: "image", asset: { _type: "reference", _ref: body.heroSlide2Ref } };
    }
    if (body.heroSlide3Ref) {
      doc.heroSlide3 = { _type: "image", asset: { _type: "reference", _ref: body.heroSlide3Ref } };
    }
    if (body.community1Ref) {
      doc.community1 = { _type: "image", asset: { _type: "reference", _ref: body.community1Ref } };
    }
    if (body.community2Ref) {
      doc.community2 = { _type: "image", asset: { _type: "reference", _ref: body.community2Ref } };
    }
    if (body.community3Ref) {
      doc.community3 = { _type: "image", asset: { _type: "reference", _ref: body.community3Ref } };
    }

    const result = await writeClient.createOrReplace(doc);
    return NextResponse.json({ success: true, settings: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
