'use server'

import { prisma } from "@/utils/prisma";
import assert from "assert";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

  try {
    const data = await request.json()

    console.log(data.data.object);

    const getOrg = await prisma.org.update({
      where: {
        id: data.data.object.metadata.tenantId
      },
      data: {
        'stripeCustomerId': data.data.object.customer,
        'stripeSubscriptionId': null,
        'stripeCurrentPeriodEnd': null,
        'stripeStatus': "CANCELED"
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