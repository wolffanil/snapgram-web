import { ILike } from "./like.interface";
import { IPost } from "./post.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export interface IComment extends ITimestamps {
  _id: string;
  postId?: IPost | string;
  author: IUser;
  parentId?: IComment | string;
  text: string;
  likes: ILike[];
}

export interface IEditComment
  extends Pick<IComment, "postId" | "parentId" | "text"> {}
