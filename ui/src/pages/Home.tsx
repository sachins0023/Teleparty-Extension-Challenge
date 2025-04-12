import { useNavigate } from "react-router";
import ActionButton from "../components/ActionButton";
const Home = () => {
  const navigate = useNavigate();
  const handleCreateChatRoom = () => {
    navigate("/chat");
  };
  const handleJoinChatRoom = () => {
    navigate("/chat");
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <div className="text-2xl font-bold">
        Welcome to Teleparty! What do you want to do today?
      </div>
      <div className="flex gap-2 items-center">
        <div className="text-lg">Ready to chat with your friends?</div>
        <ActionButton
          action="create"
          buttonText="Create Chat Room"
          onSubmit={handleCreateChatRoom}
        />
      </div>
      <div className="flex gap-2 items-center">
        <div className="text-lg">Already have a chat room? Join it here.</div>
        <ActionButton
          action="join"
          buttonText="Join"
          onSubmit={handleJoinChatRoom}
        />
      </div>
    </div>
  );
};

export default Home;
