import { useMemo } from "react";
import { PhotoService } from "../services/photo.service";
import { folderPath } from "../shared/types/folderImage.type";

export const usePhoto = (folder: folderPath) => {
  const uploadPhoto = async (file: File[]) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file[0]);

    const { imageUrl } = await PhotoService.uploadPhoto(formData, folder);

    return imageUrl;
  };

  const deletePhoto = (name: string) => {
    if (!name) return;
    PhotoService.deletePhoto(name, folder);
    return { status: "seccuss" };
  };

  return useMemo(
    () => ({
      uploadPhoto,
      deletePhoto,
    }),
    [deletePhoto, uploadPhoto]
  );
};
