import {
  TelepartyClient,
  SocketEventHandler,
  SocketMessageTypes,
  SessionChatMessage,
} from "teleparty-websocket-lib";

export const initClient = async ({
  onConnectionReady,
  onClose,
  onMessage,
}: {
  onConnectionReady: () => void;
  onClose: () => void;
  onMessage: (message: SessionChatMessage) => void;
}) => {
  const eventHandler: SocketEventHandler = {
    onConnectionReady,
    onClose,
    onMessage: (message) => {
      onMessage(message as unknown as SessionChatMessage);
    },
  };
  const client = new TelepartyClient(eventHandler);
  return client;
};

export const createSession = async (
  client: TelepartyClient,
  nickname: string,
  userIcon: string | undefined
) => {
  const roomId = await client.createChatRoom(nickname, userIcon);
  console.log("Room is created successfully", { roomId });
  return roomId;
};

export const joinSession = async (
  client: TelepartyClient,
  roomId: string,
  nickname: string,
  userIcon: string | undefined
) => {
  const resp = await client.joinChatRoom(nickname, roomId, userIcon);
  console.log("Joined session", {resp: JSON.stringify(resp, null, 2)});
  return resp
};

export const sendMessage = (client: TelepartyClient, message: string) => {
  client.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
    body: message,
  });
  console.log("Message sent successfully", { message });
};

export const updateTypingStatus = (
  client: TelepartyClient,
  typing: boolean
) => {
  client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
    typing,
  });
  console.log("Typing status updated successfully", { typing });
};
