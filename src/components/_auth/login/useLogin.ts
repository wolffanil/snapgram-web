import { UseFormReset } from "react-hook-form";
import { ILogin } from "../../../shared/types/auth.interface,";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../../../services/auth/auth.service";
import { getErrorMessage } from "../../../services/api/getErrorMessage";
import { useMemo } from "react";
import { useToast } from "../../../hooks/useToast";

export const useLogin = (reset: UseFormReset<ILogin>) => {
  const { loadingToast, successToast, errorToast } = useToast();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: ILogin) => AuthService.login(data),
    onSuccess: (data) => {
      reset();

      successToast(`Добро пожаловать обратно ${data.userData.name}`);
      setUser(data.userData);
      navigate("/");
    },
    onError: (error: string) => {
      errorToast(getErrorMessage(error));
    },
  });

  const onLogin = (data: ILogin) => {
    loadingToast("Вход...");
    login(data);
  };

  return useMemo(
    () => ({
      onLogin,
      isLoginLoading,
    }),
    [isLoginLoading, onLogin]
  );
};
