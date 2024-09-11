import { IUser } from "./user.interface";

export interface ISubscribe {
  subscriberId: Pick<IUser, "_id" | "imageUrl" | "name">;
  userId: Pick<IUser, "_id" | "imageUrl" | "name">;
}
