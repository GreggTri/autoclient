// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface VapiCall {}

export interface ConversationMessage {
    role: "user" | "system" | "bot" | "function_call" | "function_result";
    message?: string;
    name?: string;
    args?: string;
    result?: string;
    time: number;
    endTime?: number;
    secondsFromStart: number;
}

export enum VapiWebhookEnum {
    ASSISTANT_REQUEST = "assistant-request",
    FUNCTION_CALL = "function-call",
    STATUS_UPDATE = "status-update",
    END_OF_CALL_REPORT = "end-of-call-report",
    HANG = "hang",
    SPEECH_UPDATE = "speech-update",
    TRANSCRIPT = "transcript",
}

interface BaseVapiPayload {
    call: VapiCall;
}

export interface EndOfCallReportPayload extends BaseVapiPayload {
  type: VapiWebhookEnum.END_OF_CALL_REPORT;
  endedReason: string;
  transcript: string;
  messages: ConversationMessage[];
  summary: string;
  recordingUrl?: string;
}

export const endOfCallReportHandler = async ( payload?: EndOfCallReportPayload ): Promise<void> => {
  /**
  * Handle Business logic here.
  * You can store the information like summary, typescript, recordingUrl or even the full messages list in the database.
  */

  console.log(payload);
  return;
};