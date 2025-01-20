'use client'

import React, { useState } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { updateAgentAction } from './../actions'
import { Input } from '@/components/ui/input'
import { EyeOff, Eye, Plus, Trash2, ClipboardCheck , Clipboard  } from 'lucide-react'

const formSchema = z.object({
  firstMessage: z.string(),
  voiceOptions: z.enum(['male', 'female' ]),
  systemPrompt: z.string(),
  dataCollection: z.array(
    z.object({
      fieldName: z.string().min(1, 'Field Name is required'),
      valueType: z.enum(['text', 'number', 'trueFalse', 'list']),
      fieldDescription: z.string().min(1, 'Field Description is required'),
    })
  ).optional()
})

type FormValues = z.infer<typeof formSchema>

interface AgentEditFormProps {
  agentId: string
  sipURI: string,
  defaultValues: Partial<FormValues>;
}

function AgentEditFormComponent({
  agentId,
  sipURI,
  defaultValues,
}: AgentEditFormProps) {

  const [isTextCovered, setIsTextCovered] = useState(true);
  const [copied, setCopied] = useState(false);

  const router = useRouter()
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstMessage: '',
      voiceOptions: 'female',
      systemPrompt: '',
      dataCollection: [],
      ...defaultValues,
    },
  })

  // useFieldArray to manage dynamic fields for dataCollection
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dataCollection',
  })


  const onSubmit = async (data: FormValues) => {
    try {
        
      const newGroup = await updateAgentAction(agentId, data);
      console.log(newGroup);

      if( newGroup && 'id' in newGroup){
        toast({
          title: "Agent has been updated!",
          description: "Your AI Agent is Ready, feel free to test it out",
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
  

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sipURI);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:text-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-[#111110] p-8 rounded-xl shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center  text-PURPLE">Edit Your Agent</h1>
          <div className="mt-4 text-sm flex flex-row justify-center items-center space-x-2">
            <p className="font-medium">Agent SIP URI:</p>
            <div className="relative">
              <p
                className={`font-mono ${!isTextCovered ? "text-transparent select-none" : " text-gray-100"} transition duration-300`}
              >
                <span className="bg-clip-text bg-gradient-to-r from-PURPLE to-[#0e5ae0]">{sipURI}</span>
              </p>
              {isTextCovered && (
                <div className="absolute inset-0 bg-background rounded-md"></div>
              )}
            </div>
            <button
              onClick={() => setIsTextCovered(!isTextCovered)}
              className=" text-gray-400 hover:text-gray-100 transition-colors duration-200"
              aria-label={isTextCovered ? "Reveal Text" : "Cover Text"}
            >
              {isTextCovered ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-2"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="w-5 h-5 text-green-500" />
                </>
              ) : (
                <>
                  <Clipboard className="w-5 h-5 text-gray-400 hover:text-gray-100 transition-colors duration-200" />
                </>
              )}
            </button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-WHITE">First Message</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-WHITE">System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[200px] resize-y border border-gray-300 scrollbar-rounded"
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
                  <FormLabel className=" text-WHITE">Voice Options</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border  ">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background ">
                      <SelectItem
                        value="male"
                        className=" "
                      >
                        Male
                      </SelectItem>
                      <SelectItem
                        value="female"
                        className=" "
                      >
                        Female
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-4">
              <FormLabel className=" text-WHITE">Data Collection Fields</FormLabel>
              {fields.map((fieldItem, index) => (
                <div
                  key={fieldItem.id}
                  className="p-4 space-y-4 border  border-[#1A1A18] rounded-lg  bg-[#1A1A18]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`dataCollection.${index}.fieldName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" text-WHITE">Field Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border  "
                              placeholder="e.g. Contact Name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataCollection.${index}.valueType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" text-WHITE">Value Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border ">
                                <SelectValue placeholder="Select a field type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className=" bg-background">
                              <SelectItem
                                value="text"
                                className=" "
                              >
                                Text
                              </SelectItem>
                              <SelectItem
                                value="number"
                                className=""
                              >
                                Number
                              </SelectItem>
                              <SelectItem
                                value="trueFalse"
                                className=" "
                              >
                                True/False
                              </SelectItem>
                              <SelectItem
                                value="list"
                                className=""
                              >
                                List
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`dataCollection.${index}.fieldDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-WHITE">Field Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="border"
                            placeholder="Explain what this field is for..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 size={16} className="mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ fieldName: "", valueType: "text", fieldDescription: "" })}
                className="w-[25%] bg-PURPLE hover:bg-PURPLE/80 text-white transition-colors duration-200"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Field
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-PURPLE hover:bg-PURPLE/80 text-white transition-colors duration-200"
            >
              Update Agent
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AgentEditFormComponent