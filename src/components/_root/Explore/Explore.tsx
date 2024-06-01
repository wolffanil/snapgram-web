import { Loader } from "lucide-react";
import { useExplore } from "./useExplore";
import { Controller } from "react-hook-form";
import { GridPostList } from "../../ui";
import SearchResults from "./SearchResults";

function Explore() {
  const {
    control,
    hasNextPage,
    isLoading,
    posts,
    ref,
    searchPosts,
    shouldShowPosts,
    searchTerm,
  } = useExplore();

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full text-main-color">
          {" "}
          Поиск постов
        </h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-third-color">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          `
          <Controller
            control={control}
            name="searchTerm"
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                placeholder="заголовок, #природа, локация "
                className="input-search explore-search bg-third-color text-light-3 w-full"
                value={value || ""}
                onChange={onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold text-main-color">
          Популярно сегодня
        </h3>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {searchTerm ? (
          <SearchResults
            isSearchFetching={isLoading}
            searchedPosts={searchPosts || []}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">Конец постов</p>
        ) : (
          <ul className="grid-container">
            {posts?.pages.map((item, index) => (
              <GridPostList
                key={`page-${index}`}
                posts={item?.posts}
                show="Explore"
                showStats
                showUser
              />
            ))}
          </ul>
        )}
      </div>

      {hasNextPage && !searchTerm && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Explore;
