import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

// Fetch all site users
export async function GET() {
  try {
    const users = await writeClient.fetch(
      `*[_type == "siteUser"] | order(_createdAt desc) {
        _id,
        _type,
        fullName,
        email,
        role,
        isVerified,
        lastLoginAt,
        _createdAt
      }`
    );
    return NextResponse.json(users || []);
  } catch (error: any) {
    console.error("[ADMIN_USERS_GET_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update user role
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json({ error: "Missing user ID or role" }, { status: 400 });
    }

    const result = await writeClient
      .patch(id)
      .set({ role })
      .commit();

    return NextResponse.json({ success: true, id: result._id });
  } catch (error: any) {
    console.error("[ADMIN_USERS_PATCH_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete user account
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_USERS_DELETE_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
