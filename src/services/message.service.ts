import { getMessageUrl } from "../config/api.config";
import {
  IEditMessage,
  IMessage,
  ISendMessage,
} from "../shared/types/message.interface";
import { request } from "./api/reguest.api";

export const MessageService = {
  async getAll(chatId: string) {
    return request<IMessage[]>({
      url: getMessageUrl(`/${chatId}`),
      method: "GET",
    });
  },

  async create(data: ISendMessage) {
    return request<IMessage>({
      url: getMessageUrl(""),
      method: "POST",
      data,
    });
  },
};
