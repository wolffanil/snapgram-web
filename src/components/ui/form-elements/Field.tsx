import { Controller } from "react-hook-form";
import { IField } from "./field.interface";
import cn from "clsx";

const Field = <T extends Record<string, any>>({
  control,
  name,
  label,
  className,
  ...rest
}: IField<T>): JSX.Element => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <div className={cn("flex flex-col w-full items-start", className)}>
            <label className=" text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-second-color mb-[9px] ">
              {label}
            </label>
            <input
              onBlur={onBlur}
              onChange={onChange}
              value={value || ""}
              className="shad-input bg-second-color text-main-color"
              {...rest}
            />
            {error && (
              <p className="shad-form_message mt-[8px]">{error.message}</p>
            )}
          </div>
        </>
      )}
    />
  );
};

export default Field;
