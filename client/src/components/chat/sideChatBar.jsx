// @ts-nocheck
import React, { Fragment, useCallback, useState, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import AvatarButton from "./avatarButton";
import ChatBubble from "./chatBubble";
import StartConversation from "./skeleton/startConversation.chat";
import { chatStyles } from "./styles/chat.style";
import { useSocketIO } from "../../hooks/useSocketIO";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  getChats,
  readChats,
  addChat,
  addFollowerToConversation,
} from "../../redux/actions/chatAction";
import { animateScroll } from "react-scroll";

import {
  Typography,
  Drawer,
  Toolbar,
  withStyles,
  List,
  ListItem,
  Divider,
  AppBar,
  Paper,
  InputBase,
  CircularProgress,
} from "@material-ui/core";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@material-ui/icons";
import MyButton from "../util/myButton";

const drawerWidth = 350;
const drawerPeak = 234 + 50;
const drawerPeakWidth = drawerWidth - drawerPeak;

const style = (theme) => ({
  ...chatStyles(theme, drawerWidth, drawerPeak, drawerPeakWidth),
});

export const Chat = React.memo((props) => {
  const {
    classes,
    id,
    user,
    storeConversations,
    className,
    authenticated,
    loading,
  } = props;
  const [open, setOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const inputRef = useRef(null);

  const scrollToBottom = () => {
    animateScroll.scrollToBottom(
      {
        containerId: "scrollComp",
        offset: 100000,
      },
      {
        offset: 10000,
        duration: 5000,
        delay: 500,
        smooth: true,
      }
    );
  };

  const handleOpen = useCallback(() => setOpen(!open), [open]);

  const {
    message,
    handleMessage,
    submitMessage,
    chats,
    conversations,
    followers,
    conversation_id,
    handleConversationId,
  } = useSocketIO(
    storeConversations,
    props.following,
    props.addChat,
    props.addFollowerToConversation,
    authenticated
  );

  const handleSetToId = useCallback(
    (convId, receiverId) => {
      setShowInput(true);

      props.readChats(convId);
      if (conversation_id === convId && conversation_id) {
        return;
      }
      props.getChats(convId);

      handleConversationId(convId, receiverId);
    },
    [conversation_id]
  );

  const forceOpen = useCallback(() => {
    setOpen(true);
    if (conversation_id) {
      scrollToBottom();
      inputRef.current.focus();
    }
  }, [conversation_id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    scrollToBottom();
    submitMessage({
      userHandle: user.handle,
      senderId: id,
      profileImage: user.profilePicture.url,
    });
  };

  return (
    <div className={clsx(classes.root, className)}>
      <Drawer
        anchor={"right"}
        variant="permanent"
        classes={{
          paper: clsx(
            {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            },
            classes.removeBorder,
            classes.drawer
          ),
        }}
      >
        <AppBar position="static" className={classes.appbar}>
          <Toolbar className={classes.tool}>
            <div className={classes.groupTL}>
              {authenticated ? (
                <MyButton
                  tip="Chat"
                  onClick={authenticated && handleOpen}
                  color="inherit"
                  aria-label="open chat drawer"
                  edge="start"
                  btnClassName={classes.padding18}
                >
                  <ChatIcon className={classes.icon} />
                </MyButton>
              ) : (
                <Link to={"/login"}>
                  <MyButton
                    tip="Chat"
                    onClick={authenticated && handleOpen}
                    color="inherit"
                    aria-label="open chat drawer"
                    edge="start"
                    btnClassName={classes.padding18}
                  >
                    <ChatIcon className={classes.icon} />
                  </MyButton>
                </Link>
              )}
              <Typography variant="body1" style={{ marginLeft: 7 }}>
                Chat yo homies
              </Typography>
            </div>
            <div>
              <MyButton
                tip="close chat"
                onClick={handleOpen}
                aria-label="Close chat drawer"
              >
                <CloseIcon className={classes.exitIcon} />
              </MyButton>
            </div>
          </Toolbar>
        </AppBar>
        <Paper elevation={1} square={false} className={classes.mediaRoot}>
          <div className={classes.friendList}>
            <div className={classes.railY}></div>
            <div className={classes.railX}>
              <div style={{ top: 0, height: 149 }}></div>
            </div>

            <List className={classes.iconList}>
              {conversations.map((conversation) => {
                return (
                  <ListItem
                    key={conversation.conversationId}
                    style={{ padding: 0 }}
                    onClick={() => forceOpen()}
                  >
                    <AvatarButton
                      profileImage={conversation.profileImage}
                      userHandle={conversation.userHandle}
                      conversation_id={conversation.conversationId}
                      receiverId={conversation.userId}
                      unReadMessages={conversation.unreadMessages}
                      onClick={handleSetToId}
                    />
                  </ListItem>
                );
              })}
              <Divider variant="middle" />
              {followers.map((follower, index) => {
                return (
                  <ListItem
                    key={index}
                    style={{ padding: 0 }}
                    onClick={() => forceOpen()}
                  >
                    <AvatarButton
                      profileImage={follower.profileImage}
                      userHandle={follower.userHandle}
                      conversation_id={follower.conversationId || ""}
                      receiverId={follower.userId}
                      unReadMessages={follower.unreadMessages}
                      onClick={handleSetToId}
                    />
                  </ListItem>
                );
              })}
            </List>
          </div>

          <Paper
            square={false}
            elevation={3}
            className={clsx(
              classes.chatWindow,
              loading && classes.centerSpinner
            )}
          >
            {showInput ? (
              <>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <div className={classes.chatWrapper} id="scrollComp">
                    {chats.map((chat, index) => {
                      {
                        /* let addTime = true;
                    let groupBubbles = false;

                    if (index > 0) {
                      const currChat = chats[index];
                      const oldChat = chats[index - 1];

                      if (
                        (oldChat.sender && currChat.sender) ||
                        (!oldChat.sender && !currChat.sender)
                      ) {
                        if (
                          chatSendMoreThan1MinApart(oldChat.time, currChat.time)
                        ) {
                          addTime = true;
                          groupBubbles = false;
                        } else {
                          addTime = false;

                          groupBubbles = !prevTime ? true : false;
                        }
                      }
                      if (groupBubbles && !prevTime) {
                        if (index !== chats.length - 1) {
                          const nextChat = chats[index + 1];
                          if (
                            chatSendMoreThan1MinApart(
                              currChat.time,
                              nextChat.time
                            )
                          ) {
                            addTime = true;
                          }
                        }
                      } else {
                        prevTime = addTime;
                      }

                      if (chats.length - 1 === index) addTime = true;
                    } else if (index < 1 && 1 < chats.length) {
                      const currChat = chats[index];
                      const nextChat = chats[index + 1];

                      if (
                        chatSendMoreThan1MinApart(currChat.time, nextChat.time)
                      ) {
                        addTime = true;
                      } else {
                        addTime = false;
                      }
                    } */
                      }

                      const addTime = true;

                      return (
                        <ChatBubble
                          key={index}
                          senderId={chat.senderId}
                          message={chat.message}
                          type={chat.type}
                          profileImage={chat.profileImage}
                          timeObj={{ time: chat.time, addTime }}
                          // groupBubbles={groupBubbles}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Text input */}
                <div className={classes.inputWrapper}>
                  <Paper elevation={1} className={classes.input}>
                    <form onSubmit={handleSubmit}>
                      <InputBase
                        autoFocus
                        inputRef={inputRef}
                        value={message}
                        onChange={handleMessage}
                        style={{
                          marginLeft: 20,
                          width: "100%",
                          fontSize: "small",
                          fontWeight: 400,
                          fontFamily:
                            "Muli,Roboto,Helvetica Neue,Arial,sans-serif",
                        }}
                        font="inherit"
                        placeholder="Send yo homie a message"
                        inputProps={{
                          "aria-label": "Send message to yo homie",
                        }}
                      />
                    </form>
                    <MyButton tip="send message" onClick={handleSubmit}>
                      <SendIcon color="inherit" />
                    </MyButton>
                  </Paper>
                </div>
              </>
            ) : (
              <StartConversation hasFollowers={followers.length === 0} />
            )}
          </Paper>
        </Paper>
      </Drawer>
    </div>
  );
});

Chat.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  loadingChats: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  following: PropTypes.array.isRequired,
  getChats: PropTypes.func.isRequired,
  addChat: PropTypes.func.isRequired,
  readChats: PropTypes.func.isRequired,
  addFollowerToConversation: PropTypes.func.isRequired,
  storeConversations: PropTypes.array.isRequired,
  authenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

const mapStateToProps = (state) => ({
  id: state.user._id,
  loadingChats: state.user.loading,
  user: state.user.userDetail.credentials,
  authenticated: state.user.authenticated,
  following: state.user.following,
  storeConversations: state.user.conversations,
  loading: state.user.loadingChat,
});

const mapActionsToProps = {
  getChats,
  readChats,
  addChat,
  addFollowerToConversation,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(style)(Chat));
