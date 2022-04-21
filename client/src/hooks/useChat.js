import { useState, useCallback } from "react";
import PropTypes from "prop-types";

export const useChat = (dispatch) => {
  const [chats, setChats] = useState([]);

  const handleChats = useCallback((conversation_id) => {
    const newChats = dispatch(conversation_id);

    setChats((prevChats) => [...prevChats, newChats]);
  }, []);

  return { handleChats, chats };
};

useChat.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
