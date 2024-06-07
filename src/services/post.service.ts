import { getGraphQlUrl, getPostUrl } from "../config/api.config";
import { IEditPost, IGetPosts, IPost } from "../shared/types/post.interface";
import { request } from "./api/reguest.api";
import { getAllPosts, getPostById } from "./graphql/query";

export const PostService = {
  // async getById(_id: string) {
  //   return request<IPost>({
  //     url: getPostUrl(`/${_id}`),
  //     method: "GET",
  //   });
  // },

  async getById(_id: string) {
    const post = await request<IPost>({
      url: getGraphQlUrl(),
      method: "POST",
      data: {
        query: getPostById,
        variables: {
          postId: _id,
        },
      },
    });

    //@ts-ignore
    return post.data.post;
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

  // async getAll({ pageParam = 1 }: { pageParam: number }) {
  //   return request<IGetPosts>({
  //     url: getPostUrl(""),
  //     method: "GET",
  //     params: {
  //       page: pageParam,
  //     },
  //   });
  // },

  async getAll({ pageParam = 1 }: { pageParam: number }) {
    const posts = await request<IGetPosts>({
      url: getGraphQlUrl(),
      method: "POST",

      data: {
        query: getAllPosts,
        variables: {
          page: pageParam,
        },
      },
    });
    //@ts-ignore
    return { ...posts.data, page: pageParam };
  },

  // async search(q: string) {
  //   return request<IPost[]>({
  //     url: getPostUrl("/search"),
  //     method: "GET",
  //     params: q ? { q } : {},
  //   });
  // },

  async search(q: string = "") {
    const posts = await request<IPost[]>({
      url: getGraphQlUrl(),
      method: "POST",
      data: {
        query: getAllPosts,
        variables: {
          q,
        },
      },
    });

    //@ts-ignore
    return posts.data.posts;
  },
};
