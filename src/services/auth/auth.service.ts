import { getAuthUrl } from "../../config/api.config";
import {
  IAuthResponse,
  ILogin,
  IRegister,
  IResetCode,
} from "../../shared/types/auth.interface,";
import { getMyIp } from "../api/getMyIp";
import { request } from "../api/reguest.api";
import { deleteAccessToken, saveAccessToken } from "./auth.helper";

export const AuthService = {
  async register(data: IRegister) {
    const ip = await getMyIp();

    let response = await request<IAuthResponse>({
      url: getAuthUrl("/register"),
      method: "POST",
      data: {
        ...data,
        ip,
      },
    });

    if (response.accessToken)
      saveAccessToken({ accessToken: response.accessToken });

    return response;
  },

  async login(data: ILogin) {
    const ip = await getMyIp();
    const response = await request<IAuthResponse>({
      url: getAuthUrl("/login"),
      method: "POST",
      data: {
        ...data,
        ip,
      },
    });

    if (response?.accessToken) {
      saveAccessToken({ accessToken: response.accessToken });
    }
    return response;
  },
  async resetCode(data: IResetCode) {
    await request({
      url: getAuthUrl("/reset-code"),
      method: "POST",
      data,
    });
  },

  async logout() {
    await request({
      url: getAuthUrl("/logout"),
      method: "POST",
    });
    deleteAccessToken();

    return;
  },
};
