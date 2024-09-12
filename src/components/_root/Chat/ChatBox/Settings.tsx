import { Modal, WrapperModal } from "@/components/ui";
import ActionMessageModal from "./actionMessageModal/ActionMessageModal";
import { IMessage } from "@/shared/types/message.interface";

interface ISettings {
  message: IMessage;
}

function Settings({ message }: ISettings) {
  return (
    <Modal>
      <Modal.Open opens="settings">
        <div className="blue-color flex justify-center items-center rounded-full size-[24px] max-sm:size-[22px] cursor-pointer">
          <img
            src="/assets/icons/settings.svg"
            alt="settings"
            className="max-sm:size-4"
          />
        </div>
      </Modal.Open>

      <Modal.Window name="settings">
        <WrapperModal
          title="Редактировать"
          containerStyle="w-[600px] !min-h-[300px]"
        >
          <ActionMessageModal message={message} />
        </WrapperModal>
      </Modal.Window>
    </Modal>
  );
}

export default Settings;
