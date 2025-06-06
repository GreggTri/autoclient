import 'server-only'

import NavBar from "@/app/_components/navbar"
import { GoogleAnalytics } from "@next/third-parties/google"

export const metadata = {
  title: "Let's Talk! | AutoClient",
}

export default async function ConversationPage() {
  return (
    <div className="flex flex-col">
      <GoogleAnalytics gaId="G-C65FYE6C0T" />
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