import 'server-only'

import { verifySession } from "@/app/_lib/session";
import { redirect } from "next/navigation";
import CompanyNameForm from "./CompanyNameForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/_components/icons";
import { getOrg } from "@/app/_data/org";

async function OrgAccountSettingsPage(){
  const session = await verifySession(true)
  if (!session) return redirect('/login');

  const org = await getOrg(); //just have a getOrg function
  if(!org) return redirect('/settings/profile');
  
  return (
    <div className="flex flex-col w-full border-l-2 border-gray-500 px-4">
      <div>
        <h1 className="font-bold text-lg my-4">Organizations Account & Billing</h1>
        
        <div className="flex flex-col w-full items-center">
          <CompanyNameForm companyName={org.companyName}/>
        </div>
        

        {org.stripeSubscriptionId ? 
          <div className="my-6">
            <Link href={`https://billing.stripe.com/p/login/test_9AQ6oJ7VN97cgs85kk`} className='underline'>
              Manage Subscription
            </Link>
          </div>
        :
        <div className="my-6">
          <span>After entering your firms name, <br />Please activate your monthly subscription</span>
          <Button className="text-white w-full my-4 py-6 bg-green-500 hover:bg-green-600">
            <Link href={`${process.env.STRIPE_PAYMENT_LINK}?client_reference_id=${org.id}`} target="_blank" className="flex flex-row justify-center items-center font-bold text-base">
              Activate Subscription<Icons.chevronRight width={25} height={25}/>
            </Link>
          </Button>
        </div>
        }
      </div>
    </div>
  );
};

export default OrgAccountSettingsPage;