import 'server-only'

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CallRow from "./CallRow";
import { listCalls } from "@/app/_data/call";


export default async function callsPage() {
  const calls = await listCalls();
  if (!calls) {
    return <div>Calls not found or not available.</div>;
  }


  if(calls.length === 0){
    return <div>No Calls Exist Yet.</div>;
  }
  
  return (
    <div className="mx-[6.5%] my-20 bg-[#1e1e1e] rounded-md p-2">
      <div className="flex justify-between my-2">
        
      </div>
      <Table className="">
        <TableCaption>List of Calls</TableCaption>
        <TableHeader>
          <TableRow className="border-white/50">
            <TableHead className="">Call Id</TableHead>
            <TableHead className="">Lead Generated</TableHead>
            <TableHead className="">Call Date/Time</TableHead>
            <TableHead className="">Minutes Used</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="">
          {calls.map((call) => (
            <CallRow 
            key={call.id} 
            call={
              {
                'id': call.id,
                leadId: call.lead!.id,
                durationSeconds: call.durationSeconds,
                timestamp: call.timestamp
              }
            }/>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}