import { Link } from "react-router-dom";
import { IPost } from "../../../../shared/types/post.interface";
import { useAuth } from "../../../../hooks/useAuth";
import Button from "../../Button";
import { useAction } from "./useAction";

function Actions({ post }: { post: IPost }) {
  const { user } = useAuth();
  const { handleDelete, isDeletingPost } = useAction(post);

  if (!user) return;

  return (
    <div className="flex-center">
      <Link
        to={`/update-post/${post?._id}`}
        className={`${user._id !== post?.creator?._id && "hidden"}`}
      >
        <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
      </Link>

      <Button
        onClick={handleDelete}
        disabled={isDeletingPost}
        className={`ghost_details-delete_btn ${
          user._id !== post?.creator?._id && "hidden"
        }`}
      >
        <img
          src={"/assets/icons/delete.svg"}
          alt="delete"
          width={24}
          height={24}
        />
      </Button>
    </div>
  );
}

export default Actions;
