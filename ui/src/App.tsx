import { Toaster } from "@/components/ui/sonner";
import Chat from "./pages/Chat";
import Home from "./pages/Home";

import { useState, useEffect } from "react";
import { createSession, initClient } from "./hooks/useSocket";
import { chatRoomActionType } from "./types/ChatRoom";
import {
  SessionChatMessage,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";
import { toastMessage } from "./components/Toast";

function App() {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatDetails, setChatDetails] = useState<chatRoomActionType>({
    name: "",
    sessionId: "",
    imageUrl: "",
    action: "create",
    client: null,
    typerUsers: [],
    messages: [],
  });
  const [typerUsers, setTyperUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);

  const onConnectionReady = () => {
    console.log("Connection has been established");
    toastMessage("Connection has been established", "Success");
  };

  const onClose = () => {
    console.log("Socket has been closed");
    toastMessage("Connection has been closed", "Error");
    setTyperUsers([]);
  };

  const onMessage = (message: SessionChatMessage) => {
    console.log("Received message: " + JSON.stringify(message, null, 2));
    if (message.type === SocketMessageTypes.SEND_MESSAGE) {
      setMessages((prev) => [...prev, message.data]);
    }
    if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
      if (message.data.anyoneTyping) {
        setTyperUsers(message.data.usersTyping);
      } else {
        setTyperUsers([]);
      }
    }
  };

  useEffect(() => {
    const setupClient = async () => {
      try {
        const newClient = await initClient({
          onConnectionReady,
          onClose,
          onMessage,
        });
        setClient(newClient);
      } catch (error) {
        console.error("Failed to initialize socket client:", error);
        toastMessage("Failed to initialize socket client", "Error");
      } finally {
        setIsLoading(false);
      }
    };
    setupClient();
  }, []);

  const handleCreateChatRoom = async ({
    name,
    imageUrl,
  }: chatRoomActionType) => {
    setIsChatOpen(true);
    setChatDetails((prev) => ({ ...prev, name, imageUrl, action: "create" }));
    handleCreateRoom({ name, imageUrl });
  };

  const handleCreateRoom = async ({
    name,
    imageUrl,
  }: {
    name: string;
    imageUrl: string;
  }) => {
    if (!client || !name) {
      return;
    }
    const newRoomId = await createSession(client, name, imageUrl);
    setChatDetails((prev) => ({ ...prev, sessionId: newRoomId }));
  };

  const handleJoinChatRoom = async ({
    name,
    sessionId,
    imageUrl,
  }: chatRoomActionType) => {
    setIsChatOpen(true);
    setChatDetails((prev) => ({
      ...prev,
      name,
      sessionId,
      imageUrl,
      action: "join",
    }));

    if (!client || !name || !sessionId) {
      return;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="root" className="w-full h-full flex flex-col items-center gap-4">
      {isChatOpen ? (
        <Chat
          client={client}
          action={chatDetails.action}
          name={chatDetails.name}
          sessionId={chatDetails.sessionId}
          imageUrl={chatDetails.imageUrl}
          typerUsers={typerUsers}
          messages={messages}
        />
      ) : (
        <Home
          handleCreateChatRoom={handleCreateChatRoom}
          handleJoinChatRoom={handleJoinChatRoom}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;
