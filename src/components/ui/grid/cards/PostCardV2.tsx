import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";
import PostStats from "../../postStats/PostStats";
import { IPost } from "@/shared/types/post.interface";
import { getMedia } from "@/utils";

interface IPostCardV2 {
  post: IPost;
  showStats?: boolean;
  showUser?: boolean;
}

function PostCardV2({ post, showStats, showUser }: IPostCardV2) {
  if (!post) return;
  return (
    <li key={post._id} className="relative min-w-80 h-80">
      <Link to={`/posts/${post._id}`} className="grid-post_link">
        <LazyLoadImage
          alt="post-image"
          src={getMedia(post.imageUrl)}
          className="post-card_img"
          effect="blur"
          wrapperProps={{
            style: { transitionDelay: "0.2s" },
          }}
        />
      </Link>

      <div className="grid-post_user">
        {showUser && (
          <div className="flex items-center justify-start gap-2 flex-1">
            <img
              src={getMedia(post.creator.imageUrl || "")}
              alt="creator"
              className="h-8 w-8 rounded-full"
            />
            <p className="line-clamp-1 text-white">{post.creator.name}</p>
          </div>
        )}

        {showStats && <PostStats post={post} />}
      </div>
    </li>
  );
}

export default PostCardV2;
