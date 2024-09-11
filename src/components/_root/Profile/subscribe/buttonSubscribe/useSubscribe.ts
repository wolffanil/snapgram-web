import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { SubscribeService } from "@/services/subscribe.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { ISubscribe } from "@/shared/types/subscribe.interface";
import { create } from "mutative";
import { useAuth } from "@/hooks/useAuth";
import { IUser } from "@/shared/types/user.interface";
import { useMemo } from "react";

export function useSubscribe(action: "subscribe" | "unSubscribe") {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();

  const { mutate: subscribe, isPending: isLoadingSubscribe } = useMutation({
    mutationKey: ["subscribe"],
    mutationFn: () => SubscribeService.subscribe(id || ""),
    onSuccess() {
      const currentUser: IUser | undefined = queryClient.getQueryData([
        QUERY_KEYS.GET_USER_BY_ID,
        id,
      ]);

      queryClient.setQueryData(
        [QUERY_KEYS.GET_SUBSCRIBERS_BY_USERID, id],
        (subscribers: ISubscribe[]) => {
          if (!subscribers?.length)
            return [
              {
                userId: id,
                subscriberId: {
                  _id: user?._id,
                  name: user?.name || "user",
                  imageUrl: user?.imageUrl,
                },
              },
            ];

          return create(subscribers, (draft) => {
            draft.push({
              subscriberId: {
                _id: user?._id || "",
                name: user?.name || "user",
                imageUrl: user?.imageUrl || "",
              },
              userId: {
                _id: id || "",
                imageUrl: "",
                name: "",
              },
            });
          });
        }
      );

      queryClient.setQueryData(
        [QUERY_KEYS.GET_SUBSCRIPTIONS_BY_USERID, user?._id],
        (subscriptions: ISubscribe[]) => {
          if (!subscriptions?.length)
            return [
              {
                subscriberId: user?._id,
                userId: {
                  _id: id || "",
                  imageUrl: currentUser?.imageUrl || "",
                  name: currentUser?.name || "user",
                },
              },
            ];

          return create(subscriptions, (draft) => {
            draft.push({
              subscriberId: {
                _id: user?._id || "",
                name: user?.name || "user",
                imageUrl: user?.imageUrl || "",
              },
              userId: {
                _id: id || "",
                imageUrl: currentUser?.imageUrl || "",
                name: currentUser?.name || "user",
              },
            });
          });
        }
      );
    },
  });

  const { mutate: unSubscribe, isPending: isLoadingUnSubscribe } = useMutation({
    mutationKey: ["delete subscribe"],
    mutationFn: () => SubscribeService.deleteSubscribe(id || ""),
    onSuccess() {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_SUBSCRIBERS_BY_USERID, id],
        (subscribers: ISubscribe[]) => {
          if (!subscribers?.length) return [];
          return subscribers.filter(
            (sub) => sub.subscriberId._id !== user?._id
          );
        }
      );

      queryClient.setQueryData(
        [QUERY_KEYS.GET_SUBSCRIPTIONS_BY_USERID, user?._id],
        (subscriptions: ISubscribe[]) => {
          if (!subscriptions?.length) return [];

          return subscriptions.filter((sub) => sub.userId._id !== id);
        }
      );
    },
  });

  const actionButton = () =>
    action === "subscribe" ? subscribe() : unSubscribe();

  return useMemo(
    () => ({
      actionButton,
      isLoading: isLoadingSubscribe || isLoadingUnSubscribe,
    }),
    [actionButton, isLoadingSubscribe, isLoadingUnSubscribe]
  );
}
