export const DUMMY_CONV_ID = "123";

export /**
 * @param {any} oldUTCdate
 * @param {any} newUTCdate
 */
const chatSendMoreThan1MinApart = (oldUTCdate, newUTCdate) =>
  hmsToSeconds(newUTCdate) - hmsToSeconds(oldUTCdate) > 60;

export /**
 * @param {string} UTCdate
 */
const hmsToSeconds = (UTCdate) => {
  const timee = UTCdate.split(" ");

  const time = timee[4].split(":");

  return time[0] * 3600 + time[1] * 60 + (+time[2] || 0);
};

/**
 * @param {any[]} followersArr
 * @param {string} selectedUserId
 * @returns {object}
 */
export const getChatsFromConversations = (conversations, conversationId) => {
  const sortedConversations = conversations;

  sortedConversations.sort(sortConversations);

  const chats = [];

  sortedConversations.forEach((conversation) => {
    if (conversation.chats && conversationId === conversation.conversationId) {
      chats.push(...conversation.chats);
    }
  });

  return { sortedConversations, chats };
};

/**
 * @param {any[]} followers
 */
export const sortFollowing = (followers) => {
  const sortedFollowers = followers.filter((user) => !user.conversationId);

  return sortedFollowers;
};

function sortConversations(a, b) {
  // @ts-ignore
  return new Date(b.modified) - new Date(a.modified);
}
