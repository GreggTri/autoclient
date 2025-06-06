'use server'

import 'server-only'

import { prisma } from '@/utils/prisma'
import { verifySession } from "@/app/_lib/session";
import { UpdateProfileFormState, updateProfileNameForm } from '@/app/_lib/definitions'
import { revalidatePath } from 'next/cache';
import assert from 'assert';

export const updateName =  async(state: UpdateProfileFormState, formData: FormData) => {

    const session = await verifySession(false)
    if (!session) return null;

    if (formData.get('firstName') == "" && formData.get('lastName') == "") {

        console.log("I enter room");
        return {message: "Fields are empty."}
    }

    const validationResult = updateProfileNameForm.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName')
    })

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    const { firstName, lastName} = validationResult.data

    const firstname = firstName.toLowerCase()
    const lastname = lastName.toLowerCase()
    await prisma.user.update({
        where: {
            id: session.userId,
            org: {
                id: session.tenantId!
            }
        },
        data: {
            ...(firstname && {firstName: firstname}),
            ...(lastname && {lastName: lastname})
        }
    })

    revalidatePath('/settings/profile')
}


export const handleTimezoneSelection = async(timezone: string) => {
    const session = await verifySession(false)
    if (!session) return null;

    const updatedUser = await prisma.user.update({
        where: {
            id: session.userId,
            'tenantId': String(session.tenantId)
        },
        data: {
            'timezone': timezone
        },
        select: {
            'id': true,
            'tenantId': true,
            'timezone': true
        }
    })

    assert(updatedUser)

    return updatedUser;

}