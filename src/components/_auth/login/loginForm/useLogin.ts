import { UseFormReset } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ILogin } from "@/shared/types/auth.interface,";
import { useToast } from "@/hooks/useToast";
import { AuthService } from "@/services/auth/auth.service";
import { getErrorMessage } from "@/services/api/getErrorMessage";
import { useSocketAuth } from "@/context/socketAuth/SocketAuthProvider";
import useRecaptchaV3 from "@/hooks/useRecaptchaV3";

const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export const useLogin = (reset: UseFormReset<ILogin>) => {
  const executeRecaptcha = useRecaptchaV3(recaptchaKey);

  const [openIsFormCode, setIsOpenFormCode] = useState(false);
  const { loadingToast, successToast, errorToast } = useToast();
  const { setUser, setSessionId } = useAuth();
  const navigate = useNavigate();
  const { handleTrySignInToSocket, handleSignIn } = useSocketAuth();

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: ILogin) => AuthService.login(data),
    onSuccess: async (data) => {
      if (!openIsFormCode) {
        successToast("Код отправлен на почту");
        setIsOpenFormCode(true);
        return;
      }

      handleSignIn(data.userData._id);
      await new Promise((res) => setTimeout(res, 1000));

      reset();
      successToast(`Добро пожаловать обратно ${data.userData.name}`);
      setUser(data.userData);
      setSessionId(data.session.id);
      navigate("/");
      setIsOpenFormCode(false);
    },
    onError: (error: string, dataForm) => {
      errorToast(getErrorMessage(error));
      handleTrySignInToSocket(dataForm.email);
    },
  });

  const onLogin = async (data: ILogin) => {
    if (openIsFormCode && !data.code?.length) return;
    loadingToast("Вход...");

    const recaptchaToken = await executeRecaptcha("auth");

    login({ ...data, token: recaptchaToken });
  };

  return useMemo(
    () => ({
      onLogin,
      isLoginLoading,
      openIsFormCode,
      setIsOpenFormCode,
    }),
    [isLoginLoading, onLogin, openIsFormCode]
  );
};
