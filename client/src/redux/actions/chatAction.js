import {
  SEND_MESSAGE,
  GET_MESSAGES,
  SET_LOADING_CHAT,
  STOP_LOADING_CHAT,
  ADD_CHAT,
  ADD_CHAT_NOTIFICATION,
  READ_CHATS,
  ADD_CONVERSATION,
} from "../types";
import axios from "axios";

export const getChats = (conversation_id) => (dispatch) => {
  if (!conversation_id) {
    console.error("No conversation id was provided");
    return [];
  }

  console.log("called:**** ");
  dispatch({ type: SET_LOADING_CHAT });

  axios
    .get(`${process.env.REACT_APP_PROXY}/chat/private/${conversation_id}`)
    .then((response) => {
      dispatch({
        type: GET_MESSAGES,
        payload: { chats: response.data, conversation_id: conversation_id },
      });
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: STOP_LOADING_CHAT });
    });
};

export const addChatNotification = (notification, userId) => (dispatch) => {
  if (!notification) {
    console.error("No notification was provided");
    return;
  } else if (userId === notification.senderId) {
    return;
  }

  dispatch({ type: ADD_CHAT_NOTIFICATION, payload: notification });
};

export const addChat = (chat, conversationId) => (dispatch) => {
  if (!chat) {
    console.error("No conversation id or chat provided  ");
    return;
  }

  console.log("here: ", chat, conversationId);

  dispatch({ type: ADD_CHAT, payload: { chat, conversationId } });
};

export const readChats = (conversationId) => (dispatch) => {
  if (!conversationId) {
    console.error("no conversation id was provided");
    return;
  }

  axios
    .post(`${process.env.REACT_APP_PROXY}/chat/read`, {
      conversationId,
    })
    .then((response) => {
      dispatch({ type: READ_CHATS, payload: conversationId });
    })
    .catch((err) => {
      console.error("Error occured read chats notification: ", err);
    });
};

export const addFollowerToConversation = (conversation) => (dispatch) => {
  console.log("---co", conversation);
  dispatch({ type: ADD_CONVERSATION, payload: conversation });
};
