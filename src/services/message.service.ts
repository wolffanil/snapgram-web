import { getMessageUrl } from "../config/api.config";
import {
  IDeleteMessage,
  IEditMessage,
  IMessage,
  ISendMessage,
  IUpdateMessage,
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

  async delete(messageId: string, data: IDeleteMessage) {
    return request({
      url: getMessageUrl(`/${messageId}`),
      method: "DELETE",
      data,
    });
  },

  async edit(messageId: string, data: IUpdateMessage) {
    return request({
      url: getMessageUrl(`/${messageId}`),
      method: "PATCH",
      data,
    });
  },
};
