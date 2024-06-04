import { Loader as Loading } from "lucide-react";

function Loader() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Loading className="invert-black dark:invert-white" />
    </div>
  );
}

export default Loader;
