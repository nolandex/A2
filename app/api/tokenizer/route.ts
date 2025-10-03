// app/api/tokenizer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Midtrans, { Snap } from 'midtrans-client';

const snap = new Snap({
  isProduction: false,
  serverKey: process.env.NEXT_PUBLIC_SECRET || '',
  clientKey: process.env.NEXT_PUBLIC_CLIENT || '',
});

export async function POST(request: NextRequest) {
  try {
    const { id, productName, price, quantity } = await request.json();

    const parameter: Midtrans.TransactionRequestBody = {
      item_details: {
        name: productName,
        price: price,
        quantity: quantity,
      },
      transaction_details: {
        order_id: `${id}-${Date.now()}`, // Tambah timestamp untuk uniqueness
        gross_amount: price * quantity,
      },
      customer_details: {
        first_name: "Customer",
        email: "customer@example.com",
        phone: "08123456789",
      },
    };

    const token = await snap.createTransactionToken(parameter);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
