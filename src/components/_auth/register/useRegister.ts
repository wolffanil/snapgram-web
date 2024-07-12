import { useMutation } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { IRegister } from "@/shared/types/auth.interface,";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { AuthService } from "@/services/auth/auth.service";
import { getErrorMessage } from "@/services/api/getErrorMessage";

export const useRegister = (reset: UseFormReset<IRegister>) => {
  const [openIsFormCode, setIsOpenFormCode] = useState(false);
  const { loadingToast, successToast, errorToast } = useToast();
  const { setUser, setSessionId } = useAuth();
  const navigate = useNavigate();

  const { mutate: register, isPending: isRegisterLoading } = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: IRegister) => AuthService.register(data),
    onSuccess: (data) => {
      if (!openIsFormCode) {
        successToast("Код отправлен на почту");
        setIsOpenFormCode(true);
        return;
      }

      reset();
      successToast("Вы успешно зарегистрировались");
      setUser(data.userData);
      setSessionId(data.session.id);

      navigate("/");
    },
    onError: (error: string) => {
      errorToast(getErrorMessage(error));
    },
  });

  const onRegister = (data: IRegister) => {
    if (openIsFormCode && !data.code?.length) return;
    loadingToast("Регистрация...");
    register(data);
  };

  return useMemo(
    () => ({
      onRegister,
      isRegisterLoading,
      openIsFormCode,
    }),
    [isRegisterLoading, onRegister, openIsFormCode]
  );
};
