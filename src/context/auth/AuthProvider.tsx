import { ReactNode, createContext, useEffect, useState } from "react";
import { IUser } from "../../shared/types/user.interface";
import { getAccessToken } from "../../services/auth/auth.helper";
import { getNewTokens } from "../../services/api/helper.api";
import {
  IContext,
  TypeChatState,
  TypeUserState,
} from "./auth-provider.interface";
import { IChat } from "../../shared/types/chat.interface";

export const AuthContext = createContext({} as IContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TypeUserState>({} as IUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [selectedChat, setSelectedChat] = useState<TypeChatState>({} as IChat);

  useEffect(() => {
    const checkAuthCheck = async () => {
      try {
        setIsLoading(true);
        const accessToken = getAccessToken();

        if (accessToken) {
          const userData = await getNewTokens();
          setUser(userData?.data?.userData || null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
