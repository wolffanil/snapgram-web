interface IUnReadMessageProps {
  className?: string;
  count: number;
  classNameText?: string;
}

function UnReadMessage({
  className,
  count,
  classNameText,
}: IUnReadMessageProps) {
  const number = count > 99 ? "99+" : count;

  return (
    <div
      className={`flex justify-center items-center main-color rounded-full w-[26px] h-[26px] max-sm:w-[22px] max-sm:h-[22px] ${
        className ?? ""
      }`}
    >
      <span
        className={`text-white font-semibold text-[12px] max-sm:text-[10px] ${classNameText}`}
      >
        {number}
      </span>
    </div>
  );
}

export default UnReadMessage;
