import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { submitContactForm } from './actions'


const formSchema = z.object({
  name: z.string(),
  email: z.string().email("Please enter a valid email").trim(),
  company: z.string(),
  subject: z.string(),
  message: z.string()
})

type FormValues = z.infer<typeof formSchema>

function ContactUsForm() {

    const router = useRouter()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            company: '',
            subject: '',
            message: ''
        },
    })
    

    const onSubmit = async (data: FormValues) => {
        try {
            
          const formSubmission = await submitContactForm(data);
          console.log(formSubmission);
    
          if( formSubmission && 'id' in formSubmission){
            toast({
              title: "Form has been submitted!",
              description: "We'll get back to you as soon as we can!",
              variant: "destructive",
              className: "bg-green-500 border-none"
            })
    
            router.refresh()
          } else {
            throw new Error("Failed to create Schedule")
          }
              
        } catch (error) {
          
          console.log(error)
    
          toast({
            title: "Shoot! Sorry about that.", 
            description: "Something went wrong! Please email us directly :)",
            variant: "destructive",
            className: "bg-red-500 border-none"
          })
        }
    }
    return (
        <div className="w-full lg:w-1/2">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input {...field} 
                                className='w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary'
                                placeholder="Name"/>
                        </FormControl>
                    </FormItem>
                    )}  
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>
                        Email
                        </FormLabel>
                        <FormControl>
                            <Input {...field} 
                                className='w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary'
                                placeholder="Email"/>
                        </FormControl>
                    </FormItem>
                    )}  
                />
                <FormField
                    control={form.control}
                    name="company"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Company Name
                        </FormLabel>
                        <FormControl>
                            <Input {...field} 
                                className='w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary'
                                placeholder="Company"/>
                        </FormControl>
                    </FormItem>
                    )}  
                />
                <FormField
                    control={form.control}
                    name="subject"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>
                        Subject
                        </FormLabel>
                        <FormControl>
                            <Input {...field} 
                                className='w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary'
                                placeholder="Subject"/>
                        </FormControl>
                    </FormItem>
                    )}  
                />

                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                        <Textarea
                        {...field}
                        className="w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary"
                        placeholder="Message..."
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                

                <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90">
                Send Message
                </Button>
            </form>
            </Form>
        </div>
    )
}

export default ContactUsForm