'use server'

import { TableCell, TableRow } from '@/components/ui/table'
import React from 'react'
import { verifySession } from '@/app/_lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import DeactivateGroupbuttonComponent from './DeactivateGroupbuttonComponent';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';



async function AgentRow({agent}: 
{agent: {
    id: string;
    
    isArchived: boolean
}}) {
    const {isAuth} = await verifySession(true)

    if (!isAuth) {
        revalidatePath('/')
        redirect('/')
    }

    // const groupedUsers = await getAttachedUsers(group.attachedUsers)
    
    // if (!groupedUsers) {
    //     revalidatePath(`/dashboard/forms/detail/`)
    //     redirect('/dashboard/forms')
    // }

    return (
        <TableRow className={cn(agent.isArchived && 'opacity-50' ,'place-content-center border-white/50 hover:bg-[#2a2a2a] cursor-default')}>
            {/* Names */}
            <TableCell className="flex flex-col font-medium">
                {agent.id}
            </TableCell>


            

            <TableCell >
                {agent.isArchived ? 
                    <Badge className='border border-red-500 text-red-500 bg-transparent text-base px-4 py-1'>Archived</Badge>
                :
                    <DeactivateGroupbuttonComponent agentId={agent.id} isArchived={agent.isArchived}/>
                }
            </TableCell>

            {/* Actions */}
            <TableCell> 
                
            </TableCell>

        </TableRow>
    )
}

export default AgentRow