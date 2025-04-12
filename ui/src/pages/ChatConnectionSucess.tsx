const ChatConnectionSucess = ({
  name,
  sessionId,
}: {
  name: string;
  sessionId: string | null;
}) => {
  return (
    <div className="text-2xl font-bold text-center">
      Successfully connected to room {sessionId} as {name}!
    </div>
  );
};
export default ChatConnectionSucess;
