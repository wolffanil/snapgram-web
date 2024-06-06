import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "../../constants";
import { useAuth } from "../../hooks/useAuth";

function Bottombar() {
  const { pathname } = useLocation();
  const { selectedChat } = useAuth();

  if (selectedChat?._id && pathname === "/chats") return null;

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <Link
            to={link.route}
            key={link.route}
            className={`${
              isActive && "bg-primary-600 dark:bg-primary-500 rounded-[10px]"
            } flex-center p-[10px] transition`}
          >
            <img
              src={link.imgURL}
              alt={link.route}
              width={22}
              height={22}
              className={`${isActive && "invert-white"}`}
            />
          </Link>
        );
      })}
    </section>
  );
}

export default Bottombar;
