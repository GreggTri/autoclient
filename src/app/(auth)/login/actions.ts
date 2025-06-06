'use server'

import bcrypt from 'bcrypt';

import { AuthFormState, LoginFormSchema } from '@/app/_lib/definitions'
import { createSession, deleteSession } from '@/app/_lib/session'
import { prisma } from "@/utils/prisma";
import { redirect } from 'next/navigation';

type PartialUser = {
    id: string;
    password: string;
  };

export async function loginUser(state: AuthFormState, formData: FormData){
    // validate fields 
    const validationResult = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    const { email, password } = validationResult.data

    try{


        console.log("IM HERE");
        const checkUser: PartialUser | null = await Promise.race([
            prisma.user.findUnique({
              where: { email },
              select: { id: true, password: true },
            }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Database query timed out")), 5000) // 5 seconds timeout
            ),
          ]) as PartialUser | null;

        console.log("IM HERE X2");

        // If user is not found, return early
        if (!checkUser) {

            console.log("I HAVE HIT NULL CHECK USER");
            return { message: 'Invalid login credentials.' };
        }
        

        console.log("this is checked user" + checkUser);
        const passwordMatch = await bcrypt.compare(
            password,
            checkUser.password,
        );


        console.log("DO PASSWORDS MATCH?!" + passwordMatch);

        // If the password does not match, return early
        if (!passwordMatch) {
            console.log("do passwords not match?");
            return { message: 'Invalid login credentials.' };
        }

        
        
        const authenticatedUser = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                password: false,
                isAdmin: true,
                tenantId: true,
            }
        });

        console.log(authenticatedUser);
        
        // Then, if you need the org data, make a second query for the organization
        const org = await prisma.org.findUnique({
            where: {
                id: authenticatedUser!.tenantId
            },
            select: {
                stripeSubscriptionId: true
            }
        });

        console.log(org);

        await createSession(authenticatedUser!.id, authenticatedUser!.isAdmin, authenticatedUser!.tenantId, org!.stripeSubscriptionId );

       
    } catch(error){
        console.log("AN ERROR HAPPENED");
        console.log(error);
        return {
            message: "Something went wrong when trying to login!"
        }
    }
    
    return redirect('/dashboard');

    
}


export async function logout() {
    deleteSession();
    redirect('/login');
  }