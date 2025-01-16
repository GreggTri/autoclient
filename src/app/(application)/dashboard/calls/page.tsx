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


export default async function callsPage({ params }: { params: Promise<{ sortByParam: string, sortOrderParam: string, pageParam: string, limitParam: number }> }) {

  const { sortByParam, sortOrderParam, pageParam, limitParam } = await params;

  const sortBy = sortByParam || 'createdAt'; // Default sorting by createdAt
  const sortOrder = sortOrderParam || 'desc'; // Default to descending order
  const page = parseInt(pageParam, 10) || 1; // Default to page 1
  const limit = limitParam; // Items per page

  const calls = await listCalls({ sortBy, sortOrder, page, limit });

  if (!calls) {
    return <div>Calls not found or not available.</div>;
  }


  if(calls.length === 0){
    return <div>No Calls Exist Yet.</div>;
  }
  
  return (
    <div className="mx-[6.5%] my-20 bg-[#111110] rounded-md p-2">
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

      <div className="flex justify-center mt-4">
        {/* Previous Page Button */}
        {page > 1 && (
          <a
            href={`?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page - 1}`}
            className="px-4 py-2 bg-gray-700 rounded-md text-white"
          >
            Previous
          </a>
        )}

        {/* Next Page Button */}
        {calls.length === limit && (
          <a
            href={`?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page + 1}`}
            className="ml-2 px-4 py-2 bg-gray-700 rounded-md text-white"
          >
            Next
          </a>
        )}
      </div>
    </div>
  )
}