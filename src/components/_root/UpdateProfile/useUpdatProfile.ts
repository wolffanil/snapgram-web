import { SubmitHandler, UseFormReset, UseFormSetValue } from "react-hook-form";
import { IEditUser, IUser } from "../../../shared/types/user.interface";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePhoto } from "../../../hooks/usePhoto";
import { useToast } from "../../../hooks/useToast";
import { UserService } from "../../../services/user.service";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../services/api/getErrorMessage";
import { QUERY_KEYS } from "../../../shared/enums/queryKeys";

export const useUpdateProfile = (
  setValue: UseFormSetValue<IEditUser>,
  reset: UseFormReset<IEditUser>
) => {
  const { user, setUser } = useAuth();
  const { loadingToast, errorToast, successToast } = useToast();
  const navigate = useNavigate();

  const { uploadPhoto, deletePhoto } = usePhoto("profile");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;
    console.log(user, "USEr");
    setValue("name", user?.name);
    setValue("nick", user?.nick ? user.nick : "");
    setValue("bio", user?.bio ? user.bio : "");
    setValue("email", user.email);
    setValue("file", []);
  }, [user]);

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationKey: ["update profile"],
      mutationFn: (data: IEditUser) => UserService.update(data),
      onError: (error: string) => {
        errorToast(getErrorMessage(error));
      },
      onSuccess: (data) => {
        successToast("Профиль обновлённ");
        queryClient.setQueryData(
          [QUERY_KEYS.GET_USER_BY_ID, user?._id],
          (oldUser: IUser) =>
            ({
              ...oldUser,
              ...data,
            } as IUser)
        );
        setUser(data);
      },
    });

  const onSubmit: SubmitHandler<IEditUser> = async (data) => {
    loadingToast("Обновление...");

    const hasFileToUpdate = data?.file?.length > 0;

    let imageUrl = data.imageUrl;

    if (hasFileToUpdate) {
      imageUrl = (await uploadPhoto(data.file)) || "";

      if (!imageUrl) {
        errorToast("Что-то пошло нет так");
        return;
      }

      //   try {
      //     if (imageUrl.split("/").includes("default.svg")) return imageUrl;
      //     deletePhoto(imageUrl);
      //   } catch (error) {}
    }

    const updatedUser = await updateProfile({ ...data, imageUrl });
    if (!updatedUser) return;
    reset();

    navigate(`/profile/${user?._id}`);
  };

  return useMemo(
    () => ({
      isUpdatingProfile,
      onSubmit,
    }),
    [isUpdatingProfile, onSubmit]
  );
};
