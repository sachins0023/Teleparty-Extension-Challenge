const ChatConnectionSuccess = ({
  name,
  sessionId,
}: {
  name: string;
  sessionId: string | undefined;
}) => {
  return (
    <div className="text-2xl font-bold text-center">
      Successfully connected to room {sessionId} as {name}!
    </div>
  );
};
export default ChatConnectionSuccess;
