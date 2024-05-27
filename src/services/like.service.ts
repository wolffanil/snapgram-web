import { getLikeUrl } from "../config/api.config";
import { ILike } from "../shared/types/like.interface";
import { request } from "./api/reguest.api";

export const LikeService = {
  async like(postId?: string, commentId?: string) {
    return request<ILike>({
      url: getLikeUrl(""),
      method: "POST",
      data: {
        postId,
        commentId,
      },
    });
  },

  async delete(likeId: string) {
    return request<{ status: string }>({
      url: getLikeUrl(`/${likeId}`),
      method: "DELETE",
    });
  },
};
