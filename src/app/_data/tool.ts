import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { VapiClient } from "@vapi-ai/server-sdk";

const vapi = new VapiClient({ token: process.env.VAPI_API_KEY });

export const createIntakeTooling = cache(async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const vapiIntakeFunctionTool = await vapi.tools.create({

    })

    const vapiIntakeEndCallTool = await vapi.tools.create({

    })




})

export const updateIntakeTooling = cache(async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const vapiIntakeFunctionTool = await vapi.tools.update({

    })
    
    const vapiIntakeEndCallTool = await vapi.tools.update({

    })
})