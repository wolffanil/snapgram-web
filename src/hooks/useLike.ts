import { useEffect, useMemo, useState } from "react";
import { ILike } from "../shared/types/like.interface";
import { useAuth } from "./useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LikeService } from "../services/like.service";
import { QUERY_KEYS } from "../shared/enums/queryKeys";
import { IGetPosts } from "../shared/types/post.interface";

export const useLike = (id: string, likes: ILike[]) => {
  const { user } = useAuth();
  const [isLike, setIsLike] = useState(false);
  const [count, setCount] = useState<number>(likes?.length || 0);

  const { mutate: createLike, isPending: isCreatingLike } = useMutation({
    mutationKey: ["create like"],
    mutationFn: () => LikeService.like(id),
    onSuccess: async () => {
      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_LIKED_POSTS]);

      // queryClient.setQueryData([QUERY_KEYS.GET_INFINITE_POSTS], (pages : IGetPosts[]) =>({

      // }) as IGetPosts)
      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_INFINITE_POSTS]);

      //@ts-ignore

      await queryClient.invalidateQueries([QUERY_KEYS.GET_POST_BY_ID, id]);
    },
  });

  const { mutate: deleteLike, isPending: isDeletingLike } = useMutation({
    mutationKey: ["delete like"],
    mutationFn: (likeId: string) => LikeService.delete(likeId),
    onSuccess: async () => {
      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_LIKED_POSTS]);

      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_POST_BY_ID, id]);

      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_INFINITE_POSTS]);
    },
  });
  useEffect(() => {
    if (isCreatingLike || isDeletingLike) return;

    if (!likes?.length) return setIsLike(false);

    //@ts-ignore
    const isHasLike = likes.some((l) => l?.userId === user?._id);
    setIsLike(isHasLike);
  }, [isLike, isCreatingLike, isDeletingLike]);

  const queryClient = useQueryClient();

  const onLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLike) {
      //@ts-ignore
      const like = likes.find((l) => l.userId === user?._id);
      if (!like) return;
      setIsLike(false);
      setCount((c) => c - 1);
      deleteLike(like._id);
    } else {
      setIsLike(true);
      setCount((c) => c + 1);

      createLike();
    }
  };

  return useMemo(
    () => ({
      onLike,
      isLike,
      count,
    }),
    [isLike, onLike]
  );
};
