"use client"
import * as React from "react"
//import { useSearchParams } from "next/navigation"

//import { signIn } from "next-auth/react"

import { cn } from "@/lib/utils"
//import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "./icons"
import {useFormStatus } from "react-dom"
import { loginUser } from "../(auth)/login/actions"
import { useActionState } from "react"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}


export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [state, action] = useActionState(loginUser, undefined)

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form action={action}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
            {state?.errors?.email &&  <p className="text-red-500">{state.errors.email}</p>}
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
            />
            {state?.errors?.password &&  <p className="text-red-500">{state.errors.password}</p>}
          </div>
          <LoginButton/>
        </div>
        {state?.message &&  <p className="text-red-500">{state.message}</p>}
      </form>
    </div>
  )
}

function LoginButton() {
  
  const { pending } = useFormStatus();

  return (
    <button 
      className={cn(buttonVariants(), 'text-BLACK')} 
      disabled={pending}
      >
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Sign In with Email
    </button>
  );
}