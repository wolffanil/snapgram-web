import { IUser } from "./user.interface";

export enum EnumLocalStorage {
  ACCESS_TOKEN = "accessToken",
}

export interface ITokens {
  accessToken: string;
}

export interface IAuthResponse extends ITokens {
  userData: IUser;
}

export interface IRegister extends Pick<IUser, "name" | "email"> {
  password: string;
}

export interface ILogin extends Pick<IUser, "email"> {
  password: string;
}
