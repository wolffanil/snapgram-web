import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchForm } from "../../../hooks/useSearchForm";
import { QUERY_KEYS } from "../../../shared/enums/queryKeys";
import { PostService } from "../../../services/post.service";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const useExplore = () => {
  const { control, debouncedValue, searchTerm } = useSearchForm();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !searchTerm) fetchNextPage();
  }, [inView, searchTerm]);

  const { data: searchPosts, isPending: isSearchingPosts } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, debouncedValue],
    queryFn: () => PostService.search(debouncedValue),
    enabled: !!debouncedValue,
  });

  const {
    hasNextPage,
    data: posts,
    fetchNextPage,
    isPending: isLoadingPosts,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam = 1 }) => PostService.getAll({ pageParam }),
    getNextPageParam: (lastPage, _allPages) => {
      return lastPage.hasMore ? lastPage.page + 1 : null;
    },
    initialPageParam: 1,
  });

  const shouldShowPosts =
    searchTerm && posts?.pages.every((item) => item?.posts?.length === 0);

  return {
    hasNextPage,
    isLoading: isLoadingPosts || isSearchingPosts,
    posts,
    searchPosts,
    shouldShowPosts,
    control,
    ref,
    searchTerm,
  };
};
