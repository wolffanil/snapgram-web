import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentService } from "../../../../services/comment.service";
import { QUERY_KEYS } from "../../../../shared/enums/queryKeys";
import { IPost } from "../../../../shared/types/post.interface";
import { useParams } from "react-router-dom";
import { getMedia } from "../../../../utils";
import { useNotification } from "../../../../hooks/useNotification";

function AddComment({ post }: { post: IPost }) {
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const { id } = useParams();

  const { createNotification } = useNotification();

  const queryClient = useQueryClient();
  const { mutate: createComment, isPending: isCreatingComment } = useMutation({
    mutationKey: ["create comment"],
    mutationFn: () => CommentService.create({ text: comment, postId: id }),
    onSuccess: (comment) => {
      setComment("");
      queryClient.setQueryData(
        [QUERY_KEYS.GET_POST_BY_ID, comment.postId],
        (oldPost: IPost) =>
          ({
            ...oldPost,
            comments: [
              ...oldPost.comments,
              { ...comment, author: { ...user } },
            ],
          } as IPost)
      );

      if (post?.creator?._id === user?._id) return;

      //@ts-ignore
      createNotification({
        postId: post,
        to: post.creator._id,
        type: "comment",
      });
    },
  });

  return (
    <div className="flex gap-[11px] mt-10 items-center">
      <img
        src={getMedia(user?.imageUrl || "")}
        alt="profile"
        className="h-[40px] min-w-[40px] rounded-full object-cover max-sm:min-w-[32px] max-sm:h-[32px]"
      />

      <div className="flex justify-between px-[16px]  items-center rounded-[8px]  w-full h-[44px] write-color bg-main-color">
        <input
          type="text"
          required
          placeholder="Напишите свой комментарий..."
          className=" focus:outline-none max-sm:w-[100px] subtle-semibold lg:small-regular w-full !bg-main-color"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          disabled={isCreatingComment}
        />
        <img
          src="/assets/icons/send.svg"
          alt="send"
          className="!text-black dark:!invert-white"
          onClick={() => createComment()}
        />
      </div>
    </div>
  );
}

export default AddComment;
