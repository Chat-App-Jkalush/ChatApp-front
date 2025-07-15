export const API_ENDPOINT = {
  BASE: 'http://localhost:3000',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    PAGINATED_CHATS: '/users/paginated-chats',
    UPDATE: '/users/update',
  },
  CONTACTS: {
    ADD: '/contacts/add',
    PAGINATED: '/contacts/paginated',
    REMOVE: '/contacts/remove',
  },
  CHATS: {
    PAGINATED: '/chats/paginated',
    UPDATE_USER_CHATS: '/chats/update-user-chats',
    ADD_USER_TO_CHAT: '/chats/add-user-to-chat',
    CREATE: '/chats',
    GET_BY_ID: '/chats/paginated',
    GET_PARTICIPANTS: '/chats/get-chat-participents',
  },
  DATA_COOKIE: {
    SAVE: '/data-cookie/save',
    GET: '/data-cookie/get',
    SET_LATEST_CHAT: '/data-cookie/set-latest-chat',
  },
};
