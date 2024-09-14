import Skeleton from "../../Skeleton";

interface ISkeletonPostV2 {
  numberOfPosts?: number;
}

function SkeletonPostV2({ numberOfPosts = 1 }: ISkeletonPostV2) {
  const postsToDisplay = Math.max(1, numberOfPosts);
  return (
    <ul className="grid-container">
      {Array.from({ length: postsToDisplay }, (_, index) => (
        <li key={index}>
          <Skeleton className="relative min-w-80 h-80 rounded-[30px] max-sm:max-w-[300px] max-sm:min-w-0" />
        </li>
      ))}
    </ul>
  );
}

export default SkeletonPostV2;
