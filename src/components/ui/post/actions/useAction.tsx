import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/post.service";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { usePhoto } from "@/hooks/usePhoto";
import { getErrorMessage } from "@/services/api/getErrorMessage";
import { IPost } from "@/shared/types/post.interface";
import { useMemo } from "react";

export const useAction = (post: IPost) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { loadingToast, successToast, errorToast } = useToast();

  const { deletePhoto } = usePhoto("post");

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationKey: ["delete post"],
    mutationFn: () => PostService.delete(post._id),
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries([QUERY_KEYS.GET_INFINITE_POSTS]);
      successToast("пост успешно удален");
      navigate("/");
    },
    onError: (error: string) => {
      errorToast(getErrorMessage(error));
    },
  });

  const handleDelete = () => {
    loadingToast("Удаление поста...");

    deletePhoto(post.imageUrl);
    deletePost();
  };

  return useMemo(
    () => ({
      handleDelete,
      isDeletingPost,
    }),
    [handleDelete, isDeletingPost]
  );
};
