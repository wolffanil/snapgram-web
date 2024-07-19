import { IPost } from "./post.interface";
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
  extends Pick<IUser, "name" | "nick" | "bio" | "imageUrl" | "email"> {
  file: File[];
}

export interface IUserAndPosts extends IUser {
  posts: IPost[];
}

export interface IUpdatePassword {
  passwordCurrent: string;
  newPassword: string;
  sessionId: string;
}
