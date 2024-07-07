import { Loader } from "@/components/ui";
import { useDevices } from "./useDevices";
import DeviceItem from "./deviceItem/DeviceItem";

function Deviсes() {
  const { devices, isLoadingDevices } = useDevices();

  return (
    <div className="w-full h-full flex flex-col">
      <ul className="flex flex-col flex-1 h-[400px] max-h-[400px] overflow-y-scroll gap-y-[14px] custom-scrollbar max-sm:max-h-[275px] max-sm:h-[275px]">
        {isLoadingDevices ? (
          <Loader />
        ) : (
          devices?.map((device) => (
            <DeviceItem device={device} key={device._id} />
          ))
        )}
      </ul>
    </div>
  );
}

export default Deviсes;
