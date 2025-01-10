'use server'

import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCall } from '@/app/_data/call';
import Link from 'next/link';



async function CallPage({ params }: { params: Promise<{ callId: string }> }) {
    
    const { callId } = await params;

    if(callId == null) {
        notFound()
    }
    
    const call = await getCall(callId)

    if(call == null) {
        notFound()
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return (
    <div className="min-h-screen bg-[#111111] text-[#f5f5f5] p-8">
        <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Call Details</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-[#1a1a1a] border border-[#333333]">
                <CardHeader>
                    <CardTitle className="text-[#f5f5f5] text-xl font-semibold">Call Information</CardTitle>
                </CardHeader>
                <div className="h-px bg-[#333333] mx-6"></div>
                <CardContent className="space-y-4 mt-4">
                    <div className="flex items-center space-x-4">
                        <div>
                            <p className="text-sm font-medium text-[#f5f5f5]">Agent ID</p>
                            <Link
                            className='hover:underline'
                            href={`/dashboard/agents/${call.agentId}`}
                            >
                                <p className="text-xs text-[#a0a0a0]">{call.agentId}</p>
                            </Link>
                            
                        </div>
                    </div>
                    {call.id && (
                    <div>
                        <p className="text-sm font-medium text-[#f5f5f5]">Lead ID</p>
                        {call.lead ?
                            <Link
                            className='hover:underline'
                            href={`/dashboard/agents/${call.agentId}`}
                            >
                                 <p className="text-xs text-[#a0a0a0]">{call.lead.id}</p>
                            </Link>
                        :
                            "No Lead Captured"
                        }
                    </div>
                    )}
                    <div>
                    <p className="text-sm font-medium text-[#f5f5f5]">Duration</p>
                    <p className="text-xs text-[#a0a0a0]">{formatDuration(call.durationSeconds)}</p>
                    </div>
                    <div>
                    <p className="text-sm font-medium text-[#f5f5f5]">Start Time</p>
                    <p className="text-xs text-[#a0a0a0]">
                        {new Date(call.timestamp).toLocaleString()}
                    </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border border-[#333333]">
            <CardHeader>
                <CardTitle className="text-[#f5f5f5] text-xl font-semibold">Call Summary</CardTitle>
            </CardHeader>
            <div className="h-px bg-[#333333] mx-6"></div>
            <CardContent className="mt-4">
                <p className="text-sm text-[#a0a0a0]">{call.summary}</p>
            </CardContent>
            </Card>
        </div>
        
        <Card className="bg-[#1a1a1a] border border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5] text-xl font-semibold">Recording</CardTitle>
          </CardHeader>
          <div className="h-px bg-[#333333] mx-6"></div>
          <CardContent>
            <div className="mt-4 p-4 bg-[#222222] rounded-lg">
              <audio 
                controls 
                className="w-full focus:outline-none"
                style={{
                  backgroundColor: '#222222',
                  color: '#f5f5f5',
                }}
              >
                <source src={call.recording} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333333]">
            <CardHeader>
            <CardTitle className="text-[#f5f5f5] text-xl font-semibold">Transcript</CardTitle>
            </CardHeader>
            <div className="h-px bg-[#333333] mx-6"></div>
            <CardContent className="mt-4">
            <ScrollArea className="h-[200px] w-full rounded-md border border-[#333333] p-4">
                <p className="text-sm text-[#a0a0a0] whitespace-pre-wrap">{call.transcript}</p>
            </ScrollArea>
            </CardContent>
        </Card>
    
        </div>
    </div>
    )
}

export default CallPage