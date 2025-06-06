'use client'
import Link from "next/link"
import { Icons } from "./icons";
import { useState } from 'react';
import { usePathname } from "next/navigation";
import { logout } from "../(auth)/login/actions";
import Image from 'next/image'
import logo from '../../../public/assets/logo.svg'

const AppNavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname(); // Get current path

    const isActive = (route: string) => pathname === route;
    
    return (
        <div className="flex flex-row w-full py-3 px-[3%] sticky top-0 space-x-10 bg-background justify-start border-b border-WHITE/20 z-30">
            
            {/* Hamburger Menu Button (always visible) */}
            <button 
                className="flex z-30" // Hamburger button always visible on all screens
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <Icons.menu />
            </button>

            {/* Logo and Title */}
            <div className="flex items-center gap-2">
                <Image src={logo} width={130} alt="HappyClient Logo"/>
            </div>

            {/* Horizontal Navigation (for large screens only) */}
            <div className="hidden lg:flex gap-7">
                <Link 
                    href="/dashboard" 
                    className={`${isActive("/dashboard") ? 'border-b border-WHITE' : 'hover:bg-WHITE/20 hover:px-1 hover:rounded-md'} px-1`} 
                >
                    Dashboard
                </Link>
                <Link 
                    href="/dashboard/agents"
                    className={`${isActive("/dashboard/analytics") ? 'border-b border-WHITE' : 'hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md'} px-1`}
                >
                    Agents
                </Link>
                <Link 
                    href="/dashboard/calls"
                    className={`${isActive("/dashboard/calls") ? 'border-b border-WHITE' : 'hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md'} px-1`}    
                >
                    Calls
                </Link>
                <Link 
                    href="/dashboard/leads"
                    className={`${isActive("/dashboard/leads") ? 'border-b border-WHITE' : 'hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md'} px-1`}    
                >
                    Leads
                </Link>
            </div>

            {/* Vertical Navigation Menu (triggered by Hamburger Menu, visible on smaller screens and includes additional links) */}
            <div 
                className={`${isMenuOpen ? 'flex' : 'hidden'} z-9 fixed top-12 left-0 h-auto w-auto bg-background border rounded-md border-WHITE/20 shadow-lg flex-col space-y-5 px-3 py-2 z-20`}
            >
                {/* Original links also included in the vertical menu when screen is small */}
                <Link 
                    href="/dashboard"
                    className="lg:hidden text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Dashboard
                </Link>
                <Link 
                    href="/dashboard/agents"  
                    className="lg:hidden text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Agents
                </Link>
                <Link 
                    href="/dashboard/calls" 
                    className="lg:hidden text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Calls
                </Link>
                <Link 
                    href="/dashboard/leads" 
                    className="lg:hidden text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Leads
                </Link>

                {/* Links visible only in the vertical menu */} 
                <Link 
                    href="/settings/profile" 
                    className="text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Settings
                </Link>
                <Link 
                    href="/support" 
                    className="text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Support
                </Link>
                <button 
                    className="text-lg text-red-500 hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={async() => await logout()}
                >
                    Log out
                </button>
            </div>
        </div>
    );
}

export default AppNavBar;

