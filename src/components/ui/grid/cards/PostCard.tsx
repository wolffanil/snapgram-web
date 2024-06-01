import { Link } from "react-router-dom";
import { IPost } from "../../../../shared/types/post.interface";
import PostStats from "../../postStats/PostStats";
import { formatDateString, getMedia } from "../../../../utils";
import { useAuth } from "../../../../hooks/useAuth";

function PostCard({ post }: { post: IPost }) {
  const { user } = useAuth();
  if (!post.creator) return;

  return (
    <div className="post-card bg-third-card border-main-color">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator._id}`}>
            <img
              src={getMedia(post.creator?.imageUrl || "")}
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-main-color">
              {post.creator.name}
            </p>

            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatDateString(post.createdAt || "")}
              </p>

              <p className="subtle-semibold lg:small-regular text-main-color">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post._id}`}
          className={`${user?._id !== post.creator._id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p className="text-main-color">{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post?.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={
            getMedia(post.imageUrl) || "/assets/icons/profile-placeholder.svg"
          }
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} />
    </div>
  );
}

export default PostCard;
