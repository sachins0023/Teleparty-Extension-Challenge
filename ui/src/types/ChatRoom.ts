import { TelepartyClient } from "teleparty-websocket-lib";

import { SessionChatMessage } from "teleparty-websocket-lib";

export type ChatRoomType = {
  name: string;
  sessionId: string | undefined;
  client: TelepartyClient | null;
  typerUsers: string[];
  messages: SessionChatMessage[];
};

export type chatRoomActionType = {
  name: string;
  sessionId: string | undefined;
  imageUrl: string | undefined;
};

export type chatDetailsType = chatRoomActionType & {
  action: "create" | "join";
  typerUsers: string[];
  messages: SessionChatMessage[];
};
