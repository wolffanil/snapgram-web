import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../shared/enums/queryKeys";
import { UserService } from "../services/user.service";
import { useMemo } from "react";

export const useGetUsers = () => {
  const { data: users, isPending: isUsersLoading } = useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => UserService.getUsers(),
    staleTime: 60 * 1000,
  });

  return useMemo(
    () => ({
      users,
      isUsersLoading,
    }),
    [users, isUsersLoading]
  );
};
