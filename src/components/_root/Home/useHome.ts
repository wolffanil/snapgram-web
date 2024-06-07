import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../shared/enums/queryKeys";
import { PostService } from "../../../services/post.service";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export const useHome = () => {
  const [ref, inView] = useInView();
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    error: isErrorPosts,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam = 1 }) => PostService.getAll({ pageParam }),
    getNextPageParam: (lastPage, _allPages) => {
      return lastPage.posts.length > 0 ? lastPage.page + 1 : null;
    },
    initialPageParam: 1,
    staleTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  return {
    posts,
    isErrorPosts,
    hasNextPage,
    ref,
  };
};
