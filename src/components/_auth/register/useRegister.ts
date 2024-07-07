import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../../../services/auth/auth.service";
import { IRegister } from "../../../shared/types/auth.interface,";
import { useAuth } from "../../../hooks/useAuth";
import { UseFormReset } from "react-hook-form";
import { useToast } from "../../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../services/api/getErrorMessage";
import { useMemo } from "react";

export const useRegister = (reset: UseFormReset<IRegister>) => {
  const { loadingToast, successToast, errorToast } = useToast();
  const { setUser, setSessionId } = useAuth();
  const navigate = useNavigate();

  const { mutate: register, isPending: isRegisterLoading } = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: IRegister) => AuthService.register(data),
    onSuccess: (data) => {
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
    loadingToast("Регистрация...");
    register(data);
  };

  return useMemo(
    () => ({
      onRegister,
      isRegisterLoading,
    }),
    [isRegisterLoading, onRegister]
  );
};
