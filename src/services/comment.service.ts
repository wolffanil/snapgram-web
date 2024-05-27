import { getCommentUrl, getPostUrl } from "../config/api.config";
import { IComment, IEditComment } from "../shared/types/comment.interface";
import { request } from "./api/reguest.api";

export const CommentService = {
  async getAll(postId: string) {
    return request<IComment[]>({
      url: getPostUrl(`/${postId}`) + getCommentUrl(""),
      method: "GET",
    });
  },

  async create(data: IEditComment) {
    return request<IComment>({
      url: getCommentUrl(""),
      method: "POST",
      data,
    });
  },

  async getById(commentId: string) {
    return request<IComment>({
      url: getCommentUrl(`/${commentId}`),
      method: "GET",
    });
  },
};
