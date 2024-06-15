import { useLocation } from "react-router-dom";
import { useGetUsers } from "../../../hooks/useGetUsers";
import ButtonLoader from "../ButtonLoader";
import UserCard from "../UserCard";
import { memo } from "react";

const deleteOnTablet = ["saved", "profile", "chats", "posts", "explore"];

function RightSidebar() {
  const { users, isUsersLoading } = useGetUsers();
  const { pathname } = useLocation();

  const isDelete = deleteOnTablet.includes(pathname.split("/")[1]);

  return (
    <div
      className={`rightsidebar sidebar-bg-color ${
        pathname === "/all-users" && "!hidden"
      } ${isDelete && "max-lgt:hidden"}`}
    >
      <div className="flex flex-col gap-[40px]">
        <p className="h3-bold text-main-color">Рекомендации</p>

        {isUsersLoading && !users ? (
          <ButtonLoader />
        ) : (
          <ul className="user-grid user-grid_rightsidebar">
            {users?.map((creator) => (
              <li key={creator?._id} className="flex-1 min-w-[200px] w-full ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default memo(RightSidebar);
