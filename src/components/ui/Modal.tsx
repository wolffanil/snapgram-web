import {
  cloneElement,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface IModalContext {
  openName: string;
  close: () => void;
  open: Dispatch<SetStateAction<string>>;
}

const ModalContext = createContext({} as IModalContext);

const Modal = ({ children }: { children: React.ReactNode }) => {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider
      value={{
        openName,
        close,
        open,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

const Open = ({
  children,
  opens: opensWindowName,
}: {
  children: React.ReactNode;
  opens: string;
}) => {
  const { open } = useContext(ModalContext);

  // return cloneElement(children, { onOpenModal: () => open(opensWindowName) });
  return <div onClick={() => open(opensWindowName)}>{children}</div>;
};

const Window = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) => {
  const { openName, close } = useContext(ModalContext);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-screen backdrop:blur-[10px] z-[1000] transition-all duration-500 bg-backdrop">
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-all duration-500">
        {cloneElement(children, { onCloseModal: close })}
      </div>
    </div>,
    document.body
  );
};

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
