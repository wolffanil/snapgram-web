import { IComment } from "../../../../shared/types/comment.interface";
import CommentItem from "./CommentItem";

const Comments = ({ comments }: { comments: IComment[] }) => {
  if (comments?.length == 0 || !comments) {
    return (
      <div className="flex justify-center small-medium lg:base-regular mt-5 text-main-color">
        Нет коментарий
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[200px] max-h-[200px] max-sm:min-h-[150px] max-sm:max-h-[150px] mt-5 overflow-y-scroll overflow-x-hidden custom-scrollbar">
      {comments?.map((comment: IComment) => (
        <CommentItem comment={comment} key={comment._id} />
      ))}
    </div>
  );
};

export default Comments;
