'use server'

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { listAgents } from "@/app/_data/agent";
import CallRow from "./CallRow";


export default async function callssPage() {
  const calls = await listAgents();
  if (!calls) {
    return <div>Agents not found or not available.</div>;
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
          {calls.sort((a, b) => {
            // Groups with isArchived false should come first
            if (a.isArchived === b.isArchived) return 0;
            return a.isArchived ? 1 : -1;
          })
          .map((call) => (
            <CallRow 
            key={call.id} 
            call={
              {
                'id': call.id,
                //...
                'isArchived': call.isArchived
              }
            }/>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}