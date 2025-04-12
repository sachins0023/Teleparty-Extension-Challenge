import { SessionChatMessage } from "teleparty-websocket-lib";
import AvatarIcon from "./AvatarIcon";
import { formatTimestamp } from "../utils";

const MessageContainer = ({
  message,
  currentUserName,
}: {
  message: SessionChatMessage;
  currentUserName: string;
}) => {
  const { date, time, isToday } = formatTimestamp(message.timestamp);
  if (message.isSystemMessage) {
    return (
      <div className="rounded-md p-2 w-full">
        <div className="text-sm text-center">{isToday ? time : date}</div>
        <div className="text-sm text-center">
          {message.userNickname} {message.body}
        </div>
      </div>
    );
  }
  if (message.userNickname === currentUserName) {
    return (
      <div className="rounded-md p-2 w-full">
        <div className="text-sm flex items-center gap-2">
          <AvatarIcon
            name={message.userNickname || "user"}
            image={message.userIcon}
            color="blue"
          />
          <div className="text-sm border-2 border-blue-500 bg-blue-500 text-white rounded-md p-2 w-full mr-8">
            <div className="flex items-center justify-between">
              <div>{message.body}</div>
              <div className="text-xs">{isToday ? time : date}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md p-2 w-full">
      <div className="text-sm flex items-center gap-2">
        <div className="text-sm border-2 border-green-500 bg-green-500 text-white rounded-md p-2 w-full ml-8">
          <div className="flex items-center justify-between">
            <div>{message.body}</div>
            <div className="text-xs">{isToday ? time : date}</div>
          </div>
        </div>
        <AvatarIcon
          name={message.userNickname || "user"}
          image={message.userIcon}
          color="green"
        />
      </div>
    </div>
  );
};

export default MessageContainer;
