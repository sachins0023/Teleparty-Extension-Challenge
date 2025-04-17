import { useState, useEffect, useRef, useCallback } from "react";
import { ChatRoomType, SessionUser } from "@/types/Chat";
import { sendMessage, updateTypingStatus } from "@/socket";
import { Button } from "@/components/ui/button";
import { SessionChatMessage } from "teleparty-websocket-lib";
import MessageContainer from "@/components/MessageContainer";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Loader2, LoaderCircle, SendHorizontal } from "lucide-react";
import { toastMessage } from "@/utils";
import AvatarIcon from "@/components/AvatarIcon";

const Badge = ({ isConnected }: { isConnected: boolean }) => {
  if (isConnected) {
    return <div className="w-2 h-2 bg-green-500 rounded-full" />;
  }
  return <div className="w-2 h-2 bg-red-500 rounded-full" />;
};

const ChatContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-150 border-2 border-gray-300 rounded-md flex flex-col">
      {children}
    </div>
  );
};

const ChatHeader = ({
  name,
  sessionId,
  isLoading,
  imageUrl,
  isConnected,
}: {
  name: string | undefined;
  sessionId: string | undefined;
  isLoading: boolean;
  imageUrl: string | undefined;
  isConnected: boolean;
}) => {
  return (
    <div className="h-16 border-b-2 border-gray-300 flex items-center p-2 gap-2 justify-between">
      <div className="flex items-center gap-2 text-xl font-bold">
        <AvatarIcon name={name || "user"} image={imageUrl} color="blue" />{" "}
        {name}
        <Badge isConnected={isConnected} />
      </div>
      {isLoading ? (
        <p className="flex items-center gap-2">
          Connecting{" "}
          <LoaderCircle className="w-4 h-4 animate-spin text-blue-500" />
        </p>
      ) : (
        <div className="flex items-center gap-2">
          <p>Room : {sessionId}</p>
          <Copy
            className="w-4 h-4 cursor-pointer text-blue-500"
            onClick={() => {
              navigator.clipboard.writeText(sessionId || "");
              toastMessage({
                message: "Copied to clipboard",
                type: "success",
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

const ChatMessages = ({
  messages,
  currentUserName,
  isLoading,
}: {
  messages: SessionChatMessage[];
  currentUserName: string | undefined;
  isLoading: boolean;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="p-2 overflow-y-auto flex flex-col bg-gray-100 min-h-[500px] h-[70vh]">
      {isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Please wait while we
          connect...
        </div>
      )}
      <div className="flex-1" />
      {messages.map((message, index) => (
        <div key={index} className="w-full flex flex-col mb-2">
          <MessageContainer
            message={message}
            currentUserName={currentUserName}
          />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

const ChatInput = ({
  onMessageSubmit,
  message,
  setMessage,
  handleTypingStatus,
  isTyping,
}: {
  onMessageSubmit: () => void;
  message: string;
  setMessage: (message: string) => void;
  handleTypingStatus: (typing: boolean) => void;
  isTyping: boolean;
}) => {
  useEffect(() => {
    if (message.length && !isTyping) {
      handleTypingStatus(true);
    } else if (!message.length && isTyping) {
      handleTypingStatus(false);
    }
  }, [message, handleTypingStatus, isTyping]);

  return (
    <Textarea
      autoFocus
      className="rounded-md h-24 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
      placeholder="Enter your message here..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault(); // Prevent new line on Enter
          onMessageSubmit();
        }
      }}
    />
  );
};

const ChatFooter = ({
  onSubmit,
  handleTypingStatus,
  typerUsers,
  sessionUsers,
  userId,
  isConnected,
  isLoading,
}: {
  onSubmit: (message: string) => void;
  handleTypingStatus: (typing: boolean) => void;
  typerUsers: string[];
  sessionUsers: SessionUser[];
  userId: string | null;
  isConnected: boolean;
  isLoading: boolean;
}) => {
  const [message, setMessage] = useState("");

  const onMessageSubmit = useCallback(() => {
    onSubmit(message);
    setMessage("");
  }, [message, onSubmit]);

  return (
    <div className="h-32 border-t-2 border-gray-300 p-2 flex items-center gap-2">
      <div className="w-full h-full flex flex-col">
        <ChatInput
          onMessageSubmit={onMessageSubmit}
          message={message}
          setMessage={setMessage}
          handleTypingStatus={handleTypingStatus}
          isTyping={typerUsers.includes(userId || "")}
        />
        {typerUsers.length > 0 && (
          <p className="text-xs text-gray-500">
            {typerUsers
              .map(
                (user: string) =>
                  sessionUsers.find((u) => u.socketConnectionId === user)
                    ?.userSettings?.userNickname || user
              )
              .join(", ")}{" "}
            is typing...
          </p>
        )}
      </div>
      <Button
        className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-xl cursor-pointer"
        onClick={onMessageSubmit}
        disabled={!isConnected || isLoading}
      >
        <SendHorizontal />
      </Button>
    </div>
  );
};

const Chat = ({
  name,
  sessionId,
  client,
  typerUsers,
  messages,
  sessionUsers,
  isLoading,
  imageUrl,
  isConnected,
  handleLeaveRoom,
  userId,
  isClosingSession,
}: ChatRoomType) => {
  const onSubmit = (message: string) => {
    if (!client || !isConnected || isClosingSession || isLoading) return;
    sendMessage(client, message);
  };

  const handleTypingStatus = (typing: boolean) => {
    if (!client) return;
    updateTypingStatus(client, typing);
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 p-4">
      <ChatContainer>
        <ChatHeader
          name={name}
          sessionId={sessionId}
          isLoading={isLoading}
          imageUrl={imageUrl}
          isConnected={isConnected}
        />
        <ChatMessages
          messages={messages}
          currentUserName={name}
          isLoading={isLoading}
        />
        <ChatFooter
          onSubmit={onSubmit}
          handleTypingStatus={handleTypingStatus}
          typerUsers={typerUsers}
          sessionUsers={sessionUsers}
          userId={userId}
          isConnected={isConnected}
          isLoading={isLoading}
        />
      </ChatContainer>
      <Button
        onClick={handleLeaveRoom}
        className="bg-red-500 hover:bg-red-600 cursor-pointer"
        disabled={isClosingSession || !isConnected}
        isLoading={isClosingSession}
      >
        Leave Room
      </Button>
    </div>
  );
};

export default Chat;
