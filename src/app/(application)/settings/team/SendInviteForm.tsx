'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Icons } from '@/app/_components/icons'
import { sendUserInvite } from './actions'


const formSchema = z.object({
    email: z.string().email("Please enter a valid email").trim(),
})

type FormValues = z.infer<typeof formSchema>

export default function SendInviteForm() {
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
          const inviteSent = await sendUserInvite(data);
    
          if(inviteSent){

            setPending(false) 
            toast({
              title: "Invite has been sent!",
              description: "",
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
            title: "Invite failed to send!",
            description: "Something went wrong! Please try again later and/or contact support!",
            variant: "destructive",
            className: "bg-red-500 border-none"
          })
        }
    }

    return (
        <div className='border-none'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-2 border-none">
                    
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} className='rounded-md px-1 bg-BLACK' placeholder="Email"/>
                            </FormControl>
                        </FormItem>
                        )}  
                    />           
                    <button type="submit" className=''>
                    {pending ?
                        <Icons.spinner className="animate-spin"/>
                      :
                      <div className='flex flex-row justify-center items-center bg-primary text-BLACK rounded-md px-1 py-1 gap-1'>
                        Send <Icons.Send width={15} height={15}/>
                      </div>
                      }
                        
                        
                    </button>
                </form>
            </Form>
        </div>
    )
}