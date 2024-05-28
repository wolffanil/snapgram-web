import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../shared/enums/queryKeys";
import { UserService } from "../../../../services/user.service";

export const useGetLikedPosts = () => {
  const { data: posts, isPending: isLoadingPosts } = useQuery({
    queryKey: [QUERY_KEYS.GET_LIKED_POSTS],
    queryFn: () => UserService.getLiked(),
    staleTime: 1 * 60 * 1000,
  });

  return {
    posts,
    isLoadingPosts,
  };
};
