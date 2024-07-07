import { useOutsideClick } from "@/hooks/useOutsideClick";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface IMenusContext {
  openId: string;
  position: {
    x: number;
    y: number;
  } | null;
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
  close: () => void;
  open: Dispatch<SetStateAction<string>>;
}

// const StyledToggle = styled.button`
//   background: none;
//   border: none;
//   padding: 0.4rem;
//   border-radius: var(--border-radius-sm);
//   transform: translateX(0.8rem);
//   transition: all 0.2s;

//   &:hover {
//     background-color: var(--color-grey-100);
//   }

//   & svg {
//     width: 2.4rem;
//     height: 2.4rem;
//     color: var(--color-grey-700);
//   }
// `;

// const StyledList = styled.ul`
//   position: fixed;

//   background-color: var(--color-grey-0);
//   box-shadow: var(--shadow-md);
//   border-radius: var(--border-radius-md);

//   right: ${(props) => props.position.x}px;
//   top: ${(props) => props.position.y}px;
// `;

// const StyledButton = styled.button`
//   width: 100%;
//   text-align: left;
//   background: none;
//   border: none;
//   padding: 1.2rem 2.4rem;
//   font-size: 1.4rem;
//   transition: all 0.2s;

//   display: flex;
//   align-items: center;
//   gap: 1.6rem;

const MenusContext = createContext({} as IMenusContext);

const Menus = ({ children }: { children: ReactNode }) => {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{
        openId,
        close,
        open,
        position,
        setPosition,
      }}
    >
      {children}
    </MenusContext.Provider>
  );
};

const Toggle = ({ id }: { id: string }) => {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handleClick(e: MouseEvent) {
    e.stopPropagation();

    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
  }

  openId === "" || openId !== id ? open(id) : close();

  return <div></div>;
};

function List({ id, children }: { id: string; children: ReactNode }) {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(close, false);

  if (openId !== id) return null;

  return createPortal(
    <ul position={position} ref={ref}>
      {children}
    </ul>,
    document.body
  );
}

function Button({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
}) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <button onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </button>
    </li>
  );
}

//   Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
