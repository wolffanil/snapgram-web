import { Loader } from "lucide-react";
import { GridPostList } from "../../ui";
import { useHome } from "./useHome";

function Home() {
  const { posts, isErrorPosts, hasNextPage, ref } = useHome();

  if (isErrorPosts) {
    return <h2 className="text-[24px] text-main-color">Что-то пошло не так</h2>;
  }

  console.log(posts);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full text-main-color">
            Лента
          </h2>

          {!posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages.map((item, index) => (
                <GridPostList
                  key={`page-${index}`}
                  posts={item?.posts}
                  show="Home"
                />
              ))}
            </ul>
          )}
        </div>

        {hasNextPage && (
          <div ref={ref} className="mt-10">
            <Loader className="text-black dark:text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
