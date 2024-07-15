import { Dispatch, SetStateAction } from "react";

export interface IChangeForm {
  isChangeForm: boolean;
  setIsChangeForm: Dispatch<SetStateAction<boolean>>;
}
