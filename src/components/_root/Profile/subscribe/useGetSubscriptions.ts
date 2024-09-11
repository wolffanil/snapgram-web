import { useAuth } from "@/hooks/useAuth";
import { SubscribeService } from "@/services/subscribe.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function useGetSubscriptions() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const { data: subscriptions, isPending: isLoadingSubscriptions } = useQuery({
    queryKey: [QUERY_KEYS.GET_SUBSCRIPTIONS_BY_USERID, id || user?._id],
    queryFn: () =>
      SubscribeService.getSubscriptions(id === user?._id ? "" : id),
    staleTime: 2 * 60 * 1000,
  });

  return {
    subscriptions,
    isLoadingSubscriptions,
  };
}
