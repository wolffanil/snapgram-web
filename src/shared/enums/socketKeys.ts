export enum SOCKET_KEYS {
  //USER
  SETUP = "setup",
  ONLINE = "online",
  OFFLINE = "offline",
  SIGNIN = "signin",
  DELETEMYDEVICE = "deleteMyDevice",
  LEAVE_ROOM = "leaveRoom",
  DELETEDEVICE = "deleteDevice",
  SEND_SAY_HELLO = "sendSayHello",
  ACCEPT_SAY_HELLO = "acceptSayHello",
  UPDATE_PASSWORD = "updatePassword",

  // MESSAGE
  MESSAGE_RECIEVED = "message recieved",
  NEW_MESSAGE = "new message",
  READ_MESSAGES = "readMessages",
  STOP_TYPING = "stop typing",
  TYPING = "typing",
  ACTION_MESSAGE = "action message",

  /// NOTIFICATIONS

  SEND_NEW_NOTIFICATION = "sendNewNotification",
  SEND_REMOVE_NOTICATION = "sendRemoveNotification",
  GET_NEW_NOTIFICATION = "getNewNotification",
  REMOVE_NOTIFICATION = "removeNotification",

  // GROUP
  ADD_TO_GROUP = "addToGroup",
  CREATE_GROUP = "createGroup",
  REMOVE_FROM_GROUP = "removeFromGroup",
  NEW_USER_IN_GROUP = "newUserInGroup",
  DELETE_USER_IN_GROUP = "deleteUserInGroup",
  SCAN_QR = "scanQr",
}

export enum SOCKET_AUTH_KEYS {
  TRY_SIGN_IN = "trySignIn",
  RESET_PASSWORD = "resetPassword",
  TRY_SIGN_IN_YOUR_ACCOUNT = "trySignInYourAccount",
  DELETE_ROOM_QR = "deleteRoomQr",
  CREATE_ROOM_QR = "createRoomQr",
  GIVE_TOKEN_QR = "giveTokenQr",
}
