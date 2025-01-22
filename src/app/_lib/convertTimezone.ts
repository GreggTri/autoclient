export const convertToTimezone = (date: Date, timezone: string): string => {
    // Use Intl.DateTimeFormat to format the date for the specified timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      dateStyle: "full",
      timeStyle: "long",
    });
  
    return formatter.format(date);
};