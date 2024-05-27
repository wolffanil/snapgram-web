import { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "clsx";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
}

function Button({ className, children, ...rest }: IButton) {
  return (
    <button
      className={cn("shad-button_primary blue-color", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
