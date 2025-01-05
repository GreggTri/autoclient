
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const endOfCallReportHandler = async ( payload?: any ): Promise<void> => {
  /**
  * Handle Business logic here.
  * You can store the information like summary, typescript, recordingUrl or even the full messages list in the database.
  */

  console.log(payload);
  return payload;
};