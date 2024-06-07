import { IComment } from "./comment.interface";
import { ILike } from "./like.interface";
import { ISave } from "./save.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export interface IPost extends ITimestamps {
  _id: string;
  creator: IUser;
  caption: string;
  countRepost: number;
  tags: string[];
  location: string;
  imageUrl: string;
  likes: ILike[];
  saves: ISave[];
  comments: IComment[];
  commentsCount: number;
}

export interface IEditPost
  extends Omit<IPost, "_id" | "tags" | "likes" | "saves" | "comments"> {
  tags: string | string[];
  file: File[];
}

export interface IGetPosts {
  posts: IPost[];

  // hasMore: boolean;
  page: number;
}
