'use client'
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/app/_components/icons"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"


import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { registerInvitedUser } from "./action"


export default function RegisterUserForm({ token, email, tenantId }: {token: string, email: string, tenantId: string}) {
  const [state, action] = useActionState(registerInvitedUser, undefined)

  return (
    <div className="container bg-background grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8 text-BLACK"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="hidden h-full bg-primary lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <div className={cn("grid gap-6")}>
            <form action={action} >
              <div className="grid gap-2">
                <div className="grid gap-1">
                    <input name="token" defaultValue={token} hidden={true}/>
                    <input name="tenantId" defaultValue={tenantId} hidden={true}/>

                    <Label className="sr-only" htmlFor="email">
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        defaultValue={email}
                        className="cursor-default"
                        type="email"
                        readOnly
                    />
                    {state?.errors?.email &&  <p className="text-sm text-red-500">{state.errors.email}</p>}
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
                    {state?.errors?.password && (
                        <div className="text-sm text-red-500">
                        <p>Password must:</p>
                        <ul>
                            {state.errors.password.map((error) => (
                            <li key={error}>- {error}</li>
                            ))}
                        </ul>
                        </div>
                    )}
                </div>
                <RegisterButton/>
              </div>
            </form>
            
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-brand hover:opacity-50 transition-opacity ease duration-300 underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-brand hover:opacity-50 transition-opacity ease duration-300 underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      className={cn(buttonVariants(), 'text-BLACK')} 
      disabled={pending}
      >
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Register with Email
    </button>
  );
}