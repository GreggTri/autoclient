import 'server-only'

import { fetchUsers } from "@/app/_data/user";
import Search from "./search";
import Pagination from "@/app/_components/pagination";
import User from "./user";
import { Icons } from "@/app/_components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SendInviteForm from './SendInviteForm';

interface user {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  isAdmin: boolean
}
interface SearchParams {
    q?: string;
    page?: string;
}

const TeamSettingsPage = async ({ searchParams }: {searchParams: Promise<SearchParams>}) => {
    const resolvedSearchParams = await searchParams;
    const q = resolvedSearchParams?.q || "";
    const page: number = Number(resolvedSearchParams?.page || 1);
    const {success, count, users} = await fetchUsers(q, page);
    
    return (
        <div className="flex flex-col space-y-2 w-full border-l-2 border-gray-500 px-4">
        <h1 className="font-bold">Team</h1>
        
        <div className="rounded-lg  bg-BLACK p-5 mt-5">
                <div className="flex items-center justify-between">
                    <Search placeholder="Search..."/>
                    <Popover>
                        <PopoverTrigger className='flex flex-row items-center gap-1 p-2 bg-primary rounded-md justify-center text-sm text-white'><Icons.add width={20} height={20}/>Invite</PopoverTrigger>
                        <PopoverContent className='flex bg-black w-full border-none'>
                            <SendInviteForm/>
                        </PopoverContent>
                    </Popover>
                </div>

                <table className='w-full mt-4'>
                    <thead>
                        <tr>
                            <td className='p-2.5'>Name</td>
                            <td className='p-2.5'>Email</td>
                            <td className='p-2.5'>Admin</td>
                            <td className='p-2.5'>Action</td>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {success && count > 0 ? users!.map((user: user) => (
                            <User key={user.id} user={user}/>
                        )) : <p className="text-red-500">Error: Could not find any users! Please contact support!</p>}
                    </tbody>
                </table>
                <Pagination count={count}/>
            </div>
        
        </div>
    );
};

export default TeamSettingsPage;