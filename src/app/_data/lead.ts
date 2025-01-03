import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
//import { revalidatePath } from "next/cache";
//import { VapiClient } from "@vapi-ai/server-sdk";

//const vapi = new VapiClient({ token: process.env.VAPI_API_KEY });

export const listleads = cache(async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const getLeads = await prisma.lead.findMany({
        where: {
            'tenantId': String(session.tenantId)
        }
    })

    if(!getLeads){

        throw new Error("No leads exist")
    }

    return getLeads
})


export const getLead = async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;


}


export const createLead = async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;


}


export const editLead = async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    
}