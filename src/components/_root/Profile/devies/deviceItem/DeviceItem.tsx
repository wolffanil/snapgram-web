import { IToken } from "@/shared/types/token.interface";
import { formatDateString } from "@/utils";
import { browserType, osType } from "./deviceItem.constants";
import { useDevice } from "./useDevice";

interface IDevice extends IToken {
  isCorrentDevice: boolean;
}

function DeviceItem({ device }: { device: IDevice }) {
  const { isDeletingToken, deleteDevice, handleSendHello } = useDevice(
    device._id
  );

  let imagePath;
  if (device.type === "browser") {
    const browser = device.browser.split(" ")[0];
    imagePath = browserType[browser];
  } else {
    const os = device.device;
    imagePath = osType[os];
  }

  return (
    <li className="w-full flex bg-main-color pt-[10px] pb-[5px] px-[16px] rounded-[15px] min-h-[68px] max-sm:min-h-[58px] max-sm:rounded-[10px] max-sm:px-[10px] max-sm:pt-[8px] max-sm:pb-[2px] items-center">
      <div className="flex justify-center items-center w-[47px] h-[47px] rounded-[50px] blue-color max-sm:w-[33px] max-sm:h-[33px]">
        <img
          src={imagePath}
          alt="device"
          className="object-contain w-[23px] h-[23px] max-sm:w-[19px] max-sm:h-[19px]"
        />
      </div>

      <div className="flex flex-col gap-y-[1px] ml-[17px] text-main-color font-medium text-[14px] max-sm:ml-[10px] max-sm:text-[12px]">
        <p>
          {device.ip}
          <span className="text-[12px] max-sm:text-[9px] max-sm:hidden">
            {"-" + formatDateString(device.createdAt)}
          </span>
        </p>
        <p>
          {device.type === "browser"
            ? device.browser
            : `${device.brand} | ${device.model}`}
        </p>
        <p>{device.device}</p>
      </div>

      {!device.isCorrentDevice && (
        <button
          className={`flex justify-center items-center ml-[45px] bg-secondary-500 w-[37px] h-[37px] max-sm:ml-[73px] max-sm:w-[23px] max-sm:h-[23px] rounded-[50px] ${
            device.type !== "browser" && "max-sm:ml-[20px]"
          }`}
          onClick={handleSendHello}
        >
          <img
            src="/assets/icons/hand.svg"
            alt="hand"
            title="say hello"
            className="object-contain w-[21px] h-[21px] max-sm:w-[13px] max-sm:h-[13px]"
          />
        </button>
      )}

      {device.isCorrentDevice ? (
        <div className="flex justify-center items-center w-[100px] h-[37px] bg-second-color text-main-color text-[14px] max-sm:w-[80px] max-sm:h-[23px] max-sm:text-[12px] rounded-[8px] max-sm:rounded-[5px] ml-auto">
          вы
        </div>
      ) : (
        <button
          className="flex justify-center items-center ml-auto blue-color text-white w-[82px] h-[37px] rounded-[8px] font-semibold text-[14px] max-sm:w-[53px] max-sm:h-[23px] max-sm:rounded-[5px] max-sm:text-[12px]"
          disabled={isDeletingToken}
          onClick={() => deleteDevice()}
        >
          выйти
        </button>
      )}
    </li>
  );
}

export default DeviceItem;
