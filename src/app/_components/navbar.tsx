"use client";

//import Image from "next/image";
import { useState } from 'react';
import Link from "next/link";
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import logo from '../../../public/assets/logo.svg'
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className="sticky top-0 z-50 w-full py-4 px-4 md:px-6 bg-[#0a0a09] shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex flex-row justify-center gap-2">
          <Image src={logo} width={150} alt="AutoClient Logo"/>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/#features" className="hover:opacity-50 transition-opacity ease duration-300 font-medium">
            Features
          </Link>
          <Link href="/#contactus" className="hover:opacity-50 transition-opacity ease duration-300 font-medium">
            Contact
          </Link>
          <Link href="/pricing" className="hover:opacity-50 transition-opacity ease duration-300 font-medium">
            Pricing
          </Link>
        </nav>
        <div className="hidden md:block space-x-4">
          <Link href={'/bookDemo'}>
            <Button className="bg-gradient-to-r from-[#5110de] to-[#0e5ae0] text-[#f5f5f5] hover:opacity-90 font-semibold px-6">
              Get a Demo
            </Button>
          </Link>
          <Link href="/login" className="hover:opacity-50 transition-opacity ease duration-300 font-medium">
            Log In
          </Link>
          
        </div>
        <button className="md:hidden text-[#f5f5f5]" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 mt-4 px-4">
            <Link href="#features" className="text-[#f5f5f5] hover:text-[#5110de] font-medium">
              Features
            </Link>
            <Link href="/#contact" className="hover:opacity-50 transition-opacity ease duration-300">
              Contact
            </Link>
            <Link href="/pricing" className="hover:opacity-50 transition-opacity ease duration-300">
              Pricing
            </Link>
            <Link href={'/bookDemo'}>
              <Button className="bg-gradient-to-r from-[#5110de] to-[#0e5ae0] text-[#f5f5f5] hover:opacity-90 font-semibold px-6 w-full">
                Get a Demo
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar