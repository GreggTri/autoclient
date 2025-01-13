'use server'

import { prisma } from "@/utils/prisma";
import assert from "assert";
import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.STRIPE_API_KEY}`, {
  apiVersion: '2024-12-18.acacia'
});

export async function POST(request: Request) {

  try {
    const data = await request.json()

    console.log(data.data.object);

    const getSub = await stripe.subscriptions.update(
      data.object.subscription,
      {
        'items': [
          {
            'price': process.env.STRIPE_USAGE_PRICE_ID
          }
        ],
        'metadata': {
          'tenantId': data.data.object.client_reference_id
        }
      }
    )

    assert(getSub)

    const getOrg = await prisma.org.update({
      where: {
        id: data.data.object.client_reference_id
      },
      data: {
        'stripeCustomerId': data.data.object.customer,
        'stripeSubscriptionId': getSub.id,
        'stripeCurrentPeriodEnd': getSub.current_period_end,
        'stripeStatus': "ACTIVE"
        
      } 
    })

    assert(getOrg)

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