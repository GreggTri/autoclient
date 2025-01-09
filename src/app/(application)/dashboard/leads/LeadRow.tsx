'use server'

import { TableCell, TableRow } from '@/components/ui/table'
import React from 'react'
import { verifySession } from '@/app/_lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';



export default async function LeadRow({lead}: 
{lead: {
    id: string;
    createdAt: Date
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
                <Link href={`/dashboard/leads/${lead.id}`}>
                    {lead.id}
                </Link>
            </TableCell>
            
            {/* Time Call Happened */}
            <TableCell >
                {lead.createdAt.toUTCString()}
            </TableCell>

        </TableRow>
    )
}