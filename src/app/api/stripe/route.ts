'use server'

import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.STRIPE_API_KEY}`, {
  apiVersion: '2024-12-18.acacia'
});


export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');

  try {
    const rawBody = await request.text();
    console.log(rawBody);
    console.log("THIS IS FOR SPACE BETWEEN");
    const event = stripe.webhooks.constructEvent(rawBody, String(sig), `${process.env.STRIPE_SIGNING_SECRET}`);

    console.log(event);

    return NextResponse.json({body: {
        success: true
    }, status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}