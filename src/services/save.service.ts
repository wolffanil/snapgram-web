import { getGraphQlUrl, getSaveUrl } from "../config/api.config";
import { ISave } from "../shared/types/save.interface";
import { request } from "./api/reguest.api";
import { getMySaves } from "./graphql/query";

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
    const saves = await request<ISave[]>({
      url: getGraphQlUrl(),
      method: "POST",
      data: {
        query: getMySaves,
      },
    });

    //@ts-ignore
    return saves?.data?.getMySaves;
  },
};
