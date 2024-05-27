import { getUserUrl } from "../config/api.config";
import { IUser } from "../shared/types/user.interface";
import { request } from "./api/reguest.api";

export const UserService = {
  async getUsers(searchTerm?: string) {
    return request<IUser[]>({
      url: getUserUrl(""),
      method: "GET",
      params: searchTerm
        ? {
            searchTerm,
          }
        : {},
    });
  },
};
