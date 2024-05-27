import { NavLink } from "react-router-dom";
import cn from "clsx";
interface IItemLink {
  isActive: boolean;
  label: string;
  imgURL: string;
  route: string;
  isGetCount?: boolean;
  count?: number;
}

function ItemLink({
  isActive,
  label,
  imgURL,
  route,
  isGetCount,
  count,
}: IItemLink) {
  return (
    <li
      key={label}
      className={`leftsidebar-link group hover:bg-primary-600 dark:hover:bg-primary-500 ${
        isActive && "bg-primary-600 dark:bg-primary-500"
      }`}
    >
      <NavLink
        to={route}
        className={cn(
          "flex gap-4 items-center p-4 text-main-color hover:text-white",
          {
            "!text-white": isActive,
          }
        )}
      >
        <img
          src={imgURL}
          alt={label}
          className={`group-hover:invert-white svg-color ${
            isActive && "invert-white fill-white"
          }`}
        />
        {label}
      </NavLink>
    </li>
  );
}

export default ItemLink;
