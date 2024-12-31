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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  console.log(dataCollection);

  const response = await vapi.assistants.create({
    "name": "IntakeAgent",
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
      "secret": "string",
    },
    "analysisPlan": {
      "summaryPlan": {
        "enabled": true,
        "timeoutSeconds": 20
      },
      "structuredDataPlan": {
        "messages": [
          {
            "role": "system",
            "content": "[Transcript Handling]\nsome data will be spelt out for you to more accurately input the data into the Structured Data Schema. Use context awareness to understand when this is occurring and use the spelt out data to satisfy the schema requirements where applicable."
          },
          {
            "role": "user", 
            "content": "Here is the transcript:\n\n{{transcript}}\n\n"
          }
        ],
        "enabled": true,
        "schema": {
          "type": "object",
          "properties": {
            "Client Name": {
              "description": "This is the name of the human you are speaking to",
              "type": "string"
            },
            "Client Email": {
              "description": "The email of the client you are talking too",
              "type": "string"
            },
            "PoliceReport": {
              "description": "Does the potential new client know if there was a police report made",
              "type": "boolean"
            },
            "haveInsurance": {
              "description": "Does the potential new client you are talking to have insurance?",
              "type": "boolean"
            },
            "clientPhoneNumber": {
              "description": "The Phone number that belongs to the client you are talking too.",
              "type": "string"
            },
            "AccidentDescription": {
              "description": "What is the potential new clients description of the accident",
              "type": "string"
            },
            "DateTime of Accident": {
              "description": "This is the Date of the Accident that occured that potential new client is talking about.",
              "type": "string"
            }
          },
          "required": [
            "Client Name",
            "Client Email",
            "PoliceReport",
            "haveInsurance",
            "clientPhoneNumber",
            "AccidentDescription",
            "DateTime of Accident"
          ]
        },
        "timeoutSeconds": 20
      }
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
        'tenantId': String(session.tenantId)
      }
    })
 
    return getAgents
})