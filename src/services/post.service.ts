import { getPostUrl } from "../config/api.config";
import { IEditPost, IGetPosts, IPost } from "../shared/types/post.interface";
import { request } from "./api/reguest.api";

export const PostService = {
  async getById(_id: string) {
    return request<IPost>({
      url: getPostUrl(`/${_id}`),
      method: "GET",
    });
  },

  async update(_id: string, data: IEditPost) {
    return request<IPost>({
      url: getPostUrl(`/${_id}`),
      method: "PATCH",
      data,
    });
  },

  async create(data: IEditPost) {
    return request<IPost>({
      url: getPostUrl(""),
      method: "POST",
      data,
    });
  },

  async delete(_id: string) {
    return request<{ status: string }>({
      url: getPostUrl(`/${_id}`),
      method: "DELETE",
    });
  },

  async getAll({ pageParam = 1 }: { pageParam: number }) {
    return request<IGetPosts>({
      url: getPostUrl(""),
      method: "GET",
      params: {
        page: pageParam,
      },
    });
  },
};
