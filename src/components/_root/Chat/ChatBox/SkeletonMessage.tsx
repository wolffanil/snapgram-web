import { Skeleton } from "@/components/ui";
import ScrollableFeed from "react-scrollable-feed";

interface ISkeletonMessage {
  numberOfMessage: number;
}

function isEven(number: number) {
  return number % 2 === 0;
}

function SkeletonMessage({ numberOfMessage = 1 }: ISkeletonMessage) {
  const messagesToDisplay = Math.max(1, numberOfMessage);

  return (
    <ScrollableFeed className="custom-scrollbar-without !min-h-full flex-1">
      {Array.from({ length: messagesToDisplay }, (_, index) => (
        <Skeleton
          className={` w-[113px] h-[50px] rounded-[10px] max-sm:w-[102px] max-sm:h-[36px] mb-[20px] ${
            isEven(index) ? "ml-auto" : "mr-auto"
          }`}
          key={index}
        />
      ))}
    </ScrollableFeed>
  );
}

export default SkeletonMessage;
