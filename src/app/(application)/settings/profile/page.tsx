import 'server-only'

import { fetchUser } from "@/app/_data/user";
import UpdateProfileForm from "./form";
import { redirect } from 'next/navigation';


const ProfileSettingsPage = async () => {
  
  const result = await fetchUser()

  if(result == null){
    redirect('/login')
  }
  
  return (
    <div className="flex flex-col space-y-2 border-l-2 border-gray-500 px-4">
      <h1 className="font-bold">Profile Settings</h1>
      
      <UpdateProfileForm user={result?.user}/>
    </div>
  );
};

export default ProfileSettingsPage;