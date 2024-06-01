import { Link } from "react-router-dom";
import { IPost } from "../../../../shared/types/post.interface";
import PostStats from "../../postStats/PostStats";
import { getMedia } from "../../../../utils";

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
        <img
          src={getMedia(post.imageUrl)}
          alt="post"
          className="h-full w-full object-cover"
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
