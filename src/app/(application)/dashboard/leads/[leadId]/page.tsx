import 'server-only'

import Link from 'next/link';
import { getLead } from '@/app/_data/lead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JsonValue } from '@prisma/client/runtime/library';
import assert from 'assert';


function formatKey(key: string): string {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function formatValue(value: JsonValue): React.ReactNode {
    if (value === null) {
        return "N/A"
    } else if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'
    } else if (Array.isArray(value)) {
        return (
        <ul className="list-disc list-inside">
            {value.map((item, index) => (
            <li key={index}>{formatValue(item)}</li>
            ))}
        </ul>
        )
    } else if (typeof value === 'object') {
        return (
        <div className="pl-4 border-l border-[#333333]">
            {Object.entries(value).map(([key, val]) => (
            <div key={key} className="mt-2">
                <p className="text-xs font-medium text-[#f5f5f5]">{formatKey(key)}</p>
                <div className="text-xs text-[#a0a0a0]">{formatValue(val ?? null)}</div>
            </div>
            ))}
        </div>
        )
    } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        return new Date(value).toLocaleString()
    }
    return String(value)
}

function DataItem({ label, value }: { label: string; value: JsonValue }) {
    return (
        <div className="bg-[#222222] p-4 rounded-lg">
            <p className="text-sm font-medium text-[#f5f5f5]">{formatKey(label)}</p>
            <div className="text-sm text-[#a0a0a0] mt-1 break-words">
                {formatValue(value)}
            </div>
        </div>
    )
}

export default async function LeadPage({ params }: { params: Promise<{ leadId: string }> }) {
    
    const { leadId } = await params;

    if(leadId == null) {
        return <div className='text-red text-xl'>No Lead Found</div>
    }

    const lead = await getLead(leadId)

    if(lead == null) {
        return <div className='text-red text-xl'>No Lead Found</div>
    }
    assert(lead.data)

    return (
        <div className="min-h-screen bg-[#111111] text-[#f5f5f5] p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Lead Details</h1>
            
            <Card className="bg-[#1a1a1a] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-[#f5f5f5] text-xl font-semibold">Lead Information</CardTitle>
              </CardHeader>
              <div className="h-px bg-[#333333] mx-6"></div>
              <CardContent className="space-y-4 mt-4">
                <div>
                  <p className="text-sm font-medium text-[#f5f5f5]">Lead ID</p>
                  <p className="text-xs text-[#a0a0a0]">{lead.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f5f5f5]">Associated Call ID</p>
                  <Link href={`/dashboard/calls/${lead.callId}`} className='hover:underline'>
                    <p className="text-xs text-[#a0a0a0]">{lead.callId}</p>
                  </Link>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f5f5f5]">Created At</p>
                  <p className="text-xs text-[#a0a0a0]">{new Date(lead.createdAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
    
            <Card className="bg-[#1a1a1a] border border-[#333333]">
                <CardHeader>
                    <CardTitle className="text-[#f5f5f5] text-xl font-semibold">Lead Details</CardTitle>
                </CardHeader>
                <div className="h-px bg-[#333333] mx-6"></div>
                <CardContent className="mt-4">
                    <ScrollArea className="h-[400px] w-full rounded-md pr-4">
                        <div className="space-y-4">
                            {typeof lead.data === 'object' && lead.data !== null ? (
                                Object.entries(lead.data).map(([key, value]) => (
                                    <DataItem key={key} label={key} value={value ?? null} />
                                ))
                            ) : (
                                <p className="text-sm text-[#a0a0a0]">No valid data available</p>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
          </div>
        </div>
    )
}