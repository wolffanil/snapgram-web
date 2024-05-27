import { Loader } from "lucide-react";
import cn from "clsx";

function ButtonLoader({
  className,
  text = "Загрузка...",
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Loader /> {text}
    </div>
  );
}

export default ButtonLoader;
