import { ITimestamps } from "./timestamps.interface";

export interface IUser extends ITimestamps {
  _id: string;
  name: string;
  nick?: string;
  email: string;
  imageUrl: string;
  bio?: string;
  isOnline: boolean;
}

export interface IEditUser
  extends Pick<IUser, "name" | "nick" | "bio" | "imageUrl"> {}
