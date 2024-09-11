import { useEffect, useMemo, useState } from "react";
import { ILike } from "../shared/types/like.interface";
import { useAuth } from "./useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LikeService } from "../services/like.service";
import { QUERY_KEYS } from "../shared/enums/queryKeys";
import { useNotification } from "./useNotification";
import { IInfinityPosts, IPost } from "../shared/types/post.interface";

export const useLike = (
  id: string,
  likes: ILike[],
  creator: string,
  post?: IPost,
  type?: "post" | "comment"
) => {
  const { user } = useAuth();
  const [isLike, setIsLike] = useState(false);
  const [count, setCount] = useState<number>(likes?.length || 0);
  const { createNotification, removeNotification } = useNotification();

  const isComment = type === "comment";

  const { mutate: createLike, isPending: isCreatingLike } = useMutation({
    mutationKey: ["create like"],
    mutationFn: () =>
      LikeService.like(isComment ? undefined : id, isComment ? id : undefined),
    onSuccess: async () => {
      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_LIKED_POSTS]);

      // queryClient.setQueryData([QUERY_KEYS.GET_INFINITE_POSTS], (pages : IGetPosts[]) =>({

      // }) as IGetPosts)
      //@ts-ignore
      await queryClient.invalidateQueries([QUERY_KEYS.GET_INFINITE_POSTS]);

      //@ts-ignore

      await queryClient.invalidateQueries([QUERY_KEYS.GET_POST_BY_ID, id]);

      // if (type === "comment") {
      //   queryClient.setQueryData(
      //     [QUERY_KEYS.GET_POST_BY_ID, id],
      //     (oldP: IPost) => {
      //       const fixcomments = oldP.comments.map((c) =>
      //         c._id === id ? { ...c, likes: likes.push(user?._id) } : c
      //       );

      //       return {
      //         ...oldP,
      //         fixcomments,
      //       };
      //     }
      //   );
      // }

      if (!creator) return;
      if (creator === user?._id) return;

      //@ts-ignore
      createNotification({ postId: post || "", to: creator, type: "like" });
    },
  });

  const { mutate: deleteLike, isPending: isDeletingLike } = useMutation({
    mutationKey: ["delete like"],
    mutationFn: (likeId: string) => LikeService.delete(likeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIKED_POSTS],
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, id],
      });

      //@ts-ignore
      // await queryClient.invalidateQueries([QUERY_KEYS.GET_INFINITE_POSTS]);

      queryClient.setQueryData(
        [QUERY_KEYS.GET_INFINITE_POSTS],
        (oldData: IInfinityPosts) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((currentPost) =>
                currentPost._id === post?._id
                  ? {
                      ...currentPost,
                      likes: currentPost.likes.filter(
                        (like) => like?.userId !== user?._id
                      ),
                    }
                  : currentPost
              ),
            })),
          };
        }
      );

      if (creator === user?._id) return;
      //@ts-ignore
      removeNotification({ postId: post?._id, type: "like", to: creator });
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
