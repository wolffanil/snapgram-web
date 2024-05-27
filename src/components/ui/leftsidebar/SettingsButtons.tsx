import cn from "clsx";
import { useLogout } from "../../../hooks/useLogout";
import { useTheme } from "../../../hooks/useTheme";

function SettingsButtons({ className }: { className?: string }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { logout, isLogoutLoading } = useLogout();

  return (
    <div className={cn("flex flex-col gap-11 ml-[18px]", className)}>
      <button className="shad-button_ghost" onClick={() => toggleDarkMode()}>
        <img
          src={`/assets/icons/${isDarkMode ? "dark.svg" : "light.svg"}`}
          alt="theme"
          className="svg-color"
          width={23}
          height={23}
        />
        <p className="small-medium max-lg:base-medium text-main-color">тема</p>
      </button>

      <button
        className="shad-button_ghost"
        onClick={() => logout()}
        disabled={isLogoutLoading}
      >
        <img
          src="/assets/icons/logout.svg"
          alt="logout"
          className="svg-color"
        />
        <p className="small-medium max-lg:base-medium text-main-color">выход</p>
      </button>
    </div>
  );
}

export default SettingsButtons;
