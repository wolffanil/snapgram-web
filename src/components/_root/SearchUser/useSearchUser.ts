import { useQuery } from "@tanstack/react-query";
import { useSearchForm } from "../../../hooks/useSearchForm";
import { QUERY_KEYS } from "../../../shared/enums/queryKeys";
import { UserService } from "../../../services/user.service";
import { useAuth } from "../../../hooks/useAuth";

export const useSearchUser = () => {
  const { user } = useAuth();
  const { searchTerm, debouncedValue, control } = useSearchForm();

  const { data: searchUsers, isPending: isSearchingUsers } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS, debouncedValue],
    queryFn: () => UserService.getUsers(debouncedValue),
    enabled: !!debouncedValue,
    staleTime: 2 * 60 * 1000,
    select: (data) => data.filter((u) => u?._id !== user?._id),
  });

  const { data: users, isPending: isLoadingUsers } = useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => UserService.getUsers(),
    staleTime: 2 * 60 * 1000,

    select: (data) => data.filter((u) => u?._id !== user?._id),
  });

  return {
    searchTerm,
    control,
    isLoading: isLoadingUsers || isSearchingUsers,
    users,
    searchUsers,
  };
};
