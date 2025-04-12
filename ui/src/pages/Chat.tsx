import { useState } from "react";
import { chatRoomActionType } from "@/types/ChatRoom";
import { sendMessage, updateTypingStatus } from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import ChatConnectionSucess from "./ChatConnectionSucess";
import { SessionChatMessage } from "teleparty-websocket-lib";
import MessageContainer from "@/components/MessageContainer";
import { Textarea } from "@/components/ui/textarea";
const ChatContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-150 h-250 border-2 border-gray-300 rounded-md flex flex-col">
      {children}
    </div>
  );
};

const ChatHeader = ({
  name,
  sessionId,
}: {
  name: string;
  sessionId: string | null;
}) => {
  return (
    <div className="h-16 border-b-2 border-gray-300 flex items-center p-2 gap-2">
      Hello, {name}!
      <div>
        <p>Your room id is : {sessionId}</p>
      </div>
    </div>
  );
};

const ChatMessages = ({ messages }: { messages: SessionChatMessage[] }) => {
  console.log({ messages });
  return (
    <div className="flex-1 p-2 overflow-y-auto flex flex-col justify-end">
      {messages.map((message, index) => (
        <div key={index} className="w-full flex flex-col mb-2">
          <MessageContainer message={message} />
        </div>
      ))}
    </div>
  );
};

const ChatInput = ({
  onMessageSubmit,
  message,
  setMessage,
  handleTypingStatus,
}: {
  onMessageSubmit: () => void;
  message: string;
  setMessage: (message: string) => void;
  handleTypingStatus: (typing: boolean) => void;
}) => {
  return (
    <Textarea
      autoFocus
      className="rounded-md h-24 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
      placeholder="Enter your message here..."
      onBlur={(e) => {
        handleTypingStatus(false);
      }}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault(); // Prevent new line on Enter
          onMessageSubmit();
        }
      }}
      onFocus={() => {
        handleTypingStatus(true);
      }}
    />
  );
};

const ChatFooter = ({
  onSubmit,
  handleTypingStatus,
  typerUsers,
}: {
  onSubmit: (message: string) => void;
  handleTypingStatus: (typing: boolean) => void;
  typerUsers: string[];
}) => {
  const [message, setMessage] = useState("");
  const onMessageSubmit = () => {
    onSubmit(message);
    setMessage("");
  };
  return (
    <div className="h-32 border-t-2 border-gray-300 p-2 flex items-center gap-2">
      <div className="w-full h-full flex flex-col">
        <ChatInput
          onMessageSubmit={onMessageSubmit}
          message={message}
          setMessage={setMessage}
          handleTypingStatus={handleTypingStatus}
        />
        {typerUsers.length > 0 && (
          <p className="text-xs text-gray-500">
            {typerUsers.join(", ")} is typing...
          </p>
        )}
      </div>
      <Button className="w-16" onClick={onMessageSubmit}>
        Send
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
}: chatRoomActionType) => {
  const onSubmit = (message: string) => {
    sendMessage(client, message);
  };

  const handleTypingStatus = (typing: boolean) => {
    updateTypingStatus(client, typing);
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-4">
      <ChatConnectionSucess name={name} sessionId={sessionId} />
      <ChatContainer>
        <ChatHeader name={name} sessionId={sessionId} />
        <ChatMessages messages={messages} />
        <ChatFooter
          onSubmit={onSubmit}
          handleTypingStatus={handleTypingStatus}
          typerUsers={typerUsers}
        />
      </ChatContainer>
    </div>
  );
};

export default Chat;
