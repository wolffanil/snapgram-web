import { getUserUrl } from "../config/api.config";
import { IPost } from "../shared/types/post.interface";
import {
  IEditUser,
  IUser,
  IUserAndPosts,
} from "../shared/types/user.interface";
import { request } from "./api/reguest.api";

export const UserService = {
  async getUsers(searchTerm?: string) {
    return request<IUser[]>({
      url: getUserUrl(""),
      method: "GET",
      params: searchTerm
        ? {
            q: searchTerm,
          }
        : {},
    });
  },

  async getLiked() {
    return request<IPost[]>({
      url: getUserUrl("/liked-posts"),
      method: "GET",
    });
  },

  async getById(userId: string) {
    return request<IUserAndPosts>({
      url: getUserUrl(`/${userId}`),
      method: "GET",
    });
  },

  async update(data: IEditUser) {
    return request<IUser>({
      url: getUserUrl("/update-profile"),
      method: "PATCH",
      data,
    });
  },
};
