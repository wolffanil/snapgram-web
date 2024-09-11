import { IUser } from "@/shared/types/user.interface";
import { getMedia } from "@/utils";
import { useNavigate } from "react-router-dom";

interface IUserCardSub {
  user: Pick<IUser, "_id" | "name" | "imageUrl">;
  onCloseModal?: () => void;
}

function UserCardSub({ user, onCloseModal }: IUserCardSub) {
  const navigate = useNavigate();

  return (
    <li
      className={`flex flex-col items-center w-full py-[18px] gap-y-[9px]  h-[140px] md:py-[23px] md:gap-y-[12px] rounded-[20px]  border-[2px] !bg-main-color !sidebar-bg-color cursor-pointer max-sm:h-[110px]`}
      onClick={() => {
        onCloseModal?.();
        navigate(`/profile/${user._id}`);
      }}
    >
      <img
        src={getMedia(user.imageUrl || "")}
        alt="creator"
        className={`rounded-full w-14 h-14 max-sm:w-9 max-sm:h-9 object-cover`}
      />

      <p className={`base-medium text-main-color text-center line-clamp-1`}>
        {user.name}
      </p>
    </li>
  );
}

export default UserCardSub;
