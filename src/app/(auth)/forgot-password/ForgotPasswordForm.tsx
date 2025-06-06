'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createResetPassword } from './action'
import { Icons } from '@/app/_components/icons'

const formSchema = z.object({
  email: z.string().email("Please enter a valid email").trim(),
})

type FormValues = z.infer<typeof formSchema>

function ForgotPasswordForm() {


    const [pending, setPending] = useState(false)
    
    const router = useRouter()
      
    const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: ''
    },
    })

    const onSubmit = async (data: FormValues) => {
        try {
          setPending(true)    
          const emailSent = await createResetPassword(data);
    
          if(emailSent){

            setPending(false) 
            toast({
              title: "Email has been sent!",
              description: "Check your inbox!",
              variant: "destructive",
              className: "bg-green-500 border-none"
            })
    
            router.refresh()
          } else {
            throw new Error("Failed to create Schedule")
          }
              
        } catch (error) {
          
          console.log(error)
          setPending(false) 
          toast({
            title: "Email could not be sent",
            description: "Something went wrong! Please try again later and/or contact support!",
            variant: "destructive",
            className: "bg-red-500 border-none"
          })
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-white">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className=' border-gray-700 text-white'/>
                                </FormControl>
                            </FormItem>
                            )}  
                        />
                    </div>            

                    <Button type="submit"
                    className={cn(
                        buttonVariants(),
                        "w-full bg-primary text-white hover:bg-primary/90"
                    )}>
                      {pending ?
                        <Icons.spinner className="animate-spin"/>
                      :
                        "Send Reset Link!"
                      }
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default ForgotPasswordForm