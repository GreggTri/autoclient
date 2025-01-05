'use server'

import { Icons } from '@/app/_components/icons';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import TestCallButton from './testCallButton';
import { verifySession } from '@/app/_lib/session';
import { getAgentDataVapi } from '@/app/_data/agent';
import assert from 'assert';
import AgentEditFormComponent from './AgentEditFormComponent';




async function AgentPage({ params }: { params: Promise<{ agentId: string }> }) {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;
    
    const { agentId } = await params;

    if(agentId == null) {
        return <div className='text-red text-xl'>No Agent Found</div>
    }

    const agentData = await getAgentDataVapi(agentId)
    assert(agentData != null)
    assert(agentData.voiceOptions == "female" || agentData.voiceOptions == "male")
    
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
            <TestCallButton agentId={agentId}/>
            
            <AgentEditFormComponent agentId={agentId} defaultValues={
                {
                    firstMessage: agentData.firstMessage, 
                    voiceOptions: agentData.voiceOptions,
                    systemPrompt: agentData.systemPrompt,
                    dataCollection: agentData.dataCollection
                }
            }/>
        </div>
    )
}

export default AgentPage