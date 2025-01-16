import 'server-only'

import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import ResetPasswordForm from '../ResetPasswordForm'
import { checkToken } from "@/app/_data/token"


export default async function resetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;

    //validate token
    const isTokenValid = await checkToken(token)

    if(isTokenValid === false){
      return <div className="flex h-screen w-screen text-red-500 text-xl justify-center items-center">Reset password session is invalid or expired.</div>
    }
    
    return (
        <div className="flex h-screen w-screen flex-col justify-center items-center bg-background text-white">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-4 top-4 md:left-8 md:top-8 text-white hover:text-PURPLE"
            )}
          >
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </>
          </Link>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-PURPLE">
                Reset Password
              </h1>
              <p className="text-sm text-gray-400">
                Enter your new password below
              </p>
            </div>
            <ResetPasswordForm token={token}/>
            <p className="px-8 text-center text-sm text-gray-400">
              <Link
                href="/login"
                className="hover:text-PURPLE underline underline-offset-4"
              >
                Remember your password? Sign in
              </Link>
            </p>
          </div>
        </div>
      )
}