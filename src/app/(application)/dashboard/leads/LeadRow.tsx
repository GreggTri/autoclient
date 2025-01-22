import 'server-only'

import { TableCell, TableRow } from '@/components/ui/table'
import React from 'react'
import Link from 'next/link';
import { convertToTimezone } from '@/app/_lib/convertTimezone';



export default async function LeadRow({lead, userTimezone}: 
{lead: {
    id: string;
    createdAt: Date
},
userTimezone: string | null;
}) {

    let formattedDate;
    if(userTimezone){
        console.log(userTimezone);
        
        formattedDate = convertToTimezone(lead.createdAt, userTimezone)
    } else {
        formattedDate = lead.createdAt.toUTCString()
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
                {formattedDate}
            </TableCell>

        </TableRow>
    )
}