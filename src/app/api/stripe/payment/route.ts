'use server'

import { prisma } from "@/utils/prisma";
import assert from "assert";
import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.STRIPE_API_KEY}`, {
  apiVersion: '2024-12-18.acacia'
});

type CheckoutSession = {
  object: {
    id: string;
    object: string;
    adaptive_pricing: null;
    after_expiration: null;
    allow_promotion_codes: boolean;
    amount_subtotal: number;
    amount_total: number;
    automatic_tax: {
      enabled: boolean;
      liability: {
        type: string;
      };
      status: string;
    };
    billing_address_collection: string;
    cancel_url: string;
    client_reference_id: string;
    client_secret: string | null;
    consent: null;
    consent_collection: {
      payment_method_reuse_agreement: null;
      promotions: string;
      terms_of_service: string;
    };
    created: number;
    currency: string;
    currency_conversion: null;
    custom_text: {
      after_submit: null;
      shipping_address: null;
      submit: null;
      terms_of_service_acceptance: null;
    };
    customer: string;
    customer_creation: string;
    customer_email: string | null;
    expires_at: number;
    invoice: string | null;
    invoice_creation: null;
    livemode: boolean;
    locale: string | null;
    mode: string;
    payment_intent: string | null;
    payment_link: string | null;
    payment_method_collection: string;
    payment_method_configuration_details: {
      id: string;
      parent: string | null;
    };
    payment_method_options: {
      card: {
        request_three_d_secure: string;
      };
    };
    payment_method_types: string[];
    payment_status: string;
    phone_number_collection: {
      enabled: boolean;
    };
    recovered_from: null;
    saved_payment_method_options: {
      allow_redisplay_filters: string[];
      payment_method_remove: null;
      payment_method_save: null;
    };
    setup_intent: string | null;
    status: string;
    submit_type: string;
    subscription: string;
    success_url: string;
    ui_mode: string;
    url: string | null;
  };
  previous_attributes: null;
};

export async function POST(request: Request) {

  try {
    const data = await request.json() as CheckoutSession

    console.log(data);

    const getSub = await stripe.subscriptions.update(
      data.object.subscription,
      {
        'items': [
          {
            'price': process.env.STRIPE_USAGE_PRICE_ID
          }
        ],
        'metadata': {
          'tenantId': data.object.client_reference_id
        }
      }
    )

    assert(getSub)

    const getOrg = await prisma.org.update({
      where: {
        id: data.object.client_reference_id
      },
      data: {
        'stripeCustomerId': data.object.customer,
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