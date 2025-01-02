'use server'

import NavBar from "@/app/_components/navbar";
import Image from "next/image";
import { Icons } from "../_components/icons";
import { CassetteTape, Headset, Blocks, UserCheck, BookCheck, SquareFunction } from 'lucide-react';
import Link from "next/link";
import ContactUsForm from "./ContactUsForm";


export default async function Home() {

  return (
    <div className="flex flex-col ">
      
      <NavBar />
      {/* Body of page */}
      <div className="flex flex-col py-2 px-[12%]">
            
        {/* Hero Section */}
        <div className="container flex flex-row justify-between my-20">
          
          <div className="">
            <div className="mb-12">
              <h1
              className="text-4xl font-bold leading-snug"
              >
                Ditch Your Answering Service.<br />
              </h1>
              <h1
              className="text-4xl font-bold"
              >
                <b className="text-primary italic">Automate</b> Your Law Firm&apos;s Intake with AI
              </h1>
            </div>

            <h3 className="font-500">Transform every call into a qualified lead.</h3>

            <div className="flex my-10 gap-4">
              <Link href="/bookDemo" className="bg-background py-2 px-3 border border-primary text-primary rounded-md hover:-translate-y-1 transition-transform ease duration-500">Learn More</Link>
              <Link 
                className="flex flex-row justify-center items-center bg-primary text-BLACK py-2 px-3 rounded-md hover:-translate-y-1 transition-transform ease duration-500"
                href="/register"
              >
                <span>Get Started</span>
                <Icons.chevronRight className="opacity-80" />
              </Link>
            </div>

            <div className="flex flex-row gap-2 items-center hover:animate-bobbing cursor-default ">
              <Image className="text-WHITE" src="/assets/whiteMouse.svg" alt="" width={24} height={24}/>
              <span className="text-xs">Scroll to see more sections</span>
            </div>
          </div>
          
          {/* blank for now */}
          <div className="">
            Put demo video here*
          </div>

        </div>

        {/* Features */}
        <section id="features" className="my-16 container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              What We Do
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              We help law firms by enabling them to never miss a potential new client call while 
              also making sure that their potential new clients have the best experience possible.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <SquareFunction/>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Automate Client Intake</h3>
                  <p className="text-sm text-muted-foreground">
                    No longer have to worry if your answering service is doing a good job or not.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BookCheck/>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Collect Client Information</h3>
                  <p className="text-sm">
                    We make it super easy to collection any type of information you may want/need from your leads
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <CassetteTape/>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Recordings & transcripts</h3>
                  <p className="text-sm text-muted-foreground">
                    Have 100% visability into <b><u>every</u> call</b>. Answering Services are not meant to be Black Boxes
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <UserCheck/>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Lead Mangement</h3>
                  <p className="text-sm text-muted-foreground">
                    We generate a client profile right after the call is done so you can look at & verify all information
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Blocks/>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Integrations</h3>
                  <p className="text-sm text-muted-foreground">
                    Talk to us about any integrations you may want/need
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Headset/>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Premium Support</h3>
                  <p className="text-sm text-muted-foreground">
                    AI can be daunting but our team is here to help you every step of the way.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="mx-auto text-center md:max-w-[58rem]">
            <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Taxonomy also includes a blog and a full-featured documentation site
              built using Contentlayer and MDX.
            </p>
          </div> */}
        </section>

        {/* Contact Us */}
        <section id="contactus" className="container mx-auto my-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Contact Us</h2>
            <p className="text-lg text-text">We&apos;re here to help and answer any question you might have.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-between">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0 space-y-4">
              <span className="text-text text-lg leading-relaxed">
                Please reach out to us at any time. <br /> We&apos;d love to hear from you.
              </span>
              <p>You can reach out directly via our email as well: <br /> <b className="text-primary">team@getautoclient.com</b></p>
            </div>

            <ContactUsForm/>

          </div>
        </section>
      </div>
    </div>
  );
}
