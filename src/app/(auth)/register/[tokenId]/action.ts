'use server'

import bcrypt from 'bcrypt';

import { AuthFormState, RegisterFormSchema } from '@/app/_lib/definitions'
import { prisma } from "@/utils/prisma";
import { createSession } from '@/app/_lib/session';
import { redirect } from 'next/navigation';
import assert from 'assert';


export async function registerInvitedUser(state: AuthFormState, formData: FormData){
    // validate email and password
    const validationResult = RegisterFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })

    const tenantId = formData.get('tenantId') as string
    const token = formData.get('token') as string
    
    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    //passed validation
    const { email, password } = validationResult.data

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        })

        if (existingUser){
            return {
                message: 'Email already exists, please use a different email or login.'
            }
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                isAdmin: false,
                'org': {
                    'connect': {
                        'id': tenantId
                    }
                }
            },
            'select': {
                'id': true,
                'isAdmin': true,
                'tenantId': true,
                'org': {
                    'select': {
                        'stripeSubscriptionId': true
                    }
                }

            }

        })

        const invalidatedToken = await prisma.invite.update({
            'where':{
                'token': token
            },
            data: {
                'isActive': false
            }
        })
        
        assert(invalidatedToken)
        
        //we add these too the session because we have viewing priveleges of certain routes via admin 
        //and we must contain/filter all queries via the tenantId
        await createSession(user.id, user.isAdmin, user.tenantId, user.org.stripeSubscriptionId)

        
    } catch (error){
        console.log(error);

        return {
            message: "Something went wrong when registering user!"
        }
    }


    redirect('/dashboard')


}

export async function deactivateInvite(token: string){

    const deactivatedinvite = await prisma.invite.update({
        'where': {
            'token': token
        },
        'data': {
            'isActive': false
        }
    })

    assert(deactivatedinvite)
}