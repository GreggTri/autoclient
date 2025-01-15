import 'server-only'

import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
import assert from "assert";
//import { revalidatePath } from "next/cache";
import { VapiClient } from "@vapi-ai/server-sdk";

const vapiServer = new VapiClient({ token: process.env.VAPI_API_KEY });

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
  valueType: "number" | "text" | "trueFalse" | "list";         // e.g. "string", "boolean", "number"
  fieldDescription: string;
}

// Map customer-facing types to standard programming types
const valueTypeMapping: Record<string, string> = {
  text: "string",
  number: "number",
  trueFalse: "boolean",
  list: "array"
};

function generateStructuredDataSchema(dataCollection: DataField[]) {
  // Build the "properties" object
  const properties = dataCollection.reduce((acc, curr) => {
    // Map valueType to standard programming type
    const programmingType = valueTypeMapping[curr.valueType] || "string"; // Default to string if not matched

    acc[curr.fieldName] = {
      description: curr.fieldDescription,
      type: programmingType,
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

export const createAgent = async (
  firstMessage: string, 
  voiceOptions: string, 
  systemPrompt: string,
  dataCollection: DataField[],
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

  const response = await fetch(`${process.env.VAPI_API_URL}/assistant`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
    },
    body: JSON.stringify({
      "name": `IntakeAgent-${new Date().getTime()}`,
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
        "url": `${process.env.AUTOCLIENT_API_URL}/vapi`,
        "timeoutSeconds": 20,
      },
      "analysisPlan": {
        "summaryPlan": {
          "enabled": true
        },
        "structuredDataPrompt": "[Transcript Handling]some data will be spelt out for you to more accurately input the data into the Structured Data Schema. Use context awareness to understand when this is occurring and use the spelt out data to satisfy the schema requirements where applicable. Fields that require a DateTime value should be given in this example format: 2025-01-14 14:17:43",
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
  
  if (!response.ok) {
    console.log(await response.json());
    throw new Error(`Request failed with status: ${response.status}`);
  }

  const data = await response.json();

  return data

}


export const updateAgent = async (
  agentId: string,
  firstMessage: string, 
  voiceOptions: string, 
  systemPrompt: string,
  dataCollection: DataField[],
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
    //TODO:: FIND ANOTHER FEMALE VOICE OPTION THAT IS GOOD
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
    //TODO:: FIND ANOTHER MALE VOICE OPTION THAT IS GOOD
    //female
    secondVoiceOption = {
      "provider": "cartesia",
      "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d"
    }
  }

  const AUTOCLIENT_MASTER_DIRECTIVES = `
  [Master Directives - Everything below this line is a Master Directive]
  Do not invent information not drawn from the context. Answer only questions related to the context.
  You should space out when asking for clients information. 
  you're having a conversation with a human being, focus on being genuine.

  [Error Handling]
  If the customer's response is unclear, ask clarifying questions. 
  If you encounter any issues, inform the client politely and ask to repeat.

  [Response Handling]
  evaluate the customer's response to determine if it qualifies as a valid answer. 
  Use context awareness to assess relevance and appropriateness. 
  If the response is valid, proceed to the next relevant question or instructions. 
  Avoid infinite loops by moving forward when a clear answer cannot be obtained.
  `

  const response = await fetch(`${process.env.VAPI_API_URL}/assistant/${agentId}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
    },
    body: JSON.stringify({
      "model": {
          "model": "gpt-4o",
          "messages": [
              {
                  "role": "system",
                  "content": systemPrompt + AUTOCLIENT_MASTER_DIRECTIVES
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
        "url": `${process.env.AUTOCLIENT_API_URL}/vapi`,
        "timeoutSeconds": 20,
      },
      "analysisPlan": {
        "summaryPlan": {
          "enabled": true
        },
        "structuredDataPrompt": "[Transcript Handling]some data will be spelt out for you to more accurately input the data into the Structured Data Schema. Use context awareness to understand when this is occurring and use the spelt out data to satisfy the schema requirements where applicable. Fields that require a DateTime value should be given in this example format: 2025-01-14 14:17:43",
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
    })
  })
  
  
  if (!response.ok) {
    console.log(await response.json());
    throw new Error(`Request failed with status: ${response.status}`);
  }

  const data = await response.json();

  return data

}




function formatPropertiesToDataCollection(properties: Record<string, { description: string; type: string }>): DataField[] {
  return Object.entries(properties).map(([key, value]) => {
    const mappedType = valueTypeMapping[value.type] as DataField["valueType"] | undefined; // Narrow the type

    return {
      fieldName: key,
      valueType: mappedType ?? "text", // Default to "text" if the mapping is invalid
      fieldDescription: value.description,
    };
  });
}



//grabs all data for agent from Vapi
export const getAgentDataVapi = cache(async (agentId: string) => {
  const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
  if (!session) return null;

  //grab agent data from vapi to be able to edit / update
  const agentData = await vapiServer.assistants.get(agentId);

  assert(agentData != null)
  assert(agentData.model)
  assert(agentData.model.messages)
  assert(agentData.model.messages[0].content != undefined)
  const voiceId = (agentData.voice as { voiceId: string }).voiceId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const structuredDataSchema = (agentData.analysisPlan as { structuredDataSchema: { properties: Record<string, any> } }).structuredDataSchema.properties;
  
  let voiceOption;

  if(voiceId == "248be419-c632-4f23-adf1-5324ed7dbf1d"){
    //female
    voiceOption = "female"
  }
  else {
    //male
    voiceOption = "male"
  }

  return {
    firstMessage: agentData.firstMessage, 
    voiceOptions: voiceOption,
    systemPrompt: agentData.model.messages[0].content,
    dataCollection: formatPropertiesToDataCollection(structuredDataSchema)
  }

})



//grabs id from database for agent
export const getAgent = cache(async (agentId: string) => {
  const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
  if (!session) return null;

  const getAgent = await prisma.agent.findUnique({
    where: {
      id: agentId,
      tenantId: String(session.tenantId)
    }
  })

  assert(getAgent != null)

  return getAgent
})



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