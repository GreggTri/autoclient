"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { handleTimezoneSelection } from "./actions";
import { useRouter } from 'next/navigation'

const TimezoneDropdownClient = ({ timezones }: { timezones: string[] }) => {
    const [query, setQuery] = useState(""); // Single state for both query and value
    const [open, setOpen] = useState(false);

    const router = useRouter()

    // Filter timezones: case-insensitive and matches both full timezone and parts of it
    const filteredTimezones = timezones.filter((timezone) => {
        const normalizedQuery = query.toLowerCase();
        const normalizedTimezone = timezone.toLowerCase();
        return (
        normalizedTimezone.includes(normalizedQuery) || // Match any part of the string
        timezone.split("/").some((part) => part.toLowerCase().includes(normalizedQuery)) // Match individual parts
        );
    });

    const handleSelection = async (timezone: string) => {
    
        try {
          // Call the server action
          const response = await handleTimezoneSelection(timezone);
    
          if( response && 'id' in response){
                toast({
                title: "timezone has been updated!",
                description: "Dates and Times of this app will reflect this new timezone",
                variant: "destructive",
                className: "bg-green-500 border-none"
                })

                router.refresh()

            } else {
                throw new Error("Failed to create Schedule")
            }
        } catch (error) {
            console.log(error);
            
          // Show error toast
          toast({
            title: "Failed to update timezone!",
            description: "Failed to select the timezone. Please try again.",
            variant: "destructive", 
            className: "bg-red-500 border-none"
          });
        }
      };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[300px] justify-between"
                >
                {query || "Select a timezone..."}
                <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-2 scrollbar-thin">
                {/* Search Input */}
                <div className="mb-2">
                <input
                    type="text"
                    placeholder="Search timezones..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-3 py-1 border bg-[#111110] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
                <Separator/>
                {/* Timezone List */}
                <div className="max-h-60 overflow-auto">
                {filteredTimezones.length > 0 ? (
                    filteredTimezones.map((timezone) => (
                    <div
                        key={timezone}
                        onClick={() => {
                        setQuery(timezone); // Set the selected timezone
                        setOpen(false); // Close the popover
                        handleSelection(timezone);
                        }}
                        className={cn(
                        "cursor-pointer p-2 rounded-md hover:bg-[#111110]",
                        query === timezone && "bg-[#111110] font-semibold"
                        )}
                    >
                        {timezone}
                        {query === timezone && (
                        <Check className="inline ml-2 text-blue-500" />
                        )}
                    </div>
                    ))
                ) : (
                    <div className="p-2 text-gray-500">No timezone found.</div>
                )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default TimezoneDropdownClient;
