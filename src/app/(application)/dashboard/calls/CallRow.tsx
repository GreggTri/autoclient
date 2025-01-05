'use server'

import { TableCell, TableRow } from '@/components/ui/table'
import React from 'react'
import { verifySession } from '@/app/_lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';



async function AgentRow({call}: 
{call: {
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
        className='place-content-center border-white/50 cursor-default'>
            {/* Names */}
            <TableCell className="flex flex-col font-medium hover:underline">
                <Link href={`/dashboard/calls/${call.id}`}>
                    {call.id}
                </Link>
            </TableCell>

            {/* Lead Generated From Call*/}
            <TableCell >
                
            </TableCell>
            
            {/* Time Call Happened */}
            <TableCell >
                
            </TableCell>

            {/* Minutes.Seconds Used */}
            <TableCell> 
                
            </TableCell>

        </TableRow>
    )
}

export default AgentRow