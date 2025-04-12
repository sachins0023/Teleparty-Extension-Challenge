import {
  TelepartyClient,
  SocketEventHandler,
  SocketMessageTypes,
  SessionChatMessage,
} from "teleparty-websocket-lib";

const eventHandler: SocketEventHandler = {
  onConnectionReady: () => {
    alert("Connection has been established");
  },
  onClose: () => {
    alert("Socket has been closed");
  },
  onMessage: (message) => {
    alert("Received message: " + message);
  },
};

export const initClient = () => {
  const client = new TelepartyClient(eventHandler);
  return client;
};

export const createSession = async (
  client: TelepartyClient,
  nickname: string,
  userIcon: string
) => {
  const roomId = await client.createChatRoom(nickname, userIcon);
  return roomId;
};

export const joinSession = async (
  client: TelepartyClient,
  roomId: string,
  nickname: string,
  userIcon: string
) => {
  await client.joinChatRoom(nickname, roomId, userIcon);
};

export const sendMessage = (client: TelepartyClient, message: string) => {
  client.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
    body: message,
  });
};

export const updateTypingStatus = (
  client: TelepartyClient,
  typing: boolean
) => {
  client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
    typing,
  });
};
