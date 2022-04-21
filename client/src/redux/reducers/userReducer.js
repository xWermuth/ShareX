import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  MARK_NOTIFICATIONS_READ,
  FOLLOW_USER,
  UNFOLLOW_USER,
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
  REMOVE_NOTIFICATION,
  GET_MESSAGES,
  GET_MESSAGES_GROUP,
  SET_LOADING_CHAT,
  STOP_LOADING_CHAT,
  ADD_CHAT_NOTIFICATION,
  READ_CHATS,
  ADD_CHAT,
  ADD_CONVERSATION,
} from "../types";

const initialState = {
  _id: "",
  authenticated: false,
  loading: false,
  loadingChat: false,
  userDetail: {
    credentials: { profilePicture: {}, userInfo: {}, likes: [] },
  },
  notifications: [],

  following: [
    // {
    //   unreadMessages: 0,
    //   conversationId: "",
    //   profileImage: "",
    //   userHandle: "",
    //   userId: "",
    //   conversationModified: 0,
    //   chats: [],
    // },
  ],
  bookmarks: [],
  conversations: [
    // {
    //   name: "",
    //   conversationId: "",
    //   chats: [],
    //   type: "",
    //   unreadMessages: 0,
    //   conversationModified: 0,
    // },
  ],
  numberOfUnreadNotifications: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, authenticated: true };

    case SET_UNAUTHENTICATED:
      return initialState;

    case SET_USER:
      console.log("PAYLOAD: ", action.payload);
      return {
        ...state,
        authenticated: true,
        ...action.payload,
        loading: false,
      };

    case LOADING_USER:
      return { ...state, loading: true };

    case SET_LOADING_CHAT:
      return { ...state, chatLoading: true };

    case STOP_LOADING_CHAT:
      return { ...state, chatLoading: false };

    case LIKE_SCREAM:
      return {
        ...state,
        userDetail: {
          credentials: {
            ...state.userDetail.credentials,
            likes: [
              ...state.userDetail.credentials.likes,
              {
                userHandle: state.userDetail.credentials.handle,
                screamId: action.payload.like.screamId,
              },
            ],
          },
        },
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        userDetail: {
          credentials: {
            ...state.userDetail.credentials,
            likes: state.userDetail.credentials.likes.filter(
              (like) => like.screamId !== action.payload.like.screamId
            ),
          },
        },
      };

    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      return { ...state, numberOfUnreadNotifications: 0 };

    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.notificationId !== action.payload
        ),
      };

    case FOLLOW_USER:
      return {
        ...state,
        following: [...state.following, action.payload.following],
        userDetail: {
          credentials: {
            ...state.userDetail.credentials,
            followingCount: action.payload.followingCount,
          },
        },
        loading: false,
      };

    case UNFOLLOW_USER:
      return {
        ...state,
        following: state.following.filter(
          (follower) => follower.userHandle !== action.payload.following
        ),
        userDetail: {
          credentials: {
            ...state.userDetail.credentials,
            followingCount: action.payload.followingCount,
          },
        },
        loading: false,
      };

    case ADD_BOOKMARK:
      return {
        ...state,
        bookmarks: [
          ...state.bookmarks,
          {
            screamId: action.payload.screamId,
            screamHandle: action.payload.screamHandle,
            url: action.payload.url,
          },
        ],
        loading: false,
      };

    case REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.filter(
          (id) => id.screamId !== action.payload
        ),
        loading: false,
      };

    case GET_MESSAGES_GROUP:
      return {
        ...state,
        loadingChat: false,
        chats: [
          ...state.chats,
          {
            conversation_id: action.payload.conversation_id,
            name: action.payload.name,
            chats: action.payload.chats,
          },
        ],
      };

    case GET_MESSAGES:
      const indexHit = state.conversations.findIndex(
        (ele) => ele.conversationId === action.payload.conversation_id
      );

      const updatedConversations = state.conversations;

      if (indexHit >= 0) {
        updatedConversations[indexHit].chats = action.payload.chats;
      }

      return {
        ...state,
        conversations: [...updatedConversations],
        loadingChat: false,
      };

    case ADD_CHAT_NOTIFICATION:
      const conv_index = state.conversations.findIndex(
        (ele) => ele.conversationId === action.payload.conversationId
      );

      const updatedArr = state.conversations;
      const updatedFollowArr = state.following;

      if (conv_index < 0) {
        updatedArr.push(action.payload);

        const userIndex = updatedFollowArr.findIndex(
          (user) => user.userHandle === action.payload.userHandle
        );

        if (userIndex > -1) {
          updatedFollowArr[userIndex].conversationId =
            action.payload.conversationId;
        }
      } else {
        updatedArr[conv_index].unreadMessages = action.payload.unreadMessages;

        updatedArr[conv_index].conversationId = action.payload.conversationId;
        updatedArr[conv_index].modified = Date.now();
      }

      return {
        ...state,
        conversations: [...updatedArr],
        following: [...updatedFollowArr],
      };

    case ADD_CHAT:
      const chatIndex = state.conversations.findIndex(
        (ele) => ele.conversationId === action.payload.conversationId
      );

      const newArr = state.conversations;

      console.log("******, ", chatIndex, action.payload);
      if (chatIndex > -1) {
        newArr[chatIndex].chats
          ? newArr[chatIndex].chats.push(action.payload.chat)
          : (newArr[chatIndex].chats = [action.payload.chat]);

        newArr[chatIndex].modified = Date.now();

        newArr[chatIndex].conversationId = action.payload.conversationId;
      }

      return { ...state, conversations: [...newArr] };

    case ADD_CONVERSATION:
      const convIndex =
        action.payload.chatType === "private"
          ? state.following.findIndex(
              (user) => user.userHandle === action.payload.userHandle
            )
          : -1;

      const following = state.following;

      if (convIndex > -1) {
        following[convIndex].conversationId = action.payload.conversationId;
      }

      return {
        ...state,
        conversations: [...state.conversations, action.payload],
        following: [...following],
      };

    case READ_CHATS:
      const conversationIndex = state.conversations.findIndex(
        (ele) => ele.conversationId === action.payload
      );

      const newFollowingArr = state.conversations;

      newFollowingArr[conversationIndex].unreadMessages = 0;
      return { ...state, conversations: [...newFollowingArr] };

    default:
      return state;
  }
}
