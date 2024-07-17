import { Button, Loader, Modal, WrapperModal } from "@/components/ui";
import { useSocketAuth } from "@/context/socketAuth/SocketAuthProvider";
import { useEffect, useState } from "react";
import QRcode from "qrcode.react";

function ButtonQr() {
  const [qr, setQr] = useState("");
  const { handleCreateRoomQr, handleDeleteRoomQR, isScaningQR } =
    useSocketAuth();

  useEffect(() => {
    const getCode = () => {
      const generateCode = () =>
        Math.floor(1000 + Math.random() * 9000).toString();
      const code = generateCode();

      if (qr) handleDeleteRoomQR(qr);

      setQr(code);
      handleCreateRoomQr(code);
    };

    getCode();

    return () => {
      if (!qr) return;
      handleDeleteRoomQR(qr);
    };
  }, []);

  return (
    <Modal>
      <Modal.Open opens="qrcode">
        <Button type="button" className="mt-[10px] w-full">
          Войти по QrCode
        </Button>
      </Modal.Open>

      <Modal.Window name="qrcode">
        <WrapperModal
          title="сканируй qrcode"
          containerStyle="w-[320px] min-h-[280px] max-sm:max-w-[310px] max-sm:h-[375px] "
        >
          <div className="flex justify-center items-center w-full h-full max-sm:h-[280px]">
            {!isScaningQR ? (
              <QRcode
                id="myqr"
                value={qr}
                size={300}
                includeMargin={true}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div>
                <Loader className="invert-black dark:invert-white" />
              </div>
            )}
          </div>
        </WrapperModal>
      </Modal.Window>
    </Modal>
  );
}

export default ButtonQr;
