import 'server-only'


import { fetchUser } from "@/app/_data/user";
import UpdateProfileForm from "./form";
import { redirect } from 'next/navigation';
import TimezoneDropdownClient from './TimezoneDropdownClient';
import { timezones } from './timezones';


const ProfileSettingsPage = async () => {
  
  const result = await fetchUser()

  if(result == null){
    redirect('/login')
  }
  
  return (
    <div className="flex flex-col space-y-2 border-l-2 border-gray-500 px-6">
      <h1 className="font-bold">Profile Settings</h1>
      
      <UpdateProfileForm user={result?.user}/>

      <div className="py-6">
        <h2 className="text-xl font-bold mb-4">Select Your Timezone</h2>
        <TimezoneDropdownClient timezones={timezones} />
      </div>
    </div>
  );
};

export default ProfileSettingsPage;