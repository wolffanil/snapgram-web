import { Html5QrcodeScanner } from "html5-qrcode";

import { Modal, WrapperModal } from "@/components/ui";
import { useScanQr } from "./useScanQr";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

function ButtonScanQr() {
  const { qrcode, setQrcode, isPending, sendTokenQr } = useScanQr();
  const [clickButton, setClickButton] = useState(false);
  let scanner: any;

  useEffect(() => {
    if (clickButton) {
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 2,
          aspectRatio: 1,
        },
        false
      );

      scanner.render(handleScan, handleError);

      function handleScan(data) {
        if (data) {
          setQrcode(data);
          sendTokenQr();
          scanner.clear();
        }
      }

      function handleError(error) {
        // toast.error(error);
      }
    }

    // Очистка ресурса при размонтировании компонента или закрытии модала
    return () => {
      if (scanner) {
        scanner.clear().catch((error) => {
          console.error("Scanner cleaning failed", error);
        });
      }
    };
  }, [clickButton]);

  return (
    <Modal handleClose={() => setClickButton((o) => !o)}>
      <Modal.Open opens="scanqrcode">
        <button
          className="blue-color flex text-white small-medium  h-12 justify-center items-center w-full rounded-lg mt-[30px] gap-x-[8px] max-sm:h-[40px]"
          onClick={() => setClickButton((o) => !o)}
        >
          Войти по Qrcode
        </button>
      </Modal.Open>
      <Modal.Window name="scanqrcode">
        <WrapperModal title="сканирование" containerStyle="max-sm:w-[310px]">
          <div className="w-full h-full">
            {!qrcode && !isPending ? (
              <div id="reader" className="w-full h-full text-main-color"></div>
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <Loader className="invert-black dark:invert-white" />
              </div>
            )}
          </div>
        </WrapperModal>
      </Modal.Window>
    </Modal>
  );
}

export default ButtonScanQr;
