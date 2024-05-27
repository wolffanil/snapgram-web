import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentService } from "../../../../services/comment.service";
import { QUERY_KEYS } from "../../../../shared/enums/queryKeys";
import { IPost } from "../../../../shared/types/post.interface";
import { useParams } from "react-router-dom";

function AddComment() {
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const { id } = useParams();

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
            comments: [...oldPost.comments, comment],
          } as IPost)
      );
    },
  });

  return (
    <div className="flex gap-[12px] mt-10 items-center">
      <img
        src={user?.imageUrl}
        alt="profile"
        className="h-6 w-6 rounded-full"
      />

      <div className="flex justify-between px-[16px]  items-center rounded-[8px]  w-full h-[44px] write-color">
        <input
          type="text"
          required
          placeholder="Напишите свой комментарий..."
          className="bg-[#101012] focus:outline-none max-sm:w-[100px] subtle-semibold lg:small-regular w-full"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          disabled={isCreatingComment}
        />
        <img
          src="/assets/icons/send.svg"
          alt="send"
          className="cursor-pointer"
          onClick={() => createComment()}
        />
      </div>
    </div>
  );
}

export default AddComment;
