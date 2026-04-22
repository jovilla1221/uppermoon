import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { writeClient } from "@/sanity/lib/writeClient";
import { snap } from "@/lib/midtrans";
import crypto from "crypto";

// We'll use a simple nanoid or similar for order ID if not available
// Or just use timestamp + random
const generateOrderId = () => `UM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartItems, shippingAddress, customerPhone, shippingCost, courierName, courierService } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Calculate Prices
    const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const actualShippingCost = shippingCost || 0;
    const totalAmount = subtotal + actualShippingCost;
    const orderId = generateOrderId();

    // 2. Prepare Order Document for Sanity
    const orderDoc = {
      _type: "order",
      orderId,
      user: {
        _type: "reference",
        _ref: user.userId,
      },
      customerName: user.username,
      customerEmail: user.email,
      customerPhone,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        province: shippingAddress.province,
        postalCode: shippingAddress.postalCode,
        cityId: shippingAddress.cityId,
        provinceId: shippingAddress.provinceId,
        districtId: shippingAddress.districtId,
      },
      courierName,
      courierService,
      items: cartItems.map((item: any) => ({
        _key: crypto.randomBytes(8).toString('hex'),
        productName: item.name,
        productSlug: item.id.split('-')[0], // items usually have id as slug-size
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        collection: item.collection,
      })),
      subtotal,
      shippingCost: actualShippingCost,
      totalAmount,
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    // 3. Save to Sanity
    const createdOrder = await writeClient.create(orderDoc);

    // 4. Create Midtrans Transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      item_details: [
        ...cartItems.map((item: any) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: `${item.name} (${item.size})`,
        })),
        {
          id: "SHIPPING",
          price: actualShippingCost,
          quantity: 1,
          name: courierName ? `${courierName} - ${courierService}` : "Shipping Cost",
        }
      ],
      customer_details: {
        first_name: user.username,
        email: user.email,
        phone: customerPhone,
        shipping_address: {
          first_name: user.username,
          phone: customerPhone,
          address: shippingAddress.street,
          city: shippingAddress.city,
          postal_code: shippingAddress.postalCode,
          country_code: "IDN"
        }
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders/${orderId}`,
      },
      enabled_payments: ["other_qris", "gopay"]
    };

    const transaction = await snap.createTransaction(parameter);

    // 5. Update order with Snap Token
    await writeClient
      .patch(createdOrder._id)
      .set({ snapToken: transaction.token })
      .commit();

    return NextResponse.json({
      orderId,
      _id: createdOrder._id,
      snapToken: transaction.token,
    });
  } catch (error: any) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
