import { Controller } from "react-hook-form";
import { useTheme } from "../../../hooks/useTheme";
import { useSearchUser } from "./useSearchUser";
import { UserCard } from "../../ui";
import { Loader } from "lucide-react";

function SearchUser() {
  const { control, isLoading, searchTerm, searchUsers, users } =
    useSearchUser();

  const { isDarkMode } = useTheme();

  const creators = searchTerm !== "" ? searchUsers : users;

  return (
    <div className="common-container lg:!px-[80px] ">
      <div className="user-container">
        <div className=" flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/people.svg"
            alt="add"
            width={36}
            height={36}
            className={isDarkMode ? "invert-white" : "invert-black"}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full text-main-color">
            Все пользователи
          </h2>
        </div>

        <div className="flex gap-1 px-4 w-full rounded-lg bg-third-color">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />

          <Controller
            control={control}
            name="searchTerm"
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                placeholder="Константин @user"
                className="input-search explore-search bg-third-color text-light-3 w-full"
                value={value || ""}
                onChange={onChange}
              />
            )}
          />
        </div>
        {!creators?.length && !isLoading && (
          <p className="text-main-color text-[28px]">Ничего не найденно</p>
        )}
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.map((c) => (
              <li key={c?._id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={c} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchUser;
