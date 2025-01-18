import 'server-only'

import NavBar from "@/app/_components/navbar"
//import { GoogleAnalytics } from "@next/third-parties/google"
import Head from "next/head"
import Script from 'next/script'

export const metadata = {
  title: "Let's Talk! | AutoClient",
}

export default async function ConversationPage() {
  const isProd = process.env.ENVIRONMENT === 'prod';
  return (
    <div className="flex flex-col">
      <Head>
        {isProd &&
        <>
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-C65FYE6C0T"/>
          <Script
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-<NO LOOKIE>');
              `,
            }}
          />
        </>
        }    
      </Head>
      <NavBar/>
      <div className="flex justify-center">
        <div className="flex flex-col my-16 py-2 bg-white w-[95%] rounded-md ">
          {/* <!-- Google Calendar Appointment Scheduling begin --> */}
          <iframe src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2PObhQu80lW4_m0TiCE3QYQG91EJmoljVq1Nln-LpGRoZgUAEi3J17T-kO7dHzSGjczWwSDzdD?gv=true" style={{border: 0}} width="100%" height="700"></iframe>
          {/* <!-- end Google Calendar Appointment Scheduling --> */}
        </div>
      </div>
        
    </div>
  )
}