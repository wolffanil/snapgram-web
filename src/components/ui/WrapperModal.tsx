import { FC, ReactNode } from "react";

interface IWrapperModal {
  onCloseModal?: () => void;
  title: string;
  containerStyle?: string;
  children: ReactNode;
}

const WrapperModal: FC<IWrapperModal> = ({
  onCloseModal,
  title,
  containerStyle,
  children,
}) => {
  return (
    <div
      className={`border border-light-3 rounded-[20px] w-[575px] min-h-[660px] max-sm:w-[345px] max-sm:min-h-[455px] bg-third-color py-[37px] px-[35px] max-sm:py-[27px] max-sm:px-[14px] ${
        containerStyle ?? ""
      }`}
    >
      <div className="flex justify-between items-center w-full mb-[43px]">
        <p className="text-[24px] font-semibold text-main-color max-sm:text-[18px]">
          {title}
        </p>
        <button
          onClick={() => onCloseModal?.()}
          className="rounded-[50px] w-[35px] h-[35px] flex justify-center items-center blue-color max-sm:w-[28px] max-sm:h-[28px]"
        >
          <img
            src="/assets/icons/closeModal.svg"
            alt="close"
            className="object-contain w-[11px] h-[11px] max-sm:w-[7px] max-sm:h-[7px]"
          />
        </button>
      </div>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default WrapperModal;
