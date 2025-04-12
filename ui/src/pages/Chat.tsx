const ChatContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-150 h-250 border-2 border-gray-300 rounded-md flex flex-col">
      {children}
    </div>
  );
};

const ChatHeader = () => {
  return (
    <div className="h-16 border-b-2 border-gray-300 flex items-center p-2">
      Chat
    </div>
  );
};

const ChatMessages = () => {
  return <div className="flex-1 p-2">ChatMessages</div>;
};

const ChatInput = () => {
  return (
    <div className="h-32 border-t-2 border-gray-300 p-2">
      <input
        type="text"
        className="w-full h-full border-2 border-gray-300 rounded-md"
        placeholder="Chat here..."
      />
    </div>
  );
};

const Chat = () => {
  return (
    <ChatContainer>
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </ChatContainer>
  );
};

export default Chat;
