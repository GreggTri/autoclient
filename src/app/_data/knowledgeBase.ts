import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";

export const listKnowledgeBases = cache(async () => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    
})