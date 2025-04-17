import { initClient } from "@/socket";
import { SessionUser } from "@/types/Chat";
import { toastMessage, countdownToast } from "@/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SessionChatMessage,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";
import { SocketMessage } from "teleparty-websocket-lib/lib/SocketMessage";

const MAX_RECONNECT_ATTEMPTS = 3;

export const useClient = () => {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const [typerUsers, setTyperUsers] = useState<string[]>([]);
  const [sessionUsers, setSessionUsers] = useState<SessionUser[]>([]);
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [shouldReconnect, setShouldReconnect] = useState(true);
  const userIdRef = useRef<string | null>(null);

  const setupClient = useCallback(async () => {
    try {
      setIsConnecting(true);
      await initClient({
        onConnectionReady,
        onClose,
        onMessage,
      }).then((newClient: TelepartyClient) => {
        setClient(newClient);
      });
    } catch (error) {
      console.error("Failed to initialize socket client:", error);
      toastMessage({
        type: "error",
        message: "Failed to initialize socket client",
        persist: true,
        action: {
          label: "Reconnect",
          onClick: () => setupClient(),
        },
      });
    }
  }, []);

  const reconnectDelay = useMemo(() => {
    return Math.pow(2, reconnectAttempts) * 5000;
  }, [reconnectAttempts]);

  const handleReconnect = useCallback(() => {
    if (!shouldReconnect) return;
    const { clear } = countdownToast({
      initialMessage: "Reconnecting in {countdown}s...",
      type: "error",
      totalDuration: reconnectDelay,
      action: {
        label: "Reconnect Now",
        onClick: () => {
          clear();
          setupClient();
        },
      },
      onComplete: () => {
        setupClient();
      },
    });

    setReconnectAttempts((prev) => prev + 1);
  }, [setupClient, reconnectDelay, shouldReconnect]);

  const onConnectionReady = useCallback(() => {
    console.log("Connection has been established");
    toastMessage({
      message: "Connection has been established",
      type: "success",
    });
    setIsConnecting(false);
    setIsConnected(true);
    setShouldReconnect(true);
    setReconnectAttempts(0);
  }, []);

  const onClose = useCallback(() => {
    console.log("Socket has been closed");
    setTyperUsers([]);
    setIsConnected(false);
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && shouldReconnect) {
      handleReconnect();
    } else {
      toastMessage({
        message: "Connection has been closed",
        type: "error",
        persist: true,
        action: {
          label: "Reconnect",
          onClick: () => setupClient(),
        },
      });
    }
  }, [handleReconnect, setupClient, reconnectAttempts, shouldReconnect]);

  const onMessage = useCallback((message: SocketMessage) => {
    switch (message.type) {
      case "userId":
        userIdRef.current = message.data.userId;
        break;

      case "userList":
        setSessionUsers(message.data);
        break;

      case SocketMessageTypes.SEND_MESSAGE:
        setMessages((prev) => [...prev, message.data]);
        break;

      case SocketMessageTypes.SET_TYPING_PRESENCE:
        if (message.data.anyoneTyping) {
          // Code for filtering out the current user
          // setTyperUsers(
          //   message.data.usersTyping.filter(
          //     (user: string) => user !== userIdRef.current
          //   )
          // );
          setTyperUsers(message.data.usersTyping);
        } else {
          setTyperUsers([]);
        }
        break;

      default:
        break;
    }
  }, []);

  useEffect(() => {
    setupClient();
  }, []);

  useEffect(() => {
    if (isConnecting) {
      toastMessage({
        type: "info",
        message: "Please wait while we connect to the client",
      });
    }
  }, [isConnecting]);

  const loadPreviousMessages = useCallback(
    async (previousMessages: SessionChatMessage[]) => {
      setMessages(previousMessages);
    },
    []
  );

  return {
    client,
    typerUsers,
    setTyperUsers,
    sessionUsers,
    setSessionUsers,
    messages,
    setMessages,
    isClientConnected: isConnected,
    loadPreviousMessages,
    isClientConnecting: isConnecting,
    reconnectDelay,
    userId: userIdRef.current,
    shouldReconnect,
    setShouldReconnect,
  };
};
