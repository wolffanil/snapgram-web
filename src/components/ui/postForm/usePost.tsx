import { UseFormReset, UseFormSetError } from "react-hook-form";
import { IEditPost, IPost } from "../../../shared/types/post.interface";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "../../../services/post.service";
import { useToast } from "../../../hooks/useToast";
import { QUERY_KEYS } from "../../../shared/enums/queryKeys";
import { getErrorMessage } from "../../../services/api/getErrorMessage";
import { useMemo } from "react";
import { usePhoto } from "../../../hooks/usePhoto";

export const usePost = (
  action: "Create" | "Update",
  reset: UseFormReset<IEditPost>,
  setError: UseFormSetError<IEditPost>,
  _id?: string
) => {
  const { loadingToast, errorToast, successToast } = useToast();
  const navigate = useNavigate();
  const { uploadPhoto, deletePhoto } = usePhoto("post");

  const queryClient = useQueryClient();

  const { mutate: updatePost, isPending: isUpdatingPost } = useMutation({
    mutationKey: ["edit post"],
    mutationFn: (data: IEditPost) => PostService.update(_id || "", data),
    onSuccess: (post) => {
      reset();
      successToast("Пост успешно обновлён");
      queryClient.setQueryData(
        [QUERY_KEYS.GET_POST_BY_ID, _id],
        (oldPost: IPost) =>
          ({
            ...oldPost,
            tags: post.tags,
            imageUrl: post.imageUrl,
            caption: post.caption,
            location: post.location,
            updatedAt: post.updatedAt,
          } as IPost)
      );
      navigate(`/posts/${_id}`);
    },
    onError: (error: string) => {
      errorToast(getErrorMessage(error));
    },
  });

  const { mutate: createPost, isPending: isCreatingPost } = useMutation({
    mutationKey: ["create post"],
    mutationFn: (data: IEditPost) => PostService.create(data),
    onSuccess: (post) => {
      reset();
      successToast("Пост успешно создан");
      navigate(`/posts/${post._id}`);
    },
  });

  const onSubmit = async (data: IEditPost & { file: File[] }) => {
    if (data?.file.length < 1 && action === "Create") {
      setError("file", { message: "Фото обязательны" });
      return;
    }
    loadingToast("Загрузка...");

    //@ts-ignore
    const tags = data.tags?.replace(/ /g, "").split(",") || [];

    if (action === "Create") {
      const imageUrl = await uploadPhoto(data.file);
      if (!imageUrl) return errorToast("Что-то пошло не так!");
      createPost({ ...data, imageUrl, tags });
    } else if (action === "Update") {
      if (!_id) return;

      const hasFileToUpdate = data.file.length > 0;

      let imageUrl = data.imageUrl;

      if (hasFileToUpdate) {
        imageUrl = await uploadPhoto(data.file);

        if (!imageUrl) {
          errorToast("Что-то пошло не так");
          return;
        }

        // deletePhoto(imageUrl);
      }
      updatePost({ ...data, imageUrl, tags });
    } else return;
  };

  return useMemo(
    () => ({
      onSubmit,
      isLoading: isCreatingPost || isUpdatingPost,
    }),
    [isCreatingPost, isUpdatingPost, onSubmit]
  );
};
