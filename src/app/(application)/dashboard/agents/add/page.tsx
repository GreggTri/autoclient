'use server'

import AgentFormComponent from '../AgentFormComponent'
import { Icons } from '@/app/_components/icons';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';


async function AddAgentPage() {
    
    return (
        <div>
            <Link
                href={`/dashboard/agents`}
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
            <AgentFormComponent />
        </div>
    )
}

export default AddAgentPage