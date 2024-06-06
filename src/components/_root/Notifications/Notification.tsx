import { useNotification } from "../../../hooks/useNotification";
import { useTheme } from "../../../hooks/useTheme";
import { Loader } from "../../ui";
import NotificationItem from "./NotificationItem";

function Notification() {
  const { notifications, isLoadingNotifications } = useNotification();
  const { isDarkMode } = useTheme();

  if (isLoadingNotifications) {
    return <Loader />;
  }

  return (
    <section className="flex flex-1 flex-col mt-[78px] mx-[150px] gap-y-[58px] max-lg:mx-[42px] max-lg:mt-[49] max-lg:gap-y-[46px] max-sm:mx-[30px] max-sm:mt-[40px]">
      <div className="flex items-center gap-x-[11px]">
        <img
          src="/assets/icons/notification.svg"
          alt="notification"
          className={`${
            isDarkMode ? "invert-white" : "invert-black"
          } w-[30px] h-[30px] object-cover max-sm:w-[26px] max-sm:h-[26px]`}
        />
        <h2 className="text-[36px] text-main-color font-bold max-sm:text-[24px]">
          Уведомление
        </h2>
      </div>
      <div className="flex w-full flex-col items-start justify-start max-h-full custom-scrollbar-without overflow-y-scroll">
        {!notifications?.length ? (
          <div className="flex-center text-main-color text-[20px]">
            Нету уведомлений
          </div>
        ) : (
          notifications.map((n, i) => (
            <NotificationItem key={i} notificaion={n} />
          ))
        )}
      </div>
    </section>
  );
}

export default Notification;
