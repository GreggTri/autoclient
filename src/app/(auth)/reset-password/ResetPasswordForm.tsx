'use client'

import React, { useActionState } from 'react'
import { Input } from "@/components/ui/input"
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { updateUserResetPassword } from './action'
import { Label } from '@/components/ui/label'
import { Icons } from '@/app/_components/icons'
import { useFormStatus } from 'react-dom'

export default function ResetPasswordForm({token}: {token: string}) {
    const [state, action] = useActionState(updateUserResetPassword, undefined)

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
              className="bg-gray-800 border-gray-700 text-white"
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
              className="bg-gray-800 border-gray-700 text-white"
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
        "w-full bg-[#f4e300] text-black hover:bg-[#d4c600]"
    )}
    >
    {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
    )}    
    Reset Password
    </button>
  );
}