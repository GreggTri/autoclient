'use server'

import { ArrowRight, BarChart, Users, Shield } from 'lucide-react';
import Link from "next/link";
import ContactUsForm from "./ContactUsForm";
import { Button } from "@/components/ui/button";
import Navbar from "@/app/_components/navbar";
import { Suspense } from "react";

async function IframeLoadingState(){
  return "Loading Video..."
}

function IframeVideoComponent() {
  return (
    <div className="relative w-full max-w-[720px] mx-auto aspect-[16/9]">
      <iframe
        src="https://www.youtube.com/embed/9Mlxjr7K6D4?si=jl9hZ5a2zWoVodhK"
        title="YouTube video player"
        className="absolute top-0 left-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export default async function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a09] text-[#f5f5f5]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-[#0a0a09] flex items-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              {/* Text Content */}
              <div className="w-full md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start justify-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-[#f5f5f5] leading-tight">
                  Empathy Engineered For Every Client
                </h1>
                <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-400">
                  Transform every intake call into a potential new client! Ditch your answering service and embrace the future of client acquisition.
                </p>
                <Button className="w-full md:w-auto bg-gradient-to-r from-[#5110de] to-[#0e5ae0] text-[#f5f5f5] hover:opacity-90 font-semibold px-6 py-3 text-lg">
                  Get a Demo<ArrowRight className="ml-2" />
                </Button>
              </div>

              {/* Video Content */}
              <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center">
                <Suspense fallback={<IframeLoadingState />}>
                  <IframeVideoComponent />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-20 bg-[#0a0a09]">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[#f5f5f5]">Why Choose AutoClient</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: BarChart, title: "Increase Efficiency", description: "Streamline your intake process and reduce administrative overhead." },
                { icon: Users, title: "Improve Client Experience", description: "First impressions matter. Give clients a kind and caring experience that reflects your law firm's values" },
                { icon: Shield, title: "Recordings & Transcripts", description: "Every call is recorded and transcribed, giving you a clear record of client interactions for accountability and better lead management." },
              ].map((feature, index) => (
                <div key={index} className="bg-[#111110] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <feature.icon className="w-12 h-12 mb-4 text-[#5110de]" />
                  <h3 className="text-xl font-semibold mb-2 text-[#f5f5f5]">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 md:py-20 bg-[#0a0a09]">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[#f5f5f5]">How AutoClient Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "AI Answers Calls", description: "Our AI system answers calls 24/7, ensuring no potential client is missed." },
                { step: "2", title: "Qualify Leads", description: "Gathers requested information from your pontential new client so you can make the most accurate decision." },
                { step: "3", title: "Seamless Handoff", description: "leads are immediately posted for your firm to view. look at your potential new clients information that you requested and review call data." },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#5110de] to-[#0e5ae0] text-[#f5f5f5] flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#f5f5f5]">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section className="py-12 md:py-20 bg-[#111110]">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[#f5f5f5]">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "John Doe", role: "Managing Partner, Doe & Associates", quote: "AutoClient has transformed our intake process. We're now able to capture and qualify leads 24/7, significantly improving our client acquisition." },
                { name: "Jane Smith", role: "Solo Practitioner", quote: "As a solo attorney, AutoClient has been a game-changer. It's like having a full-time intake specialist without the overhead." },
              ].map((testimonial, index) => (
                <div key={index} className="bg-[#1a1a19] p-6 rounded-lg shadow-md">
                  <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                    <div>
                      <p className="font-semibold text-[#f5f5f5]">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#5110de] to-[#0e5ae0] text-[#f5f5f5] py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to Revolutionize Your Intake Process?</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Join the growing number of law firms using AutoClient to streamline their client acquisition and boost their practice.
            </p>
            <Button className="w-full md:w-auto bg-[#f5f5f5] text-[#0a0a09] hover:bg-opacity-90 font-semibold px-6 py-3 text-lg">
              Get a Demo <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>

        {/* Contact Us */}
        <section id="contactus" className="container mx-auto my-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-primary bg-clip-text">Contact Us</h2>
            <p className="text-lg text-text">We&apos;re here to help and answer any question you might have.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-between">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0 space-y-4">
              <span className="text-text text-lg leading-relaxed">
                Please reach out to us at any time. <br /> We&apos;d love to hear from you.
              </span>
              <p>You can reach out directly via our email as well: <br /> <b className="text-transparent bg-primary bg-clip-text">team@getautoclient.com</b></p>
            </div>

            <ContactUsForm/>

          </div>
        </section>
      </main>

      <footer className="bg-[#0a0a09] text-[#f5f5f5] py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="text-2xl font-bold mb-4 block">AutoClient</Link>
              <p className="text-gray-400">Revolutionizing law firm intake with AI</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-400 hover:text-[#f5f5f5]">Features</Link></li>
                <li><Link href="#how-it-works" className="text-gray-400 hover:text-[#f5f5f5]">How It Works</Link></li>
                <li><Link href="#contactus" className="text-gray-400 hover:text-[#f5f5f5]">Contact</Link></li>
              </ul>
            </div>
            {/* <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-[#f5f5f5]">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-[#f5f5f5]">Careers</Link></li>
              </ul>
            </div> */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-[#f5f5f5]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-[#f5f5f5]">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} AutoClient. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
