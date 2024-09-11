import { useAuth } from "@/hooks/useAuth";
import { useGetSubscribers } from "../useGetSubscribers";
import { useSubscribe } from "./useSubscribe";

function ButtonSubscribe() {
  const { user } = useAuth();

  const { subscribers, isLoadingSubscribers } = useGetSubscribers();

  let action: "subscribe" | "unSubscribe";

  if (
    subscribers &&
    subscribers.some((sub) => sub.subscriberId?._id === user?._id)
  ) {
    action = "unSubscribe";
  } else {
    action = "subscribe";
  }

  const { actionButton, isLoading } = useSubscribe(action);

  return (
    <button
      className="h-[37px] blue-color text-white text-[14px] px-[42px]  flex-center gap-2 rounded-lg"
      onClick={actionButton}
      disabled={isLoadingSubscribers || isLoading}
    >
      {action === "subscribe" ? "Подписаться" : "Отписаться"}
    </button>
  );
}

export default ButtonSubscribe;
