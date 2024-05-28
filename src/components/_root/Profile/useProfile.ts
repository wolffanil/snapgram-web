import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { QUERY_KEYS } from "../../../shared/enums/queryKeys";
import { UserService } from "../../../services/user.service";

export const useProfile = () => {
  const { id } = useParams();

  const { data: user, isPending: isLoadingUser } = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
    queryFn: () => UserService.getById(id || ""),
    staleTime: 1 * 60 * 1000,
    enabled: !!id,
  });

  return {
    user,
    isLoadingUser,
  };
};
