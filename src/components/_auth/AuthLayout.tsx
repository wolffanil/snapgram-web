import SocketAuthProvider from "@/context/socketAuth/SocketAuthProvider";
import { useTheme } from "../../hooks/useTheme";
import { Protect } from "../ui";
import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Protect isProtect={false}>
      <SocketAuthProvider>
        {
          <>
            <section className="flex flex-1 justify-center items-center flex-col py-10 bg-main-color">
              <Outlet />
              <div className="text-small-regular text- text-center mt-[5px] text-main-color max-sm:max-w-[290px]  flex-center flex-col ">
                Продолжая, вы соглашаетесь с положениями основных документов
                Snapgram —{" "}
                <Link
                  to="/politic"
                  className="underline text-blue-color"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Политика конфиденциальности
                </Link>{" "}
                и подтверждаете, что прочли её.
              </div>
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
      </SocketAuthProvider>
    </Protect>
  );
}

export default AuthLayout;
