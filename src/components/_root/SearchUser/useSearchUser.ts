import { useQuery } from "@tanstack/react-query";
import { useSearchForm } from "../../../hooks/useSearchForm";
import { QUERY_KEYS } from "../../../shared/enums/queryKeys";
import { UserService } from "../../../services/user.service";

export const useSearchUser = () => {
  const { searchTerm, debouncedValue, control } = useSearchForm();

  const { data: searchUsers, isPending: isSearchingUsers } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS, debouncedValue],
    queryFn: () => UserService.getUsers(debouncedValue),
    enabled: !!debouncedValue,
  });

  const { data: users, isPending: isLoadingUsers } = useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => UserService.getUsers(),
  });

  return {
    searchTerm,
    control,
    isLoading: isLoadingUsers || isSearchingUsers,
    users,
    searchUsers,
  };
};
