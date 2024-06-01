import { Dispatch, SetStateAction } from "react";
import { IUser } from "../../shared/types/user.interface";
import { IChat } from "../../shared/types/chat.interface";

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
}
