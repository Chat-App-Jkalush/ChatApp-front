import { U } from '@angular/cdk/keycodes';

export const API_ENDPOINT = {
  BASE: 'http://localhost:3000',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    ADD_CONTACT: '/users/add-contact',
    PAGINATED_CHATS: '/users/paginated-chats',
  },
};
