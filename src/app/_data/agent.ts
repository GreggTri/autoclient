import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
//import { revalidatePath } from "next/cache";

const VAPI_TOKEN = process.env.VAPI_API_KEY;
const VAPI_API_URL = process.env.VAPI_API_KEY


export const createAgent = cache(async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const response = await fetch(`${VAPI_API_URL}/assistants`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            'transcriber': {
                'provider': "deepgram",
                'language': "en",
                'model': "Nova-2-General"
            },
            'model': {
                'provider': "openai",
                'model': "gpt-4o-mini",
                "emotionRecognitionEnabled": true,
                "maxTokens": 250,
                "temperature": .8,
            },
            'voice': {
                "provider": "cartesia",
                "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d",
                "chunkPlan": {
                    "enabled": true,
                    "minCharacters": 10,
                },
                "fallbackPlan": {
                "voices": [
                    {
                    "provider": "cartesia",
                    "voiceId": "ee7ea9f8-c0c1-498c-9279-764d6b56d189"
                    }
                ]
                },
                'properties': {
                    "maxCallDuration": 1.1,
                    "participantLeftTimeout": 1.1,
                    "participantAbsentTimeout": 1.1,
                    "enableRecording": true,
                    "enableTranscription": true,
                }
            },
            "firstMessage": "Hello! How can I help you today?",
            "firstMessageMode": "assistant-speaks-first",
            "hipaaEnabled": false,
            "startSpeakingPlan": {
                "waitSeconds": 0.5,
                "smartEndpointingEnabled": true,
            },
            "silenceTimeoutSeconds": 300,
            "maxDurationSeconds": 10800,
            "backgroundSound": "off",
        }),
      });
    
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: Record<string, any> = await response.json();
    
      console.log(data);
      
      if (!response.ok) {
        console.log("response not okay but made it past data");
        throw new Error(data.error.message);
      }
      
      

      return {
        'name': data!.name,
      };

})



export const getAgent = cache(async (agentId: string) => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const response = await fetch(`${VAPI_API_URL}/assistants/${agentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${VAPI_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });
    
      const data = await response.json();
    
      console.log(data);
    
      if (!response.ok) {
        console.log("response not okay but made it past data");
        throw new Error(data.error.message);
      }
    
      return data

})



export const listAgents = cache(async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    //list from database
    const getAgents = await prisma.agent.findMany({
      where: {
        'tenantId': Number(session.tenantId)
      }
    })
 
    return getAgents
})



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateAgent = cache(async (agentId: string, newAgentParams: any) => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const response = await fetch(`${VAPI_API_URL}/assistants/${agentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${VAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: newAgentParams
      });
    
      const data = await response.json();
    
      console.log(data);
    
      if (!response.ok) {
        console.log("response not okay but made it past data");
        throw new Error(data.error.message);
      }
    
      return {
        'name': data!.name,
      };

})