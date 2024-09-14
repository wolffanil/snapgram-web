import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import { IUser } from "../../shared/types/user.interface";
import { getDefaultProfileImage, getMedia } from "../../utils";
import { useCreateChat } from "../../hooks/useCreateChat";

function UserCard({ user }: { user: IUser }) {
  const { isCreatingChat, handleCreateChat } = useCreateChat(
    user?._id || "",
    user?.name || ""
  );

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAllUsersPage = pathname === "/all-users";

  // to={`/profile/${user._id}`}

  return (
    <div
      className={`user-card border-main-color sidebar-bg-color cursor-pointer ${
        isAllUsersPage && "lg:w-[303px] lg:h-[319px]"
      }`}
    >
      <img
        src={getMedia(user.imageUrl || "")}
        alt="creator"
        className={`rounded-full w-14 h-14 object-cover ${
          isAllUsersPage && "lg:w-[92px] lg:h-[92px]"
        }`}
        onClick={() => navigate(`/profile/${user._id}`)}
        onError={getDefaultProfileImage}
      />

      <div className="flex-center flex-col gap-1">
        <p
          className={`base-medium text-main-color text-center line-clamp-1 ${
            isAllUsersPage && "lg:text-[24px]"
          }`}
        >
          {user.name}
        </p>
        {user?.nick && isAllUsersPage && (
          <p className="text-light-3">@{user.nick}</p>
        )}
      </div>

      <Button
        type="button"
        className={`!px-6 !h-[29px] ${
          isAllUsersPage && "lg:w-[111px]  lg:!text-[18px] lg:!h-[38px]"
        }`}
        onClick={handleCreateChat}
        disabled={isCreatingChat}
      >
        чат
      </Button>
    </div>
  );
}

export default UserCard;
