import { useAuth } from "@/hooks/useAuth";
import { UserService } from "@/services/user.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";

import { useQuery } from "@tanstack/react-query";

export const useDevices = () => {
  const { sessionId } = useAuth();

  const { data: devices, isPending: isLoadingDevices } = useQuery({
    queryKey: [QUERY_KEYS.GET_MY_TOKENS],
    queryFn: () => UserService.getTokens(),
    staleTime: Infinity,
    select: (data) =>
      data.map((d) =>
        d._id === sessionId
          ? { ...d, isCorrentDevice: true }
          : { ...d, isCorrentDevice: false }
      ),
    refetchInterval: 1000 * 60 * 15,
  });

  return {
    devices,
    isLoadingDevices,
  };
};
