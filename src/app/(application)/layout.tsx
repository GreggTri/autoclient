"use client"

import { usePathname } from "next/navigation";
import AppNavBar from "../_components/appnavbar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const pathname = usePathname();

    // Determine if the current path is part of Dashboard or settings
    const showNavBar = pathname.startsWith('/dashboard') || pathname.startsWith('/settings');
    
    return (
        <>
             {showNavBar &&
                <div className="flex flex-col">
                    <AppNavBar />
                        {children}
                </div>
            }
            
            {/* This is for Customer Surveys DO NOT CHANGE EVER. PLEASE */}
            {!showNavBar &&
                <div className="flex flex-col">
                        {children}
                </div>
            }
        </>
       
        
    )
}

export default Layout;