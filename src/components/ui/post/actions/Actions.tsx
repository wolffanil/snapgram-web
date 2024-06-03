import { Link } from "react-router-dom";
import { IPost } from "../../../../shared/types/post.interface";
import { useAuth } from "../../../../hooks/useAuth";
import Button from "../../Button";
import { useAction } from "./useAction";

function Actions({ post }: { post: IPost }) {
  const { user } = useAuth();
  const { handleDelete, isDeletingPost } = useAction(post);

  if (!user) return;

  if (user._id !== post.creator._id) return;

  return (
    <div className="flex-center max-sm:ml-2">
      <Link to={`/update-post/${post?._id}`}>
        <img
          src="/assets/icons/edit.svg"
          alt="edit"
          width={24}
          height={24}
          className="max-sm:min-w-[19px]"
        />
      </Link>

      <Button
        onClick={handleDelete}
        disabled={isDeletingPost}
        className={`ghost_details-delete_btn !bg-inherit  `}
      >
        <img
          src={"/assets/icons/delete.svg"}
          alt="delete"
          width={24}
          height={24}
          className="max-sm:min-w-[19px]"
        />
      </Button>
    </div>
  );
}

export default Actions;
