import { Toaster } from "@/components/ui/sonner";
import Chat from "./pages/Chat";

import { useState, useEffect, useCallback } from "react";
import { createSession, initClient } from "./hooks/useSocket";
import { chatRoomActionType, chatDetailsType } from "./types/ChatRoom";
import {
  SessionChatMessage,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";
import { toastMessage } from "./components/Toast";
import ActionButton from "./components/ActionButton";

function App() {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatDetails, setChatDetails] = useState<chatDetailsType>({
    name: "",
    sessionId: "",
    imageUrl: "",
    action: "create",
    typerUsers: [], // import { StrictMode } from "react";
    messages: [],
  });
  const [sessionUsers, setSessionUsers] = useState<string[]>([]);
  const [typerUsers, setTyperUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);

  const onConnectionReady = useCallback(() => {
    console.log("Connection has been established");
    toastMessage({
      message: "Connection has been established",
      type: "success",
    });
  }, []);

  const onClose = useCallback(() => {
    console.log("Socket has been closed");
    toastMessage({
      message: "Connection has been closed",
      type: "error",
      action: {
        label: "Reload",
        onClick: () => window.location.reload(),
      },
    });
    setTyperUsers([]);
    setSessionUsers([]);
    setMessages([]);
  }, [setTyperUsers]);

  const onMessage = useCallback(
    (message: SessionChatMessage) => {
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
      if (message.type === "userList") {
        setSessionUsers(message.data);
      }
    },
    [setMessages, setTyperUsers]
  );

  const setupClient = async () => {
    console.log("Setting up client");
    try {
      const newClient = await initClient({
        onConnectionReady,
        onClose,
        onMessage,
      });
      setClient(newClient);
    } catch (error) {
      console.error("Failed to initialize socket client:", error);
      toastMessage({
        type: "error",
        message: "Failed to initialize socket client",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    imageUrl: string | undefined;
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
          name={chatDetails.name}
          sessionId={chatDetails.sessionId}
          typerUsers={typerUsers}
          messages={messages}
          sessionUsers={sessionUsers}
        />
      ) : (
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <div className="text-2xl font-bold">
            Welcome to Teleparty! What do you want to do today?
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-lg">Ready to chat with your friends?</div>
            <ActionButton
              action="create"
              buttonText="Create Chat Room"
              onSubmit={handleCreateChatRoom}
              name={chatDetails.name}
              sessionId={chatDetails.sessionId}
              imageUrl={chatDetails.imageUrl}
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-lg">
              Already have a chat room? Join it here.
            </div>
            <ActionButton
              action="join"
              buttonText="Join"
              onSubmit={handleJoinChatRoom}
              name={chatDetails.name}
              sessionId={chatDetails.sessionId}
              imageUrl={chatDetails.imageUrl}
            />
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default App;
