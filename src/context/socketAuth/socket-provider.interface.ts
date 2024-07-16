export interface ISocketAuth {
  handleResetPasswordToSocket: (userId: string) => void;
  handleTrySignInToSocket: (email: string) => void;
  handleSignIn: (userId: string) => void;
}
