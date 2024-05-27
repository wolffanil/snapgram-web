import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../shared/enums/queryKeys";
import { PostService } from "../services/post.service";
import { useParams } from "react-router-dom";

export const useGetPostById = () => {
  const { id } = useParams();
  const { data: post, isPending: isPostLoading } = useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, id],
    queryFn: () => PostService.getById(id || ""),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });

  return { post, isPostLoading };
};
