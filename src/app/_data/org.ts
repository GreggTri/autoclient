'use server'
import "server-only"

//import { prisma } from "@/utils/prisma";
import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";

export const getOrg = async() => {
    //this function handles all verification/authorization
    const session = await verifySession(true)
    if (!session) return null;

    try{
        return await prisma.org.findUnique({
            where: {
                id: Number(session.tenantId)
            },
            select: {
                id: true,
                companyName: true,
            }
        })

    } catch(error){
        console.log(error);

        return null;
    }
}
