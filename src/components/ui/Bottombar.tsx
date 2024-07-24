import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGetUnReadChats } from "@/hooks/useGetUnReadChats";
import UnReadMessage from "./unReadMessage";

function Bottombar() {
  const { pathname } = useLocation();
  const { selectedChat } = useAuth();
  const { countUnReadChats } = useGetUnReadChats();

  if (selectedChat?._id && pathname === "/chats") return null;

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;

        const isChatsRoute = link.route === "/chats";

        return (
          <Link
            to={link.route}
            key={link.route}
            className={`${
              isActive && "bg-primary-600 dark:bg-primary-500 rounded-[10px]"
            } flex-center p-[10px] transition relative`}
          >
            <img
              src={link.imgURL}
              alt={link.route}
              width={22}
              height={22}
              className={`${isActive && "invert-white"}`}
            />

            {isChatsRoute && !isActive && countUnReadChats > 0 && (
              <UnReadMessage
                className="max-sm:!w-[18px] max-sm:!h-[18px]  absolute top-[3px] right-[3px]"
                classNameText="!font-normal !text-[8px]"
                count={countUnReadChats}
              />
            )}
          </Link>
        );
      })}
    </section>
  );
}

export default Bottombar;
