import { Toaster } from "@/components/ui/sonner";
import Chat from "./pages/Chat";

import { useCallback, useEffect, useState } from "react";
import { closeSession, createSession, joinSession } from "./socket";
import { chatRoomActionType } from "./types/Chat";
import { SessionChatMessage, TelepartyClient } from "teleparty-websocket-lib";
import ActionButton from "./components/ActionButton";
import { useClient } from "./hooks/useClient";
import { getSessionDataFromLocalStorage, toastMessage } from "./utils";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isSessionConnected, setIsSessionConnected] = useState(false);
  const [isSessionConnecting, setIsSessionConnecting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isClosingSession, setIsClosingSession] = useState(false);
  const [currentAction, setCurrentAction] = useState<"create" | "join" | null>(
    null
  );

  const {
    client,
    typerUsers,
    setTyperUsers,
    sessionUsers,
    setSessionUsers,
    messages,
    setMessages,
    isClientConnected,
    loadPreviousMessages,
    isClientConnecting,
    reconnectDelay,
    userId,
    shouldReconnect,
    setShouldReconnect,
  } = useClient();

  const handleJoinChatRoom = useCallback(
    async ({ client, name, sessionId, imageUrl }: chatRoomActionType) => {
      if (!client || !name || !sessionId) {
        return;
      }
      setUserName(name);
      setImageUrl(imageUrl);
      setSessionId(sessionId);
      setIsSessionConnecting(true);
      setCurrentAction("join");
      try {
        await joinSession(client, sessionId, name, imageUrl).then(
          ({ messages }: { messages: SessionChatMessage[] }) => {
            setIsSessionConnected(true);
            toastMessage({
              message: "Connected to the room",
              type: "success",
            });
            loadPreviousMessages(messages);
            storeSessionDataInLocalStorage({
              sessionId,
              name,
              imageUrl,
            });
            setIsSessionConnecting(false);
            setIsChatOpen(true);
          }
        );
      } catch (error) {
        toastMessage({
          message: error.message,
          type: "error",
        });
        setIsSessionConnecting(false);
      }
    },
    [
      loadPreviousMessages,
      setIsChatOpen,
      setUserName,
      setImageUrl,
      setSessionId,
      setIsSessionConnected,
      setIsSessionConnecting,
    ]
  );

  useEffect(() => {
    const sessionData = getSessionDataFromLocalStorage();
    if (!sessionData) return;
    const { sessionId, name, imageUrl } = sessionData;

    if (!sessionId || !name || !client || !isClientConnected) return;

    handleJoinChatRoom({ client, sessionId, name, imageUrl });
  }, [client, handleJoinChatRoom, isClientConnected]);

  const storeSessionDataInLocalStorage = ({
    sessionId,
    name,
    imageUrl,
  }: {
    sessionId: string | undefined;
    name: string | undefined;
    imageUrl: string | undefined;
  }) => {
    const sessionData = {
      sessionId,
      name,
      imageUrl,
    };
    localStorage.setItem("sessionData", JSON.stringify(sessionData));
  };

  const handleCreateChatRoom = async ({
    name,
    imageUrl,
  }: chatRoomActionType) => {
    setImageUrl(imageUrl);
    setUserName(name);
    setCurrentAction("create");
    handleCreateRoom({ name, imageUrl });
  };

  const handleCreateRoom = async ({
    name,
    imageUrl,
  }: {
    name: string | undefined;
    imageUrl: string | undefined;
  }) => {
    if (!client || !name) {
      return;
    }
    setIsSessionConnecting(true);
    await createSession(client, name, imageUrl).then((newRoomId: string) => {
      setSessionId(newRoomId);
      setIsSessionConnected(true);
      storeSessionDataInLocalStorage({
        sessionId: newRoomId,
        name,
        imageUrl,
      });
      setIsSessionConnecting(false);
      setIsChatOpen(true);
    });
  };

  const handleLeaveRoom = async () => {
    setIsSessionConnected(false);
    setSessionId(undefined);
    setTyperUsers([]);
    setSessionUsers([]);
    setMessages([]);
    setShouldReconnect(false);
    setIsClosingSession(true);
    if (client) {
      await closeSession(client).then(() => {
        toastMessage({
          message: "Session closed successfully",
          type: "success",
        });
        setIsChatOpen(false);
        setIsClosingSession(false);
        localStorage.removeItem("sessionData");
      });
    }
    // localStorage.removeItem("sessionData");
  };

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
              name={userName}
              sessionId={sessionId}
              imageUrl={imageUrl}
              isConnected={isClientConnected}
              isLoading={isSessionConnecting}
              currentAction={currentAction}
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-lg">
              Already have a chat room? Join it here.
            </div>
            <ActionButton
              action="join"
              buttonText="Join"
              onSubmit={({ ...args }) =>
                handleJoinChatRoom({ ...args, client })
              }
              name={userName}
              sessionId={sessionId}
              imageUrl={imageUrl}
              isConnected={isClientConnected}
              isLoading={isSessionConnecting}
              currentAction={currentAction}
            />
          </div>
        </div>
      ) : (
        <Chat
          client={client}
          name={userName}
          sessionId={sessionId}
          typerUsers={typerUsers}
          messages={messages}
          sessionUsers={sessionUsers}
          isLoading={!isSessionConnected}
          imageUrl={imageUrl}
          isConnected={isClientConnected}
          handleLeaveRoom={handleLeaveRoom}
          userId={userId}
          isClosingSession={isClosingSession}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;
