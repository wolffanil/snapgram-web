import { Outlet } from "react-router-dom";
import { LeftSidebar, Protect, RightSidebar } from "../ui";

function RootLayout() {
  return (
    <Protect isProtect>
      <div className="w-full md:flex">
        {/* <Topbar /> */}
        <LeftSidebar />

        <section className="flex flex-1 h-full">
          <Outlet />
        </section>

        <RightSidebar />

        {/* <Bottombar /> */}
      </div>
    </Protect>
  );
}

export default RootLayout;
