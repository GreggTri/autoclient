'use server'

import { prisma } from "@/utils/prisma";
import assert from "assert";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

  try {
    const data = await request.json()

    const getOrg = await prisma.org.update({
      where: {
        id: data.object.metadata.tenantId
      },
      data: {
        'stripeCustomerId': data.object.customer,
        'stripeSubscriptionId': null,
        'stripeCurrentPeriodEnd': null
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