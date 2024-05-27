import { EnumLocalStorage, ITokens } from "../../shared/types/auth.interface,";

export const getAccessToken = () => {
  const accessToken = localStorage.getItem(EnumLocalStorage.ACCESS_TOKEN);

  return accessToken || null;
};

export const saveAccessToken = (data: ITokens) => {
  localStorage.setItem(EnumLocalStorage.ACCESS_TOKEN, data.accessToken);
};

export const deleteAccessToken = () => {
  localStorage.removeItem(EnumLocalStorage.ACCESS_TOKEN);
};
