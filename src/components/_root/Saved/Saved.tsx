import { useTheme } from "../../../hooks/useTheme";
import { GridPostList, Loader } from "../../ui";
import { useGetSave } from "./useGetSave";

function Saved() {
  const { saves, isLoadingSaves } = useGetSave();
  const { isDarkMode } = useTheme();
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className={isDarkMode ? "invert-white" : "invert-black"}
        />
        <h2 className="h3-bold md:h2-bold text-left w-full text-main-color">
          Закладки
        </h2>
      </div>

      {isLoadingSaves ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {!saves?.length ? (
            <p className="text-light-4">Нет сохранённых постов</p>
          ) : (
            <ul className="grid-container">
              <GridPostList
                //@ts-ignore
                posts={saves}
                showStats={true}
                showUser={true}
                show="Explore"
              />
            </ul>
          )}
        </ul>
      )}
    </div>
  );
}

export default Saved;
