//import Link from "next/link"

//import { cn } from "@/app/lib/utils"
//import { buttonVariants } from "@/app/components/ui/button"
//import { Icons } from "@/app/components/icons"
import NavBar from "@/app/_components/navbar"

export const metadata = {
  title: "Let's Talk! | AutoClient",
}

export default function ConversationPage() {
  return (
    <div className="flex flex-col">
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