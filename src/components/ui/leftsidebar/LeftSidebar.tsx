import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "../../../constants";
import { useAuth } from "../../../hooks/useAuth";
import Logo from "../Logo";
import ItemLink from "./ItemLink";
import SettingsButtons from "./SettingsButtons";
import { getMedia } from "../../../utils";
import { useNotification } from "../../../hooks/useNotification";

function LeftSidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { notifications, needToSetIsView } = useNotification();

  const countNotifications =
    notifications?.filter((n) => n.isView === false)?.length || 0;

  return (
    <nav className="leftsidebar sidebar-bg-color max-lgt:min-w-[290px] max-xl:min-w-[unset]">
      <div className="flex flex-col gap-11">
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
          />
          <div className="flex flex-col">
            <p className="body-bold text-main-color">{user?.name}</p>
            <p className="small-regular text-light-3">
              {user?.nick ? "@" + user.nick : ""}
            </p>
          </div>
        </Link>

        <ul className="flex flex-col gap-[16px] max-xl:gap-[20px]">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <ItemLink
                key={link.route}
                isActive={isActive}
                handleForNotfication={needToSetIsView}
                count={countNotifications}
                {...link}
              />
            );
          })}
        </ul>
      </div>

      <SettingsButtons />
    </nav>
  );
}

export default LeftSidebar;
