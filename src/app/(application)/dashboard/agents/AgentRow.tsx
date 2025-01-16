import 'server-only'

import { TableCell, TableRow } from '@/components/ui/table'
import React from 'react'
import { verifySession } from '@/app/_lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import DeactivateGroupbuttonComponent from './DeactivateGroupbuttonComponent';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';



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

    return (
        <TableRow 
        className={cn(agent.isArchived && 'opacity-50' ,'place-content-center border-white/50 cursor-default')}>
            {/* Names */}
            <TableCell className="flex flex-col font-medium hover:underline">
                <Link href={`/dashboard/agents/${agent.id}`}>
                    {agent.id}
                </Link>
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