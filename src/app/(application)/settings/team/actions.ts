'use server'
import 'server-only'

import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import InviteUserEmail from '@/app/_components/emailTemplates/inviteuser';
import { generateToken } from '@/app/_lib/tokens';
import assert from 'assert';
import { z } from 'zod';
import { deactivateInvite } from '@/app/(auth)/register/[tokenId]/action';
import toCapitalized from '@/app/_lib/toCapitalized';

const resend = new Resend(process.env.RESENT_API_KEY);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  email: z.string().email("Please enter a valid email").trim()
})
  
type FormValues = z.infer<typeof formSchema>

export const sendUserInvite = async(formData: FormValues) => {
    const session = await verifySession(true)//adding true here means admin only endpoint
    if (!session) return;

    assert(formData !== null && formData.email !== null)

    const newUserEmail: string = String(formData.email).toLowerCase()

    const getUser = await prisma.user.findUnique({where: {
        id: session.userId,
        tenantId: String(session.tenantId)
    }, select: {
        firstName: true,
        lastName: true,
        email: true
    }})

    

    const isEmailAlreadyUser = await prisma.user.findUnique({
        where: {
            tenantId: String(session.tenantId),
            email: newUserEmail
        },
        select: {
            id: true
        }
    })

    if(isEmailAlreadyUser){
        throw new Error("User already exists!")
    }

    const isEmailAlreadyInvited = await prisma.invite.findFirst({
        where: {
            tenantId: String(session.tenantId),
            invitedEmail: newUserEmail,
            isActive: true
        }
    })

    const getOrg = await prisma.org.findUnique({
        where: {
            id: String(session.tenantId!)
        },
        select: {
            id: true,
            companyName: true,
        }
    })

    //asserting that these values must exist.
    assert(getUser != null && getOrg != null)
    assert(getUser.firstName && getUser.lastName && getUser.email)

    if(isEmailAlreadyInvited){
        if(is15DaysOrMore(isEmailAlreadyInvited.createdAt)){
            await deactivateInvite(isEmailAlreadyInvited.token)

            return null
        }

        const emailResponse = await resend.emails.send({
            from: 'AutoClient <onboarding@updates.getautoclient.com>',
            to: [newUserEmail],
            subject: `${getUser.firstName} ${getUser.lastName} invited you to Auto Client for ${getOrg.companyName}`,
            react: InviteUserEmail({inviteLink: `${process.env.AUTOCLIENT_URL}/register/${isEmailAlreadyInvited.token}`, invitedByEmail: getUser.email, firstName: toCapitalized(getUser.firstName), lastName: toCapitalized(getUser.lastName), companyName: getOrg.companyName}), // figure this out still and add info props some how.
        });
    
        if (!emailResponse){
            throw new Error("Resend failed to send email!")
        }

        return isEmailAlreadyInvited
    }

    const newToken = generateToken()
    
    
    const emailResponse = await resend.emails.send({
        from: 'AutoClient <onboarding@updates.getautoclient.com>',
        to: [newUserEmail],
        subject: `${getUser.firstName} ${getUser.lastName} invited you to Auto Client for ${getOrg.companyName}`,
        react: InviteUserEmail({inviteLink: `${process.env.AUTOCLIENT_URL}/register/${newToken}`, invitedByEmail: getUser.email, firstName: getUser.firstName, lastName: getUser.lastName, companyName: getOrg.companyName}), // figure this out still and add info props some how.
    });

    if (!emailResponse){
        throw new Error("Resend failed to send email!")
    }

    const updateInvitesOrg = await prisma.invite.create({
        data: {
            tenantId: String(session.tenantId),
            invitedEmail: newUserEmail, 
            token: newToken,
            resendEmailId: emailResponse.data!.id
        }
    })

    if(!updateInvitesOrg){
        throw new Error("couldn't save invite to db, user will not be able to create account via email")
    }

    return updateInvitesOrg
}



export const deleteUser =  async(formData: FormData): Promise<void> => {

    const session = await verifySession(true)//adding true here means admin only endpoint
    if (!session) return;

    
    const id: string = String(formData.get('userId'))

    console.log(id);

    if(id == null || id === "") {
        console.log({
            success: false,
            message: "User does not exist!"
        });
        return;
    }

    await prisma.user.delete({
        where: {
            id: id
        }
    })
    revalidatePath('/settings/profile')
}

export const updateUserAdmin = async (formData: FormData): Promise<void> => {
    const session = await verifySession(true) //adding true here means admin only endpoint
    if (!session) return;


    let isUserAdmin: boolean;

    if(formData.get('isAdmin') === "on"){
        isUserAdmin = true;
    } else {
        isUserAdmin = false;
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: String(formData.get('userId')),
            org: {
                id: session.tenantId!
            }
        },
        data: {
            isAdmin: {
                set: isUserAdmin
            }
        }
    })

    console.log(`${updatedUser.email} is admin?: ${updatedUser.isAdmin}`);
    
    revalidatePath('/settings/profile')
}



function is15DaysOrMore(dateTimeValue: Date): boolean {
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
  
    // Calculate the difference in milliseconds
    const differenceInTime = today.getTime() - dateTimeValue.getTime();
  
    // Convert the difference to days
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
  
    // Check if the difference is 15 days or more
    return differenceInDays >= 15;
  }