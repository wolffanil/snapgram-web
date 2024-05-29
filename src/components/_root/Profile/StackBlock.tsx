interface StabBlockPorps {
  value: string | number;
  label: string;
}

function StatBlock({ value, label }: StabBlockPorps) {
  return (
    <div className="flex-center gap-2 flex-col !items-start">
      <p className="small-semibold lg:body-bold text-blue-color">{value}</p>
      <p className="small-medium lg:base-medium text-main-color">{label}</p>
    </div>
  );
}

export default StatBlock;
