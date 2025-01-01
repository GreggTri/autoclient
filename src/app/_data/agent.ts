'use server'

import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
//import { revalidatePath } from "next/cache";
//import { VapiClient } from "@vapi-ai/server-sdk";


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

//const vapi = new VapiClient({ token: process.env.VAPI_TOKEN });

interface DataField {
  fieldName: string;
  valueType: "number" | "text" | "datetime" | "email";         // e.g. "string", "boolean", "number"
  fieldDescription: string;
}

export const createAgent = async (
  firstMessage: string, 
  voiceOptions: string, 
  systemPrompt: string,
  dataCollection: DataField[], 
  tenantId: string
) => {
  
  const structuredDataSchema = generateStructuredDataSchema(dataCollection);

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

  console.log(dataCollection);

  const response = await fetch(`${process.env.VAPI_API_URL}/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      "name": `IntakeAgent-${tenantId}`,
      'transcriber': {
          'provider': "deepgram",
          'language': "en",
          'model': "nova-2-general"
      },
      "model": {
          "model": "gpt-4o",
          "messages": [
              {
                  "role": "system",
                  "content": systemPrompt
              }
          ],
          "provider": "openai",
          "temperature": 0.7,
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
      },
      "firstMessage": firstMessage,
      "firstMessageMode": "assistant-speaks-first",
      "serverMessages": [
          "end-of-call-report"
      ],
      "server": {
        "url": String(process.env.AUTOCLIENT_API_URL),
        "timeoutSeconds": 20,
      },
      "analysisPlan": {
        "summaryPlan": {
          "enabled": true
        },
        "structuredDataPrompt": "[Transcript Handling]\nsome data will be spelt out for you to more accurately input the data into the Structured Data Schema. Use context awareness to understand when this is occurring and use the spelt out data to satisfy the schema requirements where applicable.",
        "structuredDataSchema": structuredDataSchema
      },
      "artifactPlan": {
        "recordingEnabled": true,
        "videoRecordingEnabled": false,
        "transcriptPlan": {
          "enabled": true,
        }
      },
      "hipaaEnabled": false,
      "startSpeakingPlan": {
          "waitSeconds": 0.8,
          "transcriptionEndpointingPlan": {
              "onPunctuationSeconds": 0.6,
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
      "endCallPhrases": [
          "goodbye"
      ],
      "backgroundDenoisingEnabled": false,
      "stopSpeakingPlan": {
          "numWords": 0
      },
    })
  })
  
  console.log(response);
  
  if (!response.ok) {
    throw new Error(`Request failed with status: ${response.status}`);
  }

  const data = await response.json();

  return data

}

function generateStructuredDataSchema(dataCollection: DataField[]) {
  // Build the "properties" object
  const properties = dataCollection.reduce((acc, curr) => {
    acc[curr.fieldName] = {
      description: curr.fieldDescription,
      type: curr.valueType,
    };
    return acc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>);

  // Collect all the fieldNames as required
  const requiredFields = dataCollection.map((field) => field.fieldName);

  return {
    type: "object",
    properties,
    required: requiredFields,
  };
}





export const listAgents = cache(async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    //list from database
    const getAgents = await prisma.agent.findMany({
      where: {
        'tenantId': String(session.tenantId)
      }
    })
 
    return getAgents
})