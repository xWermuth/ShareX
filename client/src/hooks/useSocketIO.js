import { useState, useCallback, useEffect } from "react";
import io from "socket.io-client";
import {
  sortFollowing,
  getChatsFromConversations,
} from "../components/chat/utils/chat.utils";

export const useSocketIO = (
  _conversations,
  _followers,
  addChatFunc,
  addFollowerToConversation,
  authenticated
) => {
  let [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chats, setChat] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [conversation_id, setConversationId] = useState("");
  const [receiverId, setReceiverId] = useState("");

  useEffect(() => {
    if (_conversations && _conversations.length !== 0 && authenticated) {
      const {
        sortedConversations,
        chats: newChats,
      } = getChatsFromConversations(_conversations, conversation_id);

      setConversations(sortedConversations);
      setChat(newChats);
    } else {
      setChat([]);
      setConversations([]);
    }
  }, [_conversations, authenticated]);

  useEffect(() => {
    if (authenticated && _followers.length !== 0 && _followers) {
      const sortedFollowers = sortFollowing(_followers);
      setFollowers(sortedFollowers);
    } else {
      setFollowers([]);
    }
  }, [_followers, authenticated]);

  useEffect(() => {
    if (
      (socket && conversation_id) ||
      (!authenticated && socket && conversation_id)
    ) {
      socket.emit("leave-conversation", {
        conversation_id,
      });
    }

    if (!authenticated) return;

    const newSocket = io(process.env.REACT_APP_PROXY, {
      query: { id: conversation_id },
    });
    setSocket(newSocket);

    newSocket.on("receive-message", (res) => {
      const chat = {
        type: res.type,
        message: res.message,
        profileImage: res.profileImage,
        time: res.time,
        senderId: res.senderId,
        toId: receiverId,
        conversationId: res.conversationId,
      };

      if (!conversation_id) {
        const index = followers.findIndex((user) => user.userId === receiverId);

        if (index < 0) {
          console.error("Could not find follower");
          return;
        }

        const {
          userHandle: receiverHandle,
          profileImage: receiverImage,
        } = followers[index];

        const newConversation = {
          userHandle: receiverHandle,
          name: "",
          unreadMessages: 0,
          modified: Date.now(),
          conversationId: res.conversationId,
          profileImage: receiverImage,
          chatType: "private",
        };

        followers.splice(index, 1);

        setFollowers(followers);

        addFollowerToConversation(newConversation);

        setConversationId(res.conversationId);
      }

      // setChat((prevChats) => [...prevChats, chat]);
      addChatFunc(chat, res.conversationId);
    });

    return () => newSocket.close();
  }, [
    conversation_id,
    setConversationId,
    addChatFunc,
    receiverId,
    authenticated,
  ]);

  const handleConversationId = useCallback(
    (convId, _receiverId) => {
      if (convId === conversation_id && conversation_id) return;
      setConversationId(convId);
      setReceiverId(_receiverId);
    },
    [conversation_id]
  );

  const addToConversation = useCallback(
    (newConvs) => setConversations((prevConvs) => [...prevConvs, newConvs]),
    []
  );

  const handleMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const addChats = useCallback((newChats) => {
    setChat((prevChats) => [...prevChats, ...newChats]);
  }, []);

  /**
   * @param {{ userHandle: string; profileImage: string; senderId: string; }} user
   */
  const submitMessage = (user) => {
    if (message.length <= 0) return;

    const { userHandle, profileImage, senderId } = user;
    const time = new Date().toUTCString();
    const type = "image";

    socket.emit("send-message", {
      message,
      senderId,
      userHandle,
      profileImage,
      time,
      type,
      toId: receiverId,
      conversation_id: conversation_id,
      chatType: "private",
    });

    setMessage("");
  };

  return {
    message,
    handleMessage,
    submitMessage,
    chats,
    addChats,
    addToConversation,
    conversations,
    followers,
    conversation_id,
    handleConversationId,
  };
};
