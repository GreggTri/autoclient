'use server'

import { prisma } from "@/utils/prisma"
import { assert } from "console"
import { z } from "zod"


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  name: z.string(),
  email: z.string().email("Please enter a valid email").trim(),
  company: z.string(),
  subject: z.string(),
  message: z.string()
})

type FormValues = z.infer<typeof formSchema>

export async function submitContactForm(formData: FormValues){
    
    const { name, email, company, subject, message } = formData

    const createdContactSubmission = await prisma.contactForm.create({
        'data': {
            name: name,
            email: email,
            company: company,
            subject: subject,
            message: message
        }
    })

    assert(createdContactSubmission)

    return createdContactSubmission
}