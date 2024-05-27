import { Link } from "react-router-dom";
import Button from "./Button";
import { IUser } from "../../shared/types/user.interface";

function UserCard({ user }: { user: IUser }) {
  return (
    <Link
      to={`/profile/${user._id}`}
      className="user-card border-main-color sidebar-bg-color"
    >
      <img
        src={user.imageUrl}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-main-color text-center line-clamp-1">
          {user.name}
        </p>
      </div>

      <Button type="button" className="!px-6 !h-[29px]">
        чат
      </Button>
    </Link>
  );
}

export default UserCard;
