import { ISubscribe } from "@/shared/types/subscribe.interface";
import { request } from "./api/reguest.api";
import { getSubscribeUrl } from "@/config/api.config";

export const SubscribeService = {
  async getSubscribers(userId?: string) {
    return request<ISubscribe[]>({
      url: getSubscribeUrl(`/get-subscribers`),
      method: "GET",
      params: {
        userId: userId ? userId : "",
      },
    });
  },

  async getSubscriptions(userId?: string) {
    return request<ISubscribe[]>({
      url: getSubscribeUrl(`/get-subscriptions`),
      method: "GET",
      params: {
        userId: userId ? userId : "",
      },
    });
  },

  async subscribe(userId: string) {
    return request<ISubscribe>({
      url: getSubscribeUrl("/"),
      method: "POST",
      data: {
        userId,
      },
    });
  },

  async deleteSubscribe(userId: string) {
    return request<ISubscribe>({
      url: getSubscribeUrl("/"),
      method: "DELETE",
      data: {
        userId,
      },
    });
  },
};
