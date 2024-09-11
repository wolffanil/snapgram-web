import { useGetSubscribers } from "./useGetSubscribers";
import { useGetSubscriptions } from "./useGetSubscriptions";
import SkeletonSubscribe from "./SkeletonSubscribe";
import StatBlock from "../StackBlock";
import { Modal, WrapperModal } from "@/components/ui";
import UserModalSub from "./modal/UserModalSub";

function Subscribers() {
  const { subscribers, isLoadingSubscribers } = useGetSubscribers();

  const { subscriptions, isLoadingSubscriptions } = useGetSubscriptions();

  const subscribersCount =
    subscribers && subscribers.length > 0
      ? subscribers?.length > 99
        ? "999+"
        : subscribers?.length
      : "0";

  const subscriptionsCount =
    subscriptions && subscriptions.length > 0
      ? subscriptions?.length > 99
        ? "999+"
        : subscriptions?.length
      : "0";

  return (
    <>
      {isLoadingSubscribers ? (
        <SkeletonSubscribe />
      ) : (
        <Modal>
          <Modal.Open opens="subscribers">
            <StatBlock value={subscribersCount} label="Подписчики" />
          </Modal.Open>
          <Modal.Window name="subscribers">
            <WrapperModal
              title={`Подписчики (${subscribersCount})`}
              containerStyle="w-[480px] !max-h-[400px] !max-sm:max-h-[275px]"
            >
              <UserModalSub
                users={subscribers?.map((sub) => sub.subscriberId)}
                key="subscribers"
              />
            </WrapperModal>
          </Modal.Window>
        </Modal>
      )}

      {isLoadingSubscriptions ? (
        <SkeletonSubscribe />
      ) : (
        <Modal>
          <Modal.Open opens="subscriptions">
            <StatBlock value={subscriptionsCount} label="Подписки" />
          </Modal.Open>
          <Modal.Window name="subscriptions">
            <WrapperModal
              title={`Подписки (${subscriptionsCount})`}
              containerStyle="w-[480px]"
            >
              <UserModalSub
                users={subscriptions?.map((sub) => sub.userId)}
                key="subscriptions"
              />
            </WrapperModal>
          </Modal.Window>
        </Modal>
      )}
    </>
  );
}

export default Subscribers;
