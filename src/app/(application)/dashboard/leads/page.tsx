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

export default async function leadsPage() {
  const leads = await listLeads();
  if (!leads) {
    return <div>Leads not found or not available.</div>;
  }


  if(leads.length === 0){
    return <div>No leads Exist Yet.</div>;
  }
  
  return (
    <div className="mx-[6.5%] my-20 bg-[#1e1e1e] rounded-md p-2">
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
            }/>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}