import { Skeleton } from "@/components/ui";

function SkeletonSubscribe() {
  return (
    <div className="flex flex-col gap-y-[6px] items-start w-[105px] max-sm:flex-row max-sm:gap-x-[4px] max-sm:w-[103px] max-sm:gap-y-0">
      <Skeleton className="w-[50px] h-[21px] rounded-lg max-sm:w-[27px] max-sm:h-[17px]" />
      <Skeleton className="rounded-lg w-full h-[21px] max-sm:h-[17px]" />
    </div>
  );
}

export default SkeletonSubscribe;
