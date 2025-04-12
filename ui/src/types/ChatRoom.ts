import { SessionChatMessage, TelepartyClient } from "teleparty-websocket-lib";

export type chatRoomActionType = {
  name: string;
  sessionId: string | undefined;
  imageUrl: string;
  client: TelepartyClient | null;
  action: "create" | "join";
  typerUsers: string[];
  messages: SessionChatMessage[];
};
