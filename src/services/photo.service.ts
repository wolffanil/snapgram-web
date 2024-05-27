import { getPhotoUrl } from "../config/api.config";
import { folderPath } from "../shared/types/folderImage.type";
import { request } from "./api/reguest.api";

export const PhotoService = {
  async uploadPhoto(file: FormData, folder: folderPath) {
    return request<{ imageUrl: string }>({
      url: getPhotoUrl("/uploadPhoto"),
      method: "POST",
      data: file,
      params: { folder },
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async deletePhoto(name: string, folder: folderPath) {
    return request<{ status: string }>({
      url: getPhotoUrl(`/deletePhoto/${name}`),
      method: "DELETE",
      params: { folder },
    });
  },
};
