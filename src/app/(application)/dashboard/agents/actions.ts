'use server'

import 'server-only'
import { createAgent, updateAgent } from "@/app/_data/agent";
import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";
import assert from "assert";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
    firstMessage: z.string(),
    voiceOptions: z.enum(['male', 'female' ]),
    systemPrompt: z.string(),
    dataCollection: z.array(
      z.object({
        fieldName: z.string().min(1, 'Field Name is required'),
        valueType: z.enum(['text', 'number', 'datetime', 'email', 'trueFalse', 'list']),
        fieldDescription: z.string().min(1, 'Field Description is required'),
      })
    ).optional()
  })
  
  type FormValues = z.infer<typeof formSchema>

export async function createAgentAction(formData: FormValues){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;
    if(!session.subscriptionId) throw new Error("Set Up Billing First")
        
    const { firstMessage, voiceOptions, systemPrompt, dataCollection } = formData

    assert( dataCollection != undefined);

    const newAgent = await createAgent(firstMessage, voiceOptions, systemPrompt, dataCollection)
    assert( newAgent != null);

    const createdSIPURI = await fetch(`${process.env.VAPI_API_URL}/phone-number`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
        },
        body: JSON.stringify({
            "provider": "vapi",
            "sipUri": `sip:${newAgent.id}:AC@sip.vapi.ai`,
            "assistantId": newAgent.id
        })

    })

    console.log(createdSIPURI);
  
    if (!createdSIPURI.ok) {
        console.log(await createdSIPURI.json());
        throw new Error(`Request failed with status: ${createdSIPURI.status}`);
    }

    const sipURI = await createdSIPURI.json()

    const insertedAgent = await prisma.agent.create({
        data: {
            'id': newAgent!.id,
            'tenantId': String(session.tenantId),
            'phoneNumberId': sipURI.id,
            'sipURI': sipURI.sipUri
        }
    })

    return insertedAgent
}

export async function updateAgentAction(agentId: string, formData: FormValues){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const { firstMessage, voiceOptions, systemPrompt, dataCollection } = formData

    assert( dataCollection != undefined);

    const updatedAgent = await updateAgent(agentId, firstMessage, voiceOptions, systemPrompt, dataCollection)

    assert( updatedAgent != null);

    return updatedAgent
}

export async function deactivateGroup(agentId: string){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    try{

    console.log(agentId);        


    } catch(error){
        console.log({
            'success': false,
            'function': 'createScheduleSender',
            'error': error,
            'message': "Failed to create Scheduled Send."
        });

        return null
    }
}