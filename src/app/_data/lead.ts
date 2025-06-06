import 'server-only'

import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
import assert from "assert";
//import { revalidatePath } from "next/cache";
//import { VapiClient } from "@vapi-ai/server-sdk";

//const vapi = new VapiClient({ token: process.env.VAPI_API_KEY });

export const listLeads = cache(async ({ sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 }) => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const getLeads = await prisma.lead.findMany({
        where: {
            'tenantId': String(session.tenantId)
        },
        'select': {
            'id': true,
            'createdAt': true
        },
        orderBy: {
            [sortBy]: sortOrder, // Sort by the specified field and order
        },
        skip: (page - 1) * limit, // Skip leads for pagination
        take: limit, // Limit the number of leads fetched
    })

    if(!getLeads){

        return []; // Return an empty array if no leads exist
    }

    return getLeads
})


export const getLead = async (leadId: string) => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const lead = await prisma.lead.findUnique({
        'where': {
            'id': leadId,
            'tenantId': String(session.tenantId),
        },
        'select': {
            'id': true,
            'callId': true,
            'data': true,
            'createdAt': true
        }
    })

    assert(lead)

    return lead

}


export const createLead = async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;


}


export const editLead = async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    
}