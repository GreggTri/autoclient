import 'server-only'

import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
import assert from "assert";
// import { revalidatePath } from "next/cache";
// import { VapiClient } from "@vapi-ai/server-sdk";

//const client = new VapiClient({ token: process.env.VAPI_API_KEY });

export const listCalls = cache(async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const callList = await prisma.call.findMany({
        'where': {
            'tenantId': String(session.tenantId)
        },
        select: {
            'id': true,
            'agentId': false,
            'durationSeconds': true,
            'recording': false,
            'summary': false,
            'transcript': false,
            'timestamp': true,
            'cost': false,
            'lead': {
                'select': {
                    'id': true
                }
            },
            'stripeBilledCall': false
        }
    })

    assert(callList)

    return callList
}) 



export const getCall = async (callId: string) => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const call = await prisma.call.findUnique({
        'where': {
            'id': callId,
            'tenantId': String(session.tenantId),
        },
        'select': {
            'id': true,
            'agentId': true,
            'durationSeconds': true,
            'recording': true,
            'summary': true,
            'transcript': true,
            'timestamp': true,
            'cost': false,
            'lead': {
                'select': {
                    'id': true
                }
            },
            'stripeBilledCall': false
        }
    })

    assert(call)

    return call

}