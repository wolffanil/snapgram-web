import { getChatUrl } from "../config/api.config";
import { IChat, IEditGroup } from "../shared/types/chat.interface";
import { request } from "./api/reguest.api";

export const ChatService = {
  async getAll() {
    return request<IChat[]>({
      url: getChatUrl(""),
      method: "GET",
    });
  },

  async create(userId: string) {
    return request<IChat>({
      url: getChatUrl(""),
      method: "POST",
      data: { userId },
    });
  },

  async createGroup(data: IEditGroup) {
    return request<IChat>({
      url: getChatUrl("/group"),
      method: "POST",
      data: {
        clients: JSON.stringify(data.users),
        name: data.chatName,
        background: data.background,
      },
    });
  },

  async addToGroup(chatId: string, userId: string) {
    return request<IChat>({
      url: getChatUrl("/groupadd"),
      method: "PATCH",
      data: { chatId, userId },
    });
  },

  async removeFromGroup(chatId: string, userId: string) {
    return request<IChat>({
      url: getChatUrl("/groupremove"),
      method: "PATCH",
      data: { chatId, userId },
    });
  },

  async changeDataGroup(data: IEditGroup) {
    return request<IChat>({
      url: getChatUrl(`/${data.chatId}`),
      method: "PATCH",
      data,
    });
  },
};
