import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { ISocketAuth } from "./socket-provider.interface";
import { io } from "socket.io-client";
import { SOCKET_AUTH_KEYS, SOCKET_KEYS } from "@/shared/enums/socketKeys";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/auth/auth.service";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/services/api/getErrorMessage";
import { IAuthResponse } from "@/shared/types/auth.interface,";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useScanQr } from "./useScanQr";

const SocketAuthContext = createContext({} as ISocketAuth);

let socket: any;
const ENPOINT = import.meta.env.VITE_SOCKET_URL;

const SocketAuthProvider = ({ children }: { children: ReactNode }) => {
  const { sendQrToken, isPending: isScaningQR } = useScanQr();

  useEffect(() => {
    socket = io(ENPOINT);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_AUTH_KEYS.GIVE_TOKEN_QR, (token: string) => {
      if (!token) return;
      sendQrToken(token, {
        onSuccess: async (data) => {
          handleSignIn(data.userData._id);
          await new Promise((res) => setTimeout(res, 1000));
        },
      });
    });
  }, []);

  const handleResetPasswordToSocket = useCallback((userId: string) => {
    socket.emit(SOCKET_AUTH_KEYS.RESET_PASSWORD, userId);
  }, []);

  const handleTrySignInToSocket = useCallback((email: string) => {
    if (!socket || !email) return;

    socket.emit(SOCKET_AUTH_KEYS.TRY_SIGN_IN, email);
  }, []);

  const handleSignIn = useCallback((userId: string) => {
    if (!socket) return;

    socket.emit(SOCKET_KEYS.SIGNIN, userId);
  }, []);

  const handleCreateRoomQr = useCallback((code: string) => {
    if (!socket) return;

    socket.emit(SOCKET_AUTH_KEYS.CREATE_ROOM_QR, code);
  }, []);

  const handleDeleteRoomQR = useCallback((code: string) => {
    if (!socket) return;

    socket.emit(SOCKET_AUTH_KEYS.DELETE_ROOM_QR, code);
  }, []);

  return (
    <SocketAuthContext.Provider
      value={{
        handleResetPasswordToSocket,
        handleTrySignInToSocket,
        handleSignIn,
        handleCreateRoomQr,
        handleDeleteRoomQR,
        isScaningQR,
      }}
    >
      {children}
    </SocketAuthContext.Provider>
  );
};

const useSocketAuth = () => {
  const context = useContext(SocketAuthContext);
  if (!context) throw new Error("socket auth was used outside provider");
  return context;
};

export { useSocketAuth };

export default SocketAuthProvider;
