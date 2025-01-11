'use server'

import 'server-only'
import { generateToken } from "@/app/_lib/tokens"
import { prisma } from "@/utils/prisma"
import { z } from "zod"
import { Resend } from 'resend';
import { ResetPasswordEmail } from "@/app/_components/emailTemplates/resetpassword";
import assert from "assert";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  email: z.string().email("Please enter a valid email").trim()
})
  
type FormValues = z.infer<typeof formSchema>
  
const resend = new Resend(process.env.RESENT_API_KEY);

export async function createResetPassword(formData: FormValues){
  
  const getUser = await prisma.user.findUnique({
    'where': {
      'email': formData.email
    },
    'select': {
      'id': true,
      'tenantId': true,
      'firstName': true,
    }
  })

  //if user exists, if does not fail here.
  assert(getUser)

  const token = generateToken()

  const emailResponse = await resend.emails.send({
    from: 'AutoClient <account@updates.getautoclient.com>',
    to: [formData.email],
    subject: `Password Reset Link on AutoClient`,
    react: ResetPasswordEmail({resetPasswordLink: `${process.env.AUTOCLIENT_URL}/reset-password/${token}`}),
  });

  if (emailResponse.error){
    throw new Error("Resend failed to send email!")
  }

  const resetPass = await prisma.resetPass.create({
    'data':{
      'userId': getUser.id,
      'tenantId': getUser.tenantId,
      'token': token,
      'resendEmailId': emailResponse.data!.id,
      'expireAt': new Date(new Date().getTime() + 12 * 60 * 60 * 1000)
    },
    'select': {
      'id': true
    }
  })

  assert(resetPass)

  return resetPass
}