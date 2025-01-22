import 'server-only'

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import LeadRow from "./LeadRow";
import { listLeads } from "@/app/_data/lead";
import { getUserTimezone } from '@/app/_data/user';

export default async function leadsPage({ params }: { params: Promise<{ sortByParam: string, sortOrderParam: string, pageParam: string, limitParam: number }> }) {
  // Extract query parameters
  const { sortByParam, sortOrderParam, pageParam, limitParam } = await params;

  const sortBy = sortByParam || 'createdAt'; // Default sorting by createdAt
  const sortOrder = sortOrderParam || 'desc'; // Default to descending order
  const page = parseInt(pageParam, 10) || 1; // Default to page 1
  const limit = limitParam; // Items per page

  
  const userTimezone = await getUserTimezone();
  // Fetch leads with pagination and sorting
  const leads = await listLeads({ sortBy, sortOrder, page, limit });
  
  if (!leads) {
    return <div>Leads not found or not available.</div>;
  }


  if(leads.length === 0){
    return <div>No leads Exist Yet.</div>;
  }
  
  return (
    <div className="mx-[6.5%] my-20 bg-[#111110] rounded-md p-2">
      <div className="flex justify-between my-2">
        
      </div>
      <Table className="">
        <TableCaption>List of leads</TableCaption>
        <TableHeader>
          <TableRow className="border-white/50">
            <TableHead className="">Lead Id</TableHead>
            <TableHead className="">Lead Created At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="">
          {leads.map((lead) => (
            <LeadRow 
            key={lead.id} 
            lead={
              {
                'id': lead.id,
                'createdAt': lead.createdAt
              }
            }
            userTimezone={userTimezone!.timezone}
            />
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
        {leads.length === limit && (
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