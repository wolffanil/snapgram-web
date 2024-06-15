import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../shared/enums/queryKeys";
import { UserService } from "../services/user.service";
import { useMemo } from "react";
import { useAuth } from "./useAuth";

export const useGetUsers = () => {
  const { user } = useAuth();
  const { data: users, isPending: isUsersLoading } = useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => UserService.getUsers(),
    staleTime: 60 * 1000,
    select: (data) => data.filter((u) => u?._id !== user?._id).slice(0, 6),
  });

  return useMemo(
    () => ({
      users,
      isUsersLoading,
    }),
    [users, isUsersLoading]
  );
};
