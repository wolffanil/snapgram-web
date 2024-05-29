import React from "react";
import { IPost } from "../../../shared/types/post.interface";
import PostCard from "./cards/PostCard";
import PostCardV2 from "./cards/PostCardV2";

interface IGridPost {
  posts: IPost[];
  showUser?: boolean;
  showStats?: boolean;
  show?: "Home" | "Explore";
}

function GridPostList({ posts, showStats, showUser, show }: IGridPost) {
  return (
    <React.Fragment key={posts.length}>
      {show === "Home"
        ? posts.map((post) => <PostCard post={post} key={post.caption} />)
        : posts.map((post, index) => (
            <PostCardV2
              post={post}
              showUser={showUser}
              showStats={showStats}
              key={index}
            />
          ))}
    </React.Fragment>
  );
}

export default GridPostList;
