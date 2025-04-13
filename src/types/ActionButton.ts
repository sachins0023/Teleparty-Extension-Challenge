import { chatRoomActionType } from "./ChatRoom";

export type ActionButtonProps = chatRoomActionType & {
  action: "create" | "join";
  buttonText: string;
  onSubmit: (payload: chatRoomActionType) => void;
  isConnected: boolean;
};
