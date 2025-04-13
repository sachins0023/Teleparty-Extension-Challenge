import { SessionChatMessage } from "teleparty-websocket-lib";
import AvatarIcon from "./AvatarIcon";
import { formatTimestamp } from "../utils";

const DateContainer = ({ message }: { message: SessionChatMessage }) => {
  const { date, time, isToday } = formatTimestamp(message.timestamp);
  return (
    <div className="text-xs text-gray-500 mb-1">{isToday ? time : date}</div>
  );
};

const MessageContainer = ({
  message,
  currentUserName,
}: {
  message: SessionChatMessage;
  currentUserName: string;
}) => {
  if (message.isSystemMessage) {
    return (
      <div className="rounded-md p-2 w-full flex flex-col items-center">
        <DateContainer message={message} />
        <div className="text-sm text-center text-gray-500 gap-1 flex">
          <p>{message.userNickname}</p>
          <p>{message.body}</p>
        </div>
      </div>
    );
  }
  if (message.userNickname === currentUserName) {
    return (
      <div className="rounded-md p-2 w-full">
        <div className="text-sm flex items-end  gap-2">
          <div className="flex items-end justify-end gap-2 w-full">
            <DateContainer message={message} />
            <div className="text-sm border-2 border-blue-500 bg-blue-500 text-white rounded-xl p-2 max-w-[70%]">
              {message.body}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md p-2 w-full">
      <div className="text-sm flex items-end gap-2">
        <div className="mb-2">
          <AvatarIcon
            name={message.userNickname || "user"}
            image={message.userIcon}
            color="gray"
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="text-sm border-2 border-gray-300 bg-gray-300 text-black rounded-xl p-2 max-w-[70%]">
            {message.body}
          </div>
          <DateContainer message={message} />
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
