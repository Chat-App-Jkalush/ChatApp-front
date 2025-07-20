export namespace FrontendConstants {
  export namespace ApiEndpoint {
    export const BASE = 'http://localhost:3000';

    export const AUTH = {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
    } as const;

    export const USERS = {
      PAGINATED_CHATS: '/users/paginated-chats',
      UPDATE: '/users/update',
    } as const;

    export const CONTACTS = {
      ADD: '/contacts/add',
      PAGINATED: '/contacts/paginated',
      REMOVE: '/contacts/remove',
    } as const;

    export const CHATS = {
      PAGINATED: '/chats/paginated',
      UPDATE_USER_CHATS: '/chats/update-user-chats',
      ADD_USER_TO_CHAT: '/chats/add-user-to-chat',
      CREATE: '/chats',
      GET_BY_ID: '/chats/paginated',
      GET_PARTICIPANTS: '/chats/get-chat-participents',
      LEAVE_CHAT: '/chats/leave-chat',
      DM_EXISTS: '/chats/dm-exists',
      DELETE_DM: '/chats/delete-dm',
    } as const;

    export const DATA_COOKIE = {
      SAVE: '/data-cookie/save',
      GET: '/data-cookie/get',
      SET_LATEST_CHAT: '/data-cookie/set-latest-chat',
    } as const;
  }

  export namespace HttpHeaders {
    export const CONTENT_TYPE = 'Content-Type';
    export const AUTHORIZATION = 'Authorization';
    export const ACCEPT = 'Accept';
  }

  export namespace MimeTypes {
    export const JSON = 'application/json';
    export const TEXT = 'text/plain';
    export const HTML = 'text/html';
  }

  export namespace HttpStatus {
    export const OK = 200;
    export const CREATED = 201;
    export const BAD_REQUEST = 400;
    export const UNAUTHORIZED = 401;
    export const FORBIDDEN = 403;
    export const NOT_FOUND = 404;
    export const INTERNAL_SERVER_ERROR = 500;
  }
}
