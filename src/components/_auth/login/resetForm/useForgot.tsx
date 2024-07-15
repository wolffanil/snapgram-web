import { useSocketAuth } from "@/context/socketAuth/SocketAuthProvider";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/services/api/getErrorMessage";
import { AuthService } from "@/services/auth/auth.service";
import { IResetPasswordForm } from "@/shared/types/auth.interface,";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { UseFormReset } from "react-hook-form";

export const useForgot = (
  setIsChangeForm: Dispatch<SetStateAction<boolean>>,
  reset: UseFormReset<IResetPasswordForm>
) => {
  const { successToast, errorToast, loadingToast } = useToast();
  const { handleResetPasswordToSocket } = useSocketAuth();
  const [openIsFormReset, setOpenIsFormReset] = useState(false);

  const { mutate: sendForgotPassword, isPending: isSendingForgotPassword } =
    useMutation({
      mutationKey: ["forgot-password"],
      mutationFn: (data: IResetPasswordForm) =>
        AuthService.forgotPassword({
          email: data.email,
        }),
      onSuccess: () => {
        successToast("Код отправлен на почту");
        setOpenIsFormReset(true);
      },
      onError: (error: string) => {
        errorToast(getErrorMessage(error));
      },
    });

  const { mutate: resetPassword, isPending: isResetingPassword } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (data: IResetPasswordForm) =>
      AuthService.resetPassword({
        code: data.code,
        newPassword: data.newPassword,
      }),
    onSuccess: (data) => {
      successToast("Пароль успешно изменён");
      handleResetPasswordToSocket(data.userId);
      setOpenIsFormReset(false);
      setIsChangeForm(false);
      reset();
    },
    onError: (error: string) => {
      errorToast(getErrorMessage(error));
    },
  });

  const onSubmit = async (data: IResetPasswordForm) => {
    loadingToast("Загрузка...");

    if (openIsFormReset) {
      resetPassword(data);
    } else {
      sendForgotPassword(data);
    }
  };

  const isLoading = isResetingPassword || isSendingForgotPassword;

  return useMemo(
    () => ({
      onSubmit,
      isLoading,
      openIsFormReset,
      setOpenIsFormReset,
    }),
    [onSubmit, openIsFormReset, isLoading]
  );
};
