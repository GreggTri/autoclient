'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from "react";
import Vapi from "@vapi-ai/web";
import assert from 'assert';
import { Icons } from '@/app/_components/icons';

assert(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY != undefined)

const vapiWeb = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

export default function TestCallButton({ agentId }: { agentId: string }) {

  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      // Call the start function
      await vapiWeb.start(agentId);
      setIsRunning(true); // Switch to "Stop" button
    } catch (error) {
      console.error("Failed to start the assistant:", error);
      alert("Failed to start the assistant.");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      // Call the stop function
      vapiWeb.stop();
      setIsRunning(false); // Switch back to "Start" button
    } catch (error) {
      console.error("Failed to stop the assistant:", error);
      alert("Failed to stop the assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='absolute right-32 top-32 md:right-32 md:top-32'>
      {isRunning ? (
        <Button onClick={handleStop} disabled={loading} className='text-BLACK'>
          {loading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : "Stop Call Agent"}
        </Button>
      ) : (
        <Button onClick={handleStart} disabled={loading} className='text-BLACK'>
          {loading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : "Test Call Agent"}
        </Button>
      )}
    </div>
  );
}