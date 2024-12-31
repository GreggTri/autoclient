'use server'

import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
//import { revalidatePath } from "next/cache";
import { VapiClient } from "@vapi-ai/server-sdk";


type VoiceProvider = 
  | "cartesia"
  | "deepgram"
  | "azure"
  | "11labs"
  | "lmnt"
  | "neets"
  | "playht"
  | "rime-ai"
  | "tavus";

interface VoiceOption {
  provider: VoiceProvider;
  voiceId: string;
}


const vapi = new VapiClient({ token: process.env.VAPI_TOKEN });

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const createAgent = async (firstMessage: string, voiceOptions: string, systemPrompt: string, dataCollection: any) => {
  const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
  if (!session) return null;

  let firstVoiceOption: VoiceOption;
  let secondVoiceOption: VoiceOption;
  if(voiceOptions == "female"){
    //female
    firstVoiceOption = {
      "provider": "cartesia",
      "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d"
    }
    //male
    secondVoiceOption = {
      "provider": "cartesia",
      "voiceId": "ee7ea9f8-c0c1-498c-9279-764d6b56d189"
    }
  }
  else {
    //male
    firstVoiceOption = {
      "provider": "cartesia",
      "voiceId": "ee7ea9f8-c0c1-498c-9279-764d6b56d189" 
    }
    //female
    secondVoiceOption = {
      "provider": "cartesia",
      "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d"
    }
  }

  const response = await vapi.assistants.create({
    "name": "IntakeAgent",
    'transcriber': {
        'provider': "deepgram",
        'language': "en",
        'model': "nova-2-general"
    },
    "model": {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": systemPrompt
            }
        ],
        "provider": "openai",
        "temperature": 0.7,
        //this needs to be figured out better, how to add this later too as an update kinda thing
        // "knowledgeBase": {
        // },
        "emotionRecognitionEnabled": true
    },
    'voice': {
        "provider": firstVoiceOption.provider,
        "voiceId": firstVoiceOption.voiceId,
        "chunkPlan": {
            "enabled": true,
            "minCharacters": 10,
        },
        "fallbackPlan": {
        "voices": [
            {
              "provider": secondVoiceOption.provider,
              "voiceId": secondVoiceOption.voiceId
            }
          ]
        },
        // 'properties': {
        //     "maxCallDuration": 1.1,
        //     "participantLeftTimeout": 1.1,
        //     "participantAbsentTimeout": 1.1,
        //     "enableRecording": true,
        //     "enableTranscription": true,
        // }
    },
    //"recordingEnabled": true,
    "firstMessage": firstMessage,
    "firstMessageMode": "assistant-speaks-first",
    "hipaaEnabled": false,
    "startSpeakingPlan": {
        "waitSeconds": 0.8,
        "transcriptionEndpointingPlan": {
            "onPunctuationSeconds": 0.4,
            "onNoPunctuationSeconds": 1
        },
        "smartEndpointingEnabled": false
    },
    "silenceTimeoutSeconds": 300,
    "maxDurationSeconds": 10800,
    "backgroundSound": "off",
    "clientMessages": [
        "conversation-update",
        "function-call"
    ],
    "serverMessages": [
        "hang",
        "model-output"
    ],
    "endCallPhrases": [
        "goodbye"
    ],
    "backgroundDenoisingEnabled": false,
    "stopSpeakingPlan": {
        "numWords": 0
    },
  });
  
  
  console.log(response);
  
  if (response == null) {
    console.log("response not okay but made it past data");
    throw new Error("Vapi gave null response when trying to create an agent");
  }


  return response

}


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