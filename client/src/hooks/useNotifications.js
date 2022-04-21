import { useState, useEffect } from "react";
import socket_io from "socket.io-client";

export const useNotifications = (authenticated, userId, dispatchChatNotifi) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!authenticated) return;
    else if (socket && !authenticated) {
      return socket.close();
    }
    // @ts-ignore
    const newSocket = socket_io(process.env.REACT_APP_PROXY, {
      query: { id: userId },
    });

    setSocket(newSocket);

    newSocket.on("receive-notification", (res) => {
      console.log("Notification received: ", res);
      dispatchChatNotifi(res, userId);
    });

    return () => newSocket.close();
  }, [userId]);
};
