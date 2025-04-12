import { SessionChatMessage } from "teleparty-websocket-lib";
import AvatarIcon from "./AvatarIcon";

const MessageContainer = ({ message }: { message: SessionChatMessage }) => {
  if (message.isSystemMessage) {
    return (
      <div className="rounded-md p-2 w-full">
        <div className="text-sm text-center">
          {message.userNickname} {message.body}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-md p-2 w-full">
      <div className="text-sm flex items-center gap-2">
        <AvatarIcon
          name={message.userNickname || "user"}
          image={message.userIcon}
        />
        <div className="text-sm border-2 border-blue-500 bg-blue-500 text-white rounded-md p-2 w-full">
          {message.body}
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
