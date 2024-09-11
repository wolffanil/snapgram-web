interface StabBlockPorps {
  value: string | number;
  label: string;
}

function StatBlock({ value, label }: StabBlockPorps) {
  return (
    <div className="flex-center gap-2 flex-col  !items-start max-lg:!items-center">
      <p className="small-semibold lg:body-bold text-blue-color max-lg:!text-[18px] max-sm:!text[14px]">
        {value}
      </p>
      <p className="small-medium lg:base-medium text-main-color max-lg:!text-[20px] max-sm:!text-[14px]">
        {label}
      </p>
    </div>
  );
}

export default StatBlock;
