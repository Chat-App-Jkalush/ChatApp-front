export const API_ENDPOINT = {
  BASE: 'http://localhost:3000',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    PAGINATED_CHATS: '/users/paginated-chats',
  },
  CONTACTS: {
    ADD: '/contacts/add',
    PAGINATED: '/contacts/paginated',
  },
  CHATS: {
    PAGINATED: '/chats/paginated',
    UPDATE_USER_CHATS: '/chats/update-user-chats',
    ADD_USER_TO_CHAT: '/chats/add-user-to-chat',
    CREATE: '/chats',
  },
};
