import { useTheme } from "../../hooks/useTheme";
import { Protect } from "../ui";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Protect isProtect={false}>
      {
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10 bg-main-color">
            <Outlet />
          </section>

          <img
            src={`/assets/images/${
              isDarkMode ? "auth-dark.jpg" : "auth-light.jpg"
            }`}
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      }
    </Protect>
  );
}

export default AuthLayout;
