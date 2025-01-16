'use server'

import { getInvitedUserByToken } from "@/app/_data/user";
import RegisterUserForm from "./RegisterUserForm";
import { deactivateInvite } from "./action";

function isValidHex(param: string) {
    const regex = /^[a-f0-9]{32}$/;
    return regex.test(param);
}



function is15DaysOrMore(dateTimeValue: Date): boolean {
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
  
    // Calculate the difference in milliseconds
    const differenceInTime = today.getTime() - dateTimeValue.getTime();
  
    // Convert the difference to days
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
  
    // Check if the difference is 15 days or more
    return differenceInDays >= 15;
  }

export default async function RegisterInvitedUserPage({ params }: { params: Promise<{ tokenId: string }> }) {
    const { tokenId } = await params;

    if(tokenId == null) {
        return <div className='text-red-500 text-xl'>No Invited User Found</div>
    }

    if(!isValidHex(tokenId)){
        return <div className='text-red-500 text-xl'>No Invited User Found</div>
    }

    const invitedUser = await getInvitedUserByToken(tokenId)

    if(invitedUser == null) {
        return <div className='text-red-500 text-xl'>No Invited User Found</div>
    }

    if(is15DaysOrMore(invitedUser.createdAt)){
        await deactivateInvite(invitedUser.token)
        return <div className="flex h-screen w-screen text-red-500 text-xl justify-center items-center">Invite is expired or no longer active. Please try inviting again or logging in.</div>
    }

    if(invitedUser.isActive == false){
        return <div className="flex h-screen w-screen text-red-500 text-xl justify-center items-center">Invite is expired or no longer active. Please try inviting again or logging in.</div>
    }




    return (
        <RegisterUserForm token={tokenId} email={invitedUser.invitedEmail} tenantId={invitedUser.tenantId}/>
    )
}
