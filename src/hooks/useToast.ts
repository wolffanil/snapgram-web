import { useState } from "react";
import toast from "react-hot-toast";

export const useToast = () => {
  const [toastId, setToastId] = useState("");

  const loadingToast = (message: string) => {
    const id = toast.loading(message);
    setToastId(id);
  };

  const successToast = (message: string) => {
    toast.success(message, { id: toastId });
  };

  const errorToast = (message: string) => {
    toast.error(message, {
      id: toastId,
    });
  };

  return { loadingToast, successToast, errorToast };
};
