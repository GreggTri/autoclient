'use server'

import { prisma } from "@/utils/prisma";


export async function checkToken(token: string){
    const getUserIdFromToken = await prisma.resetPass.findUnique({
        where: {
            'token': token
        },
        select: {
            'id': true,
            'expireAt': true,
            'isActive': true
        }
    })

    if(getUserIdFromToken == null){
        return false
    }

    if (getUserIdFromToken.expireAt <= new Date()) {
        return false
    }

    if(getUserIdFromToken.isActive == false){
        return false
    }

    return true
}