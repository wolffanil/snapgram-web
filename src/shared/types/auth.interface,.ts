import { IUser } from "./user.interface";

export enum EnumLocalStorage {
  ACCESS_TOKEN = "accessToken",
}

export interface ITokens {
  accessToken: string;
}

export interface IAuthResponse extends ITokens {
  userData: IUser;
  session: {
    id: string;
  };
}

export interface IRegister extends Pick<IUser, "name" | "email"> {
  password: string;
  code?: string;
}

export interface ILogin extends Pick<IUser, "email"> {
  password: string;
  code?: string;
}

export interface IResetCode extends Pick<IUser, "email"> {
  password: string;
}
