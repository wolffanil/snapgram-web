import axios from "axios";
import { IAuthResponse } from "../../shared/types/auth.interface,";
import { API_URL, getAuthUrl } from "../../config/api.config";
import { saveAccessToken } from "../auth/auth.helper";
import { getMyIp } from "./getMyIp";

export const getNewTokens = async () => {
  try {
    await new Promise((res) => setTimeout(res, 200));
    const ip = await getMyIp();
    const response = await axios.post<string, { data: IAuthResponse }>(
      API_URL + getAuthUrl("/refresh"),
      { ip },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.data.accessToken)
      saveAccessToken({ accessToken: response.data.accessToken });

    return response;
  } catch (error) {}
};
