import { getNotificationUrl } from "../config/api.config";
import {
  ICreateNotificaion,
  IDeleteNotification,
  INotification,
} from "../shared/types/notification.interface";
import { request } from "./api/reguest.api";

export const NotificationService = {
  async getAll() {
    return request<INotification[]>({
      url: getNotificationUrl("/get-my"),
      method: "GET",
    });
  },

  async create(data: ICreateNotificaion) {
    return request<INotification>({
      url: getNotificationUrl(""),
      method: "POST",
      data,
    });
  },

  async deleteNotification(data: IDeleteNotification) {
    return request<{ status: string }>({
      url: getNotificationUrl(""),
      method: "DELETE",
      data,
    });
  },

  async setIsView() {
    return request<{ status: string }>({
      url: getNotificationUrl("/set-is-view"),
      method: "PATCH",
    });
  },
};
