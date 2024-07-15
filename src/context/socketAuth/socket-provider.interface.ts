export interface ISocketAuth {
  handleResetPasswordToSocket: (userId: string) => void;
  handleTrySignInToSocket: (email: string) => void;
}
