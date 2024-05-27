import { Link } from "react-router-dom";
import { IPost } from "../../../shared/types/post.interface";
import { formatDateString } from "../../../utils";
import Actions from "./actions/Actions";
import PostStats from "../postStats/PostStats";
import Comments from "./comment/Comments";
import AddComment from "./comment/AddComment";

function PostDetails({ post }: { post: IPost }) {
  return (
    <div className="post_details-container">
      <div className="post_details-card bg-main-color">
        <img src={post?.imageUrl} alt="post" className="post_details-img" />

        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link
              to={`/profile/${post?.creator?._id}`}
              className="flex items-center gap-3"
            >
              <img
                src={
                  post?.creator?.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="creator"
                className="rounded-full w-8 h-8 lg:h-12 lg:w-12"
              />

              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-main-color">
                  {post?.creator?.name}
                </p>

                <div className="flex-center gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular">
                    {formatDateString(post?.createdAt || "")}
                  </p>

                  <p className="subtle-semibold lg:small-regular text-main-color">
                    {post?.location}
                  </p>
                </div>
              </div>
            </Link>

            <Actions post={post} />
          </div>

          <hr className="border w-full border-dark-4/80" />

          <div className="flex flex-col w-full small-medium lg:base-regular">
            <p>{post?.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post?.tags.map((tag: string) => (
                <li key={tag} className="text-light-3">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            <PostStats post={post} />
            <hr className="border w-full border-dark-4/80 mt-3" />
            <Comments comments={post?.comments} />
          </div>
          <div className="w-full">
            <AddComment />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;