'use server'

import { deleteUser, updateUserAdmin } from './actions';
import { Icons } from '@/app/_components/icons';
import { Switch } from '@/components/ui/switch';

interface user {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    isAdmin: boolean
}

interface UserProps {
    user: user;
}

const User: React.FC<UserProps> = async ({user}: UserProps) => {
    
    return(
        <tr className='cursor-default'>
            {/* Name */}
            <td className='p-2.5'>
                { (user.firstName == null && user.lastName == null) ? "No Name" : user.firstName + " " + user.lastName}
            </td>

            {/* Email */}
            <td className='p-2.5'>
                {user.email}
            </td>
            
            
            {/* Created At */}
            <td className='p-2.5'>
                <form action={updateUserAdmin}>
                    <input id='userId' name='userId' type="hidden" value={user.id} />
                    <Switch name='isAdmin' defaultChecked={user.isAdmin} type='submit'/>
                </form>
            </td>

            {/* Action */}
            <td className='flex gap-2 p-2.5'>
                <form action={deleteUser}>
                    <input id='userId' name='userId' type="hidden" value={user.id} />
                    <button type='submit' className='px-3 py-1 rounded-md cursor-pointer bg-red-500 text-sm'><Icons.trash width={20} height={20}/></button>
                </form>
                
            </td>          
        </tr>
    )
}

export default User