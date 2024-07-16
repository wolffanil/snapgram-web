import { ReactNode, createContext, useEffect, useState } from "react";
import {
  IContext,
  TypeChatState,
  TypeUserState,
} from "./auth-provider.interface";
import { IUser } from "@/shared/types/user.interface";
import { IChat } from "@/shared/types/chat.interface";
import { getAccessToken } from "../../services/auth/auth.helper";
import { getNewTokens } from "../../services/api/helper.api";
import { EnumLocalStorage } from "@/shared/types/auth.interface,";

export const AuthContext = createContext({} as IContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TypeUserState>({} as IUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [selectedChat, setSelectedChat] = useState<TypeChatState>({} as IChat);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const checkAuthCheck = async () => {
      try {
        setIsLoading(true);
        const accessToken = getAccessToken();

        if (accessToken) {
          const userData = await getNewTokens();
          setUser(userData?.data?.userData || null);
          setSessionId(userData?.data?.session?.id || "");
          setIsAuth(true);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuth) return;

    checkAuthCheck();
  }, []);

  const deleteUser = () => {
    setUser(null);
    setSelectedChat(null);
    setSessionId("");
    setIsAuth(false);
    localStorage.removeItem(EnumLocalStorage.ACCESS_TOKEN);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        isAuth,
        setIsAuth,
        selectedChat,
        setSelectedChat,
        setSessionId,
        sessionId,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
