import { chatRoomActionType } from "./Chat";

export type ActionButtonProps = chatRoomActionType & {
  action: "create" | "join";
  buttonText: string;
  onSubmit: (payload: chatRoomActionType) => void;
  isConnected: boolean;
  isLoading: boolean;
  currentAction: "create" | "join" | null;
};
