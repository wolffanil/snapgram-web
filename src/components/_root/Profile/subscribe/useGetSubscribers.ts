import { useAuth } from "@/hooks/useAuth";
import { SubscribeService } from "@/services/subscribe.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function useGetSubscribers() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const { data: subscribers, isPending: isLoadingSubscribers } = useQuery({
    queryKey: [QUERY_KEYS.GET_SUBSCRIBERS_BY_USERID, id || user?._id],
    queryFn: () => SubscribeService.getSubscribers(id),
    staleTime: 2 * 60 * 1000,
  });

  return {
    subscribers,
    isLoadingSubscribers,
  };
}
