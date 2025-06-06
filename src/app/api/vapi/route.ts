'use server'

import { prisma } from "@/utils/prisma";
import assert from "assert";
import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.STRIPE_API_KEY}`, {
  apiVersion: '2024-12-18.acacia'
});



export async function POST(request: Request) {
  const payload = await request.json();
  try {
    console.log(payload);

    if(payload.message.type == "end-of-call-report"){

      const getOrgFromAgent = await prisma.agent.findUnique({
        'where': {
          'id': payload.message.call.assistantId
        },
        'include': {
          'org': true
        }
      })

      assert(getOrgFromAgent)
      assert(getOrgFromAgent.org.stripeCustomerId)

      console.log(payload.message.analysis.summary);

      const createdCall = await prisma.call.create({
        data: {
          id: payload.message.call.id,
          agentId: payload.message.call.assistantId,
          tenantId: getOrgFromAgent.tenantId,
          durationSeconds: payload.message.durationSeconds,
          cost: payload.message.cost,
          summary: payload.message.analysis.summary, 
          transcript: payload.message.transcript,
          recording: payload.message.recordingUrl,
          timestamp: String(payload.message.timestamp),
          'lead': {
            'create': {
              'tenantId': getOrgFromAgent.tenantId,
              'data': payload.message.analysis.structuredData
            }
          }
        }
      })

      assert(createdCall)

      const SendMeteredBillingEvent = await stripe.billing.meterEvents.create({
        event_name: 'call_time',
        payload: {
          stripe_customer_id: getOrgFromAgent.org.stripeCustomerId,
          value: `${createdCall.durationSeconds}`
        }
      })

      assert(SendMeteredBillingEvent)

      const updateCall = await prisma.call.update({
        where: {
          'id': createdCall.id,
          'tenantId': createdCall.tenantId
        },
        data: {
          'stripeBilledCall': true
        }
      })

      assert(updateCall)
      

      return NextResponse.json({ body: {success: true}, status: 200 });

    } else {
      return NextResponse.json(
        { error: "Unable to process this type of Vapi Webhook" },
        { status: 500 }
      );
    }
  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}