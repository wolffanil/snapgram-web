import { Outlet } from "react-router-dom";
import { Bottombar, LeftSidebar, Protect, RightSidebar, Topbar } from "../ui";
import SocketProvider from "../../context/socket/SocketProvider";

function RootLayout() {
  return (
    <Protect isProtect>
      <SocketProvider>
        <div className="w-full md:flex">
          <Topbar />
          <LeftSidebar />

          <section className="flex flex-1 h-full">
            <Outlet />
          </section>

          <RightSidebar />

          <Bottombar />
        </div>
      </SocketProvider>
    </Protect>
  );
}

export default RootLayout;
