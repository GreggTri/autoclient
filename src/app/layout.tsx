import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Head from "next/head";
import { GoogleAnalytics } from "@next/third-parties/google"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Automate Intake | AutoClient",
  description: "",
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
  const isProd = process.env.ENVIRONMENT === 'prod';
  return (
    <html lang="en" className="scrollbar-none overflow-y-scroll">
      <Head>
        {isProd && <GoogleAnalytics gaId="G-C65FYE6C0T" />}  
      </Head>
      <body
        className={` ${inter.className} min-h-screen bg-background text-text antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
    
  );
}
