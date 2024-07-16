import { IChat } from "@/shared/types/chat.interface";
import { IUser } from "@/shared/types/user.interface";
import { Dispatch, SetStateAction } from "react";

export type TypeUserState = IUser | null;
export type TypeChatState = IChat | null;

export interface IContext {
  user: TypeUserState;
  setUser: Dispatch<SetStateAction<TypeUserState>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  selectedChat: TypeChatState;
  setSelectedChat: Dispatch<SetStateAction<TypeChatState>>;
  sessionId: string;
  setSessionId: Dispatch<SetStateAction<string>>;
  deleteUser: () => void;
}
