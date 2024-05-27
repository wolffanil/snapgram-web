import { useGetUsers } from "../../../hooks/useGetUsers";
import ButtonLoader from "../ButtonLoader";
import UserCard from "../UserCard";

function RightSidebar() {
  const { users, isUsersLoading } = useGetUsers();

  return (
    <div className="rightsidebar sidebar-bg-color ">
      <div className="flex flex-col gap-[40px]">
        <p className="h3-bold text-main-color">Рекомендаций</p>

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

export default RightSidebar;
