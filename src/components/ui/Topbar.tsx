import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Logo from "./Logo";
import { getMedia } from "../../utils";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useNotification } from "../../hooks/useNotification";
import { useLogout } from "../../hooks/useLogout";

const wrapperStyle =
  "flex items-center gap-x-[12px] text-main-color font-medium text-[16px] w-full";
const imgStyle = "w-[22px] h-[22px]";

function Topbar() {
  const { selectedChat } = useAuth();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { notifications, needToSetIsView } = useNotification();
  const { pathname } = useLocation();
  const { logout, isLogoutLoading } = useLogout();

  const countNotifications =
    notifications?.filter((n) => n.isView === false)?.length || 0;

  if (selectedChat?._id && pathname === "/chats") return null;

  const handleClose = () => setIsOpen((o) => !o);

  return (
    <section className="topbar relative ">
      <Link to="/" onClick={() => setIsOpen(false)}>
        <Logo className="w-[130px] h-[27px]" />
      </Link>

      <div className="flex items-center gap-x-[12px]">
        <Link to={`/profile/${user?._id}`} onClick={() => setIsOpen(false)}>
          <img
            src={getMedia(user?.imageUrl || "")}
            alt="photoProfile"
            className="w-[30px] h-[30px] object-cover rounded-[27px]"
          />
        </Link>
        <div
          onClick={handleClose}
          className="rounded-[8px] h-[40px] w-[40px] flex-center bg-[#f6f6f6] dark:bg-[#101012]"
        >
          <img
            src={`/assets/icons/${isOpen ? "close.svg" : "burger.svg"}`}
            className={`${isOpen ? "invert-black dark:invert-white" : ""}`}
            alt="action"
          />
        </div>
      </div>

      <div
        className={`absolute  w-full ${
          isOpen
            ? "top-[72px] animate-in duration-500"
            : "top-[-400px] animate-out duration-500"
        } bg-[#e0e0e0]/90 dark:bg-[#101012]/90 max-h-[302px] flex flex-col items-start justify-between px-[36px] pb-[34px] pt-[50px] rounded-b-[10px] left-0 right-0 gap-y-[34px] z-10`}
      >
        <Link to="/all-users" onClick={handleClose} className={wrapperStyle}>
          <img
            src="/assets/icons/people.svg"
            alt="people"
            className={imgStyle}
          />
          люди
        </Link>
        <Link
          to="/notifications"
          onClick={() => {
            needToSetIsView();
            handleClose();
          }}
          className={wrapperStyle}
        >
          <img
            src="/assets/icons/notification.svg"
            alt="notification"
            className={imgStyle}
          />
          уведомление
          {countNotifications > 0 && (
            <div className="w-[20px] h-[20px] main-color text-white text-[12px] font-semibold flex-center pt-[2px] rounded-[4px]">
              {countNotifications}
            </div>
          )}
        </Link>
        <div onClick={toggleDarkMode} className={wrapperStyle}>
          <img
            src={`/assets/icons/${isDarkMode ? "light.svg" : "dark.svg"}`}
            alt="theme"
            className={imgStyle}
          />
          тема
        </div>

        <button
          onClick={() => {
            logout();
            handleClose();
          }}
          disabled={isLogoutLoading}
          className="w-full h-[44px] rounded-[8px] bg-red py-[15px] flex-center gap-x-[10px] text-white font-semibold text-[14px]"
        >
          <img
            src="/assets/icons/logout.svg"
            alt="logout"
            className="invert-white h-[14px] w-[13px]"
          />
          Выйти
        </button>
      </div>
    </section>
  );
}

export default Topbar;
