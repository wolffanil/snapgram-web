import { Loader } from "lucide-react";
import { IPost } from "../../../shared/types/post.interface";
import { GridPostList } from "../../ui";

interface ISearchResults {
  isSearchFetching: boolean;
  searchedPosts: IPost[];
}

const SearchResults = ({ isSearchFetching, searchedPosts }: ISearchResults) => {
  if (isSearchFetching) return <Loader />;

  console.log(searchedPosts, "sarchPosts");
  console.log(searchedPosts.length, "search");
  if (searchedPosts && searchedPosts.length > 0) {
    return (
      <ul className="grid-container">
        <GridPostList posts={searchedPosts} show="Explore" showStats showUser />
      </ul>
    );
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">Нет результатов</p>
  );
};

export default SearchResults;
