import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/app/_components/icons"
import NavBar from "@/app/_components/navbar"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Pricing | Happy Client",
}

export default function PricingPage() {
  return (
    <div className="flex">
        <NavBar/>
        <div className="flex flex-col my-20 py-2 px-[12%]">
            <div className="">
                <h1 className="text-5xl font-bold mb-6">Pricing</h1>

                <h3 className="text-base mb-8">Usage is based on the duration of the calls that the AI agent takes.</h3>
            </div>
            
            <div className="grid w-full items-start gap-2 rounded-lg border border-primary/30 p-10 md:grid-cols-[1fr_500px]">
                <div className="grid gap-6">
                <h3 className="text-xl font-bold sm:text-2xl cursor-default">
                    What&apos;s included in the <b className="text-primary">PRO</b>  plan
                </h3>
                <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 cursor-default">
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> First 1,000 minutes
                    </li>
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Collect Client Information
                    </li>

                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Integrations
                    </li>
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Recordings & transcripts
                    </li>
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Premium Support 
                    </li>
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Lead Mangement
                    </li>
                    
                </ul>
                </div>
                <div className="flex flex-col gap-4 text-center">
                    <div className="cursor-default">
                        <h2 className="text-7xl font-bold">$400</h2>
                        <p className="text-sm font-medium text-muted-foreground">
                        Billed Monthly
                        </p>
                        <span className="text-sm">+ $0.35 / minute <b>(after the first 1,000 minutes)</b></span>
                    </div>
                    <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "text-BLACK")}>
                        <span>Get Started</span>
                        <Icons.chevronRight className="opacity-90" />
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}