'use server'

import { Icons } from '@/app/_components/icons';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getLead } from '@/app/_data/lead';




export default async function LeadPage({ params }: { params: Promise<{ leadId: string }> }) {
    
    const { leadId } = await params;

    if(leadId == null) {
        return <div className='text-red text-xl'>No Lead Found</div>
    }

    const leadData = await getLead(leadId)
    console.log(leadData);

    return (
        <div>
            <Link
                href={`/dashboard/calls`}
                className={cn(
                buttonVariants({ variant: "outline" }),
                "absolute left-32 top-32 md:left-32 md:top-32 text-white"
                )}
            >
                <>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back
                </>
            </Link>
            
        </div>
    )
}