'use server'

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
        valueType: z.enum(['text', 'number', 'datetime', 'email', 'trueFalse']),
        fieldDescription: z.string().min(1, 'Field Description is required'),
      })
    ).optional()
  })
  
  type FormValues = z.infer<typeof formSchema>

export async function createAgentAction(formData: FormValues){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const { firstMessage, voiceOptions, systemPrompt, dataCollection } = formData

    assert( dataCollection != undefined);

    const newAgent = await createAgent(firstMessage, voiceOptions, systemPrompt, dataCollection)

    assert( newAgent != null);

    const insertedAgent = await prisma.agent.create({
        data: {
            'id': newAgent!.id,
            'tenantId': String(session.tenantId)
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