'use server'
import 'server-only'

import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import InviteUserEmail from '@/app/_components/emailTemplates/inviteuser';
import { generateToken } from '@/app/_lib/tokens';
import assert from 'assert';

const resend = new Resend(process.env.RESENT_API_KEY);

export const sendUserInvite = async(formData: FormData): Promise<void> => {
    const session = await verifySession(true)//adding true here means admin only endpoint
    if (!session) return;

    assert(formData !== null && formData.get('email') !== null)

    const newUserEmail: string = String(formData.get('email')).toLowerCase()

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

    const isEmailAlreadyInvited = await prisma.invite.findFirst({
        where: {
            tenantId: String(session.tenantId),
            invitedEmail: newUserEmail,
            isActive: true
        },
        select: {
            id: true
        }
    })

    assert(isEmailAlreadyInvited == null)

    if(isEmailAlreadyUser){
        throw new Error("User already exists!")
    }

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

    revalidatePath("/settings/team")
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

