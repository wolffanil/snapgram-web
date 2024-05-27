export const SERVEL_URL = import.meta.env.VITE_SERVER_URL;
export const API_URL = `${SERVEL_URL}/api/v1`;

export const getAuthUrl = (string: string) => `/auth${string}`;
export const getPostUrl = (string: string) => `/posts${string}`;
export const getSaveUrl = (string: string) => `/saves${string}`;
export const getLikeUrl = (string: string) => `/likes${string}`;
export const getCommentUrl = (string: string) => `/comments${string}`;
export const getPhotoUrl = (string: string) => `/photo${string}`;
export const getUserUrl = (string: string) => `/users${string}`;
export const getChatUrl = (string: string) => `/chats${string}`;
export const getMessageUrl = (string: string) => `/messages${string}`;
export const getNotificationUrl = (string: string) => `/notificatins${string}`;
