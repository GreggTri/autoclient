import React from 'react'

import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import ForgotPasswordForm from './ForgotPasswordForm'

export default function forgotPasswordPage() {
    
    return (
        <div className="flex h-screen w-screen flex-col justify-center items-center bg-black text-white">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-4 top-4 md:left-8 md:top-8 text-white hover:text-[#f4e300]"
            )}
          >
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </>
          </Link>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-[#f4e300]">
                Forgot Password
              </h1>
              <p className="text-sm text-gray-400">
                Enter your email to receive a password reset link
              </p>
            </div>
            <ForgotPasswordForm/>
            <p className="px-8 text-center text-sm text-gray-400">
              <Link
                href="/login"
                className="hover:text-[#f4e300] underline underline-offset-4"
              >
                Remember your password? Sign in
              </Link>
            </p>
          </div>
        </div>
      )
}