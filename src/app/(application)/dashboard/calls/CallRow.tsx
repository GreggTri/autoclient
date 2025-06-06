'use server'

import { TableCell, TableRow } from '@/components/ui/table'
import React from 'react'
import Link from 'next/link';
import { convertToTimezone } from '@/app/_lib/convertTimezone';


function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60); // Whole minutes
    const remainingSeconds = seconds % 60;   // Remaining seconds
  
    const minutePart = minutes > 0 ? `${minutes} Minute${minutes > 1 ? 's' : ''}` : '';
    const secondPart = remainingSeconds > 0 ? `${remainingSeconds} Second${remainingSeconds > 1 ? 's' : ''}` : '';
  
    // Combine parts, ensuring proper formatting (e.g., no extra spaces)
    return [minutePart, secondPart].filter(Boolean).join(' ');
}



export default async function CallRow({call, userTimezone}: 
{call: {
    id: string;
    leadId: string;
    durationSeconds: number;
    timestamp: string;
    },
    userTimezone: string | null;
}) {

    const datetime = new Date(Number(call.timestamp))
    
    let formattedDate;
    if(userTimezone){
        console.log(userTimezone);
        
        formattedDate = convertToTimezone(datetime, userTimezone)
    } else {
        formattedDate = datetime.toUTCString
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
                {call.leadId ? "Yes" : "No"}
            </TableCell>
            
            {/* Time Call Happened */}
            <TableCell >
                {String(formattedDate)}
            </TableCell>

            {/* Minute(s) Second(s) Used */}
            <TableCell> 
                {formatDuration(call.durationSeconds)}
            </TableCell>

        </TableRow>
    )
}