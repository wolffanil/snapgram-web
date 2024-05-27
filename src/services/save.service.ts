import { getSaveUrl } from "../config/api.config";
import { ISave } from "../shared/types/save.interface";
import { request } from "./api/reguest.api";

export const SaveService = {
  async save(postId: string) {
    return request<ISave>({
      url: getSaveUrl(""),
      method: "POST",
      data: { postId },
    });
  },

  async delete(saveId: string) {
    return request<{ status: string }>({
      url: getSaveUrl(`/${saveId}`),
      method: "DELETE",
    });
  },

  async getAll() {
    return request<ISave[]>({
      url: getSaveUrl(""),
      method: "GET",
    });
  },
};
