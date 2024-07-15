import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { ISocketAuth } from "./socket-provider.interface";
import { io } from "socket.io-client";

const SocketAuthContext = createContext({} as ISocketAuth);

let socket: string;
const ENPOINT = import.meta.env.VITE_SOCKET_URL;

const SocketAuthProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    socket = io(ENPOINT);
  }, []);

  const handleResetPasswordToSocket = useCallback((userId: string) => {
    console.log(userId, "IDUSER");
  }, []);

  const handleTrySignInToSocket = useCallback((email: string) => {}, []);

  return (
    <SocketAuthContext.Provider
      value={{
        handleResetPasswordToSocket,
        handleTrySignInToSocket,
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
