import 'server-only'

import AgentFormComponent from "./AgentFormComponent";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AgentRow from "./AgentRow";
import { Icons } from "@/app/_components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { listAgents } from "@/app/_data/agent";


export default async function AgentsPage() {
  const agents = await listAgents();
  if (!agents) {
    return <div>Agents not found or not available.</div>;
  }


  if(agents.length === 0){
    return <AgentFormComponent/>;
  }
  
  return (
    <div className="mx-[6.5%] my-20 bg-[#111110] rounded-md p-2">
      <div className="flex justify-between my-2">

        <Link href={`/dashboard/agents/add`}>
          <Button className="text-white">
            <Icons.add height={25} width={25}/> Create Agent
          </Button>
        </Link>
        
      </div>
      <Table className="">
        <TableCaption>List of Agents</TableCaption>
        <TableHeader>
          <TableRow className="border-white/50">
            <TableHead className="">Agent Id</TableHead>

            <TableHead className="w-[150px]">Deactivate Agent</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="">
          {agents.sort((a, b) => {
            // Groups with isArchived false should come first
            if (a.isArchived === b.isArchived) return 0;
            return a.isArchived ? 1 : -1;
          })
          .map((agent) => (
            <AgentRow 
            key={agent.id} 
            agent={
              {
                'id': agent.id,
                //...
                'isArchived': agent.isArchived
              }
            }/>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}