import { Toaster } from "@/components/ui/sonner";
import Chat from "./pages/Chat";

import { useState, useEffect, useCallback, useRef } from "react";
import { createSession, initClient, joinSession } from "./socket";
import { chatRoomActionType, chatDetailsType, SessionUser } from "./types/Chat";
import {
  SessionChatMessage,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";
import { toastMessage } from "@/utils";
import ActionButton from "./components/ActionButton";
import { SocketMessage } from "teleparty-websocket-lib/lib/SocketMessage";

function App() {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const userIdRef = useRef<string>("");
  const [isLoading, setIsLoading] = useState({
    connection: true,
    session: true,
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatDetails, setChatDetails] = useState<chatDetailsType>({
    name: "",
    sessionId: "",
    imageUrl: "",
    action: "create",
    typerUsers: [],
    messages: [],
  });
  const [sessionUsers, setSessionUsers] = useState<SessionUser[]>([]);
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
      persist: true,
      action: {
        label: "Reload",
        onClick: () => window.location.reload(),
      },
    });
    setTyperUsers([]);
    setIsLoading((prev) => ({ ...prev, connection: true }));
  }, []);

  const onMessage = useCallback(
    (message: SocketMessage) => {
      switch (message.type) {
        case "userId":
          userIdRef.current = message.data.userId;
          break;

        case "userList":
          console.log("userList", { message });
          setSessionUsers(message.data);
          break;

        case SocketMessageTypes.SEND_MESSAGE:
          setMessages((prev) => [...prev, message.data]);
          if (isLoading.session) {
            setIsLoading((prev) => ({ ...prev, session: false }));
            toastMessage({
              message: "Connected to the room",
              type: "success",
            });
          }
          break;

        case SocketMessageTypes.SET_TYPING_PRESENCE:
          if (message.data.anyoneTyping) {
            setTyperUsers(
              message.data.usersTyping.filter(
                (user: string) => user !== userIdRef.current
              )
            );
          } else {
            setTyperUsers([]);
          }
          break;

        default:
          break;
      }
    },
    [isLoading.session]
  );

  const setupClient = useCallback(async () => {
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
      setIsLoading((prev) => ({ ...prev, connection: false }));
    }
  }, []);

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
    const { messages }: { messages: SessionChatMessage[] } = await joinSession(
      client,
      sessionId,
      name,
      imageUrl
    );
    setMessages(messages);
  };

  // if (isLoading.connection) {
  //   return <div>Loading connection...</div>;
  // }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      {!isChatOpen ? (
        <div className="w-full flex flex-col justify-center items-center gap-4 border border-gray-200 rounded-md p-4 bg-gray-100">
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
              isConnected={!isLoading.connection}
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
              isConnected={!isLoading.connection}
            />
          </div>
        </div>
      ) : (
        <Chat
          client={client}
          name={chatDetails.name}
          sessionId={chatDetails.sessionId}
          typerUsers={typerUsers}
          messages={messages}
          sessionUsers={sessionUsers}
          isLoading={isLoading.session}
          imageUrl={chatDetails.imageUrl}
          isConnected={!isLoading.connection}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;
