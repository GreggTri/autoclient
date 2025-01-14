'use client'

import React, { useActionState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { updateUserResetPassword } from './action'
import { Label } from '@/components/ui/label'
import { Icons } from '@/app/_components/icons'
import { useFormStatus } from 'react-dom'
import { toast } from '@/hooks/use-toast'

export default function ResetPasswordForm({token}: {token: string}) {
    const [state, action] = useActionState(updateUserResetPassword, undefined)

    useEffect(() => {
      if (state?.success) {
        // Perform your function here after the action is completed successfully
        console.log('Password reset was successful!');
        // Example: Redirect to login page or show success message
        window.location.href = '/login';
      }
  
      if (state?.success === false && state?.errors === null) {
        // Handle errors here, e.g., show a toast or log the error

        toast({
          title: "Could not reset password!",
          description: "Something went wrong! Please try again later and/or contact support!",
          variant: "destructive",
          className: "bg-red-500 border-none"
        })
      }
    }, [state]);
    
    return (
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <input type="text" hidden id='token' name='token' value={token} />
            <Label htmlFor="password" className="text-white">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className=" border-gray-700 text-white"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className=" border-gray-700 text-white"
            />
          </div>
          {state?.errors?.confirmPassword && (
            <div className="text-sm text-red-500">
                <p>Password must:</p>
                <ul>
                {state.errors.confirmPassword.map((error) => (
                    <li key={error}>- {error}</li>
                ))}
                </ul>
            </div>
            )}
          <ResetPasswordButton/>
        </form>
    )
}

function ResetPasswordButton() {
  const { pending } = useFormStatus();

  return (
    <button
    type="submit"
    className={cn(
        buttonVariants(),
        "w-full bg-primary text-black hover:bg-primary/90"
    )}
    >
    {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
    )}    
    Reset Password
    </button>
  );
}