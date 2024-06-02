import { NavLink } from "react-router-dom";
import cn from "clsx";
interface IItemLink {
  isActive: boolean;
  label: string;
  imgURL: string;
  route: string;
  isGetCount?: boolean;
  count?: number;
  handleForNotfication: () => void;
}

function ItemLink({
  isActive,
  label,
  imgURL,
  route,
  handleForNotfication,
  isGetCount,
  count,
}: IItemLink) {
  const isNotificationLink = route === "/notifications";
  return (
    <li
      key={label}
      className={`leftsidebar-link relative group hover:bg-primary-600 dark:hover:bg-primary-500 ${
        isActive && "bg-primary-600 dark:bg-primary-500"
      }`}
      onClick={isNotificationLink ? handleForNotfication : () => {}}
    >
      <NavLink
        to={route}
        className={cn(
          "flex gap-4 items-center p-4 relative text-main-color font-bold hover:text-white",
          {
            "!text-white": isActive,
          }
        )}
      >
        <img
          src={imgURL}
          alt={label}
          className={`group-hover:invert-white text-blue-color ${
            isActive && "invert-white "
          }`}
        />
        {label}
        {isNotificationLink && count !== 0 && (
          <div className=" absolute right-[10px] top-[auto] bottom-[auto] w-[20px] h-[20px] main-color text-white text-[12px] font-semibold flex-center pt-[2px] rounded-[4px]">
            {count}
          </div>
        )}
      </NavLink>
    </li>
  );
}

export default ItemLink;
