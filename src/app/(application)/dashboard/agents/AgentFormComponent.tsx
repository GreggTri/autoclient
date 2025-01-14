'use client'

import React from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { createAgentAction } from './actions'
import { Input } from '@/components/ui/input'
import { Icons } from '@/app/_components/icons'

const formSchema = z.object({
  firstMessage: z.string(),
  voiceOptions: z.enum(['male', 'female' ]),
  systemPrompt: z.string(),
  dataCollection: z.array(
    z.object({
      fieldName: z.string().min(1, 'Field Name is required'),
      valueType: z.enum(['text', 'number', 'datetime', 'email', 'trueFalse']),
      fieldDescription: z.string().min(1, 'Field Description is required'),
    })
  ).optional()
})

type FormValues = z.infer<typeof formSchema>

function AgentFormComponent() {

  const router = useRouter()
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstMessage: '',
      voiceOptions: 'female',
      systemPrompt: '',
      dataCollection: []
    },
  })

  // useFieldArray to manage dynamic fields for dataCollection
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dataCollection',
  })


  const onSubmit = async (data: FormValues) => {
    try {
        
      const newGroup = await createAgentAction(data);
      console.log(newGroup);

      if( newGroup && 'id' in newGroup){
        toast({
          title: "Agent has been created!",
          description: "Your AI Agent is Ready",
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
        title: "Could not create Agent!",
        description: "Something went wrong! Please try again later and/or contact support!",
        variant: "destructive",
        className: "bg-red-500 border-none"
      })
    }
  }
  
  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center">
      <div className="w-full max-w-3xl p-8 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight text-PURPLE">
          Configure A New Intake AI Agent
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            

            <FormField
                control={form.control}
                name="firstMessage"
                render={({field}) => (
                <FormItem>
                    <FormLabel>
                      First Message
                    </FormLabel>
                    <FormControl>
                        <Input {...field} className='border border-gray-500'/>
                    </FormControl>
                </FormItem>
                )}  
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border border-gray-500 min-h-[300px] resize-y"
                      placeholder="Enter your system prompt here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="voiceOptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice Options</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} >
                    <FormControl>
                      <SelectTrigger className="border-WHITE/50">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='z-15 bg-black rounded-md border-WHITE/50'>
                      <SelectItem value="male" className='hover:bg-WHITE/50 rounded-md'>Male</SelectItem>
                      <SelectItem value="female" className='hover:bg-WHITE/50 rounded-md'>Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            

            {/* 
              2) dataCollection (Dynamic Fields) 
              Each item has: fieldName, valueType, fieldDescription
            */}
            <div className="flex flex-col space-y-2">
              <FormLabel>Data Collection Fields</FormLabel>

              {fields.map((fieldItem, index) => (
                <div
                  key={fieldItem.id}
                  className="border border-gray-500 p-4 rounded-md space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    {/* fieldName */}
                    <FormField
                      control={form.control}
                      name={`dataCollection.${index}.fieldName`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Field Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border border-gray-500"
                              placeholder="e.g. Contact Name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* valueType (non-tech friendly) */}
                    <FormField
                      control={form.control}
                      name={`dataCollection.${index}.valueType`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Value Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="border border-gray-500">
                                <SelectValue placeholder="Select a field type" />
                              </SelectTrigger>
                              <SelectContent className="bg-black rounded-md border-gray-500">
                                {/* Provide user-friendly options */}
                                <SelectItem value="text">text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="datetime">Date/Time</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="trueFalse">True/False</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* fieldDescription */}
                  <FormField
                    control={form.control}
                    name={`dataCollection.${index}.fieldDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="border border-gray-500"
                            placeholder="Explain what this field is for..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Remove button for the field */}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      className='text-red-500'
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {/* Button to add new dynamic fields */}
              <Button
                type="button"
                className='text-white w-[25%]'
                onClick={() =>
                  append({
                    fieldName: '',
                    valueType: 'text',
                    fieldDescription: '',
                  })
                }
              >
                <Icons.add/> Add New Field
              </Button>
            </div>

            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">
              Create Agent!
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AgentFormComponent