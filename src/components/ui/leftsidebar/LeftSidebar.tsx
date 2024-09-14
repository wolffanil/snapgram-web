import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import Logo from "../Logo";
import ItemLink from "./ItemLink";
import SettingsButtons from "./SettingsButtons";
import { getDefaultProfileImage, getMedia } from "../../../utils";
import { useNotification } from "@/hooks/useNotification";
import { memo } from "react";
import { useGetUnReadChats } from "@/hooks/useGetUnReadChats";

function LeftSidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { notifications, needToSetIsView } = useNotification();

  const { countUnReadChats } = useGetUnReadChats();

  const countNotifications =
    notifications?.filter((n) => n.isView === false)?.length || 0;

  return (
    <nav className="leftsidebar sidebar-bg-color max-lgt:min-w-[290px] max-xl:min-w-[unset] pt-1">
      <div className="flex flex-col gap-11 max-lg:max-h-[100%]">
        <Link to="/" className="flex gap-3 items-center">
          <Logo className="w-[170px] h-[36px]" />
        </Link>

        <Link
          to={`/profile/${user?._id}`}
          className="flex-start gap-3 items-center"
        >
          <img
            src={getMedia(user?.imageUrl || "")}
            alt="profile"
            className="h-14 w-14 rounded-full"
            onError={getDefaultProfileImage}
          />
          <div className="flex flex-col">
            <p className="body-bold text-main-color">{user?.name}</p>
            <p className="small-regular text-light-3">
              {user?.nick ? "@" + user.nick : ""}
            </p>
          </div>
        </Link>

        <ul className="flex flex-col gap-[16px] max-xl:gap-[20px] max-lg:overflow-y-scroll max-lg:custom-scrollbar max-lg:max-h-[80%] max-lg:pr-2">
          <>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.route;

              return (
                <ItemLink
                  key={link.route}
                  isActive={isActive}
                  handleForNotfication={needToSetIsView}
                  count={countNotifications}
                  countUnReadChats={countUnReadChats}
                  {...link}
                />
              );
            })}

            <SettingsButtons />
          </>
        </ul>
      </div>
    </nav>
  );
}

export default memo(LeftSidebar);
