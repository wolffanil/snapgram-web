import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/services/api/getErrorMessage";
import { AuthService } from "@/services/auth/auth.service";
import { IResetCode } from "@/shared/types/auth.interface,";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export const useResetCode = (dataUser: IResetCode) => {
  const { successToast, errorToast } = useToast();
  const { mutate: resetCode, isPending } = useMutation({
    mutationKey: ["reset-code"],
    mutationFn: () => AuthService.resetCode(dataUser),
    onSuccess: () => {
      successToast("Код отправлен");
    },
    onError: (error: string) => {
      errorToast(getErrorMessage(error));
    },
  });

  return useMemo(
    () => ({
      resetCode,
      isPending,
    }),
    [resetCode, isPending]
  );
};
