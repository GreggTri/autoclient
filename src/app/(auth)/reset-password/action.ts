'use server'

import 'server-only'
import { ResetPasswordState } from "@/app/_lib/definitions";
import { redirect } from "next/navigation";
import { z } from "zod"
import bcrypt from 'bcrypt';
import { prisma } from "@/utils/prisma";
import assert from "assert";

const formSchema = z.object({
    token: z.string(),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be no more than 64 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .trim(),
    confirmPassword: z.string()
})
.refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // Point the error to confirmPassword
    message: "Passwords must match",
});
  
  
export async function updateUserResetPassword(state: ResetPasswordState, formData: FormData){

    const validationResult = formSchema.safeParse({
        token: formData.get('token'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    })
    
    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    //passed validation
    const { token, confirmPassword } = validationResult.data
    
    try{
        const getUserIdFromToken = await prisma.resetPass.findUnique({
            where: {
                'token': token
            },
            select: {
                'id': true,
                'userId': true,
                'tenantId': true,
                'expireAt': true,
                'isActive': true
            }
        })

        assert(getUserIdFromToken)

        if (getUserIdFromToken.expireAt <= new Date()) {
            throw new Error("Reset password has expired.");
        }

        if(getUserIdFromToken.isActive == false){
            throw new Error("Reset password has expired.");
        }

        const hashedPassword = await bcrypt.hash(confirmPassword, 10)

        const updatedUser = await prisma.user.update({
            'where': {
                'id': getUserIdFromToken.userId,
                'tenantId': getUserIdFromToken.tenantId
            },
            data: {
                'password': hashedPassword
            }
        })

        assert(updatedUser)

        await prisma.resetPass.update({
            where: {
                'token': token
            },
            data: {
                'isActive': false
            }
        })

        redirect('/login')
    }
    catch(error)  {
        console.log(error);

        return {
            message: "Something went wrong! contact support!"
        }
    }
}