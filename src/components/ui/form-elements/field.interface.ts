import { InputHTMLAttributes } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface IField<T extends FieldValues>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "onBlur"
  > {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
}
