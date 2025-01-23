import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Automate Intake | AutoClient",
  description: "AI Voice Agent For Intake At Law Firms",
  icons: {
    icon: [
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-none overflow-y-scroll">
      <body
        className={` ${inter.className} min-h-screen bg-background text-text antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
    
  );
}
