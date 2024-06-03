import { Link } from "react-router-dom";
import { INotification } from "../../../shared/types/notification.interface";
import { getMedia, multiFormatDateString } from "../../../utils";

const typeNotification = {
  like: "/assets/icons/like.svg | лайкнул твой пост",
  comment: "/assets/icons/comment.svg | прокомментировал твой пост",
  save: "/assets/icons/save.svg | сохранил твой пост",
  repost: "/assets/icons/repost.svg | поделился твоим постом",
};

function NotificationItem({ notificaion }: { notificaion: INotification }) {
  const typeN = typeNotification[notificaion.type];
  const iconUrl = typeN.split(" | ")[0];
  const message = typeN.split(" | ")[1];

  return (
    <li className="flex items-center gap-x-[40px] h-[110px] w-full pl-[20px] pt-[20px] pb-[30px] max-sm:flex-row-reverse max-sm:pr-[13px] max-sm:gap-x-[10px] border-b border-main-color max-sm:pb-[9px] max-sm:pt-[9px] max-sm:h-[74px]">
      <div className="w-[36px] h-[36px] rounded-[51px] max-sm:min-w-[34px] max-sm:min-h-[30px] bg-light-2 dark:bg-dark-4 flex-center">
        <img src={iconUrl} alt="icon" />
      </div>
      <div className="flex items-center gap-x-[11px] max-sm:gap-x-[8px]">
        <Link to={"/profile/" + notificaion?.user?._id}>
          <img
            src={getMedia(notificaion?.user?.imageUrl || "")}
            alt="photoProfile"
            className="w-[60px] h-[60px] object-cover rounded-[41px] max-sm:min-w-[56px] max-sm:h-[56px]"
          />
        </Link>
        <div className="flex flex-col items-start gap-y-[5px] max-sm:gap-y-[2px]">
          <span className="text-[18px] text-main-color font-semibold text-wrap max-sm:text-[12px] ">
            {notificaion.user?.name + " " + message + " "}
            <Link
              to={`/posts/${notificaion?.postId?._id}`}
              className="hover:text-blue-color duration-300"
            >
              "{notificaion?.postId?.caption}"
            </Link>
          </span>
          <span className="text-light-3 text-[14px] font-normal max-sm:text-[11px]">
            {multiFormatDateString(notificaion.createdAt)}
          </span>
        </div>
      </div>
    </li>
  );
}

export default NotificationItem;
