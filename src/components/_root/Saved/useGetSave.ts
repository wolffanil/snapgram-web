import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../shared/enums/queryKeys";
import { SaveService } from "../../../services/save.service";

export const useGetSave = () => {
  const { data: saves, isPending: isLoadingSaves } = useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER_SAVES],
    queryFn: () => SaveService.getAll(),
    staleTime: 1 * 60 * 1000,
    select: (data) => data.map((item) => item.post),
  });

  return { saves, isLoadingSaves };
};
