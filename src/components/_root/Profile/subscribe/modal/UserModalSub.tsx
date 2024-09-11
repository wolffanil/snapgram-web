import UserCardSub from "./UserCardSub";
import { IUser } from "@/shared/types/user.interface";

interface IUserModalSub {
  users: Pick<IUser, "_id" | "imageUrl" | "name">[] | undefined;
  onCloseModal?: () => void;
}

function UserModalSub({ users, onCloseModal }: IUserModalSub) {
  return (
    <div className="w-full h-full flex flex-col">
      <ul className=" flex-1 max-h-[500px]  overflow-y-scroll gap-y-[14px] custom-scrollbar max-sm:max-h-[275px] max-sm:h-[275px] gap-[20px] max-sm:gap-[14px] justify-between grid grid-cols-2">
        {users?.map((sub) => (
          <UserCardSub key={sub._id} user={sub} onCloseModal={onCloseModal} />
        ))}
      </ul>
    </div>
  );
}

export default UserModalSub;
