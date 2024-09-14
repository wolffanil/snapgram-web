import Skeleton from "../../Skeleton";

interface ISkeletonPost {
  numberOfPosts?: number;
}

function SkeletonPost({ numberOfPosts = 1 }: ISkeletonPost) {
  const postsToDisplay = Math.max(1, numberOfPosts);

  return (
    <ul className="flex flex-col flex-1 gap-9 w-full">
      {Array.from({ length: postsToDisplay }, (_, index) => (
        <li key={index}>
          <div className="post-card bg-third-card border-main-color">
            <div className="flex-between">
              <div className="flex items-center gap-3">
                <Skeleton className="rounded-full w-[54px] h-[54px]" />

                <div className="flex flex-col">
                  <Skeleton className="w-[104px] h-[23px] max-sm:w-[71px] max-sm:h-[11px]" />

                  <div className="flex-center gap-2 mt-2">
                    <Skeleton className="w-[104px] h-[17px] max-sm:w-[66px] max-sm:h-[10px]" />

                    <Skeleton className="w-[104px] h-[17px] max-sm:w-[66px] max-sm:h-[10px]" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="small-medium py-5">
                <Skeleton className="w-full h-[22px] max-sm:h-[14px]" />
              </div>

              <Skeleton className="h-64 xs:h-[400px] lg:h-[450px] w-full rounded-[24px] mb-5" />
            </div>

            <div className="w-full flex justify-between items-center">
              <Skeleton className="w-[220px] h-[20px] max-sm:w-[170px]" />
              <Skeleton className="w-[26px] h-[26px]  max-sm:h-[23px]" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SkeletonPost;
