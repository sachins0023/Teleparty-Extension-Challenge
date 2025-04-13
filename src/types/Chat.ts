import { TelepartyClient } from "teleparty-websocket-lib";

import { SessionChatMessage } from "teleparty-websocket-lib";

export type ChatRoomType = {
  name: string;
  sessionId: string | undefined;
  client: TelepartyClient | null;
  typerUsers: string[];
  messages: SessionChatMessage[];
  sessionUsers: SessionUser[];
  isLoading: boolean;
  imageUrl: string | undefined;
  isConnected: boolean;
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

export type UserSettings = {
  userIcon: string;
  userNickname: string;
};

export type SessionUser = {
  firebaseUid: string;
  isCloudPlayer: string;
  isHost: string;
  permId: string;
  socketConnectionId: string;
  userSettings: UserSettings;
};

// export type chatMessageType = {
//   type: string;
//   data:
//     | SessionChatMessage
//     | { userId?: string, anyoneTyping?: boolean; usersTyping?: string[] };
// };

// firebaseUid
// :
// ""
// isCloudPlayer
// :
// ""
// isHost
// :
// "true"
// permId
// :
// "0000000000000000"
// socketConnectionId
// :
// "fa6b21d04b6f8a37"
// userSettings
// :
// {userIcon: '', userNickname: 'Sachin'}
