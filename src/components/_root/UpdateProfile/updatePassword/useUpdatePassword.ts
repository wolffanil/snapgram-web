import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/services/api/getErrorMessage";
import { UserService } from "@/services/user.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { IToken } from "@/shared/types/token.interface";
import { IUpdatePassword } from "@/shared/types/user.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "mutative";
import { useMemo } from "react";
import { UseFormReset } from "react-hook-form";
import { useDevices } from "../../Profile/devies/useDevices";

export const useUpdatePassword = (reset: UseFormReset<IUpdatePassword>) => {
  const { sessionId } = useAuth();
  const queryClient = useQueryClient();
  const { loadingToast, successToast, errorToast } = useToast();
  const { handleUpdataPasswordToSocket } = useSocket();
  const { devices } = useDevices();

  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation(
    {
      mutationKey: ["update-password"],
      mutationFn: (data: IUpdatePassword) => UserService.updatePassword(data),
      onSuccess: async () => {
        successToast("Пароль обновлён");
        reset();

        if (!devices) return;

        queryClient.setQueryData([QUERY_KEYS.GET_MY_TOKENS], () => {
          return create(devices, (draft) => {
            return draft.filter((token: IToken) => token._id === sessionId);
          });
        });

        const sessionIds = devices.map((t) => t._id);

        handleUpdataPasswordToSocket(sessionIds);
      },
      onError: (error: string) => {
        errorToast(getErrorMessage(error));
      },
    }
  );

  const onSubmit = (data: IUpdatePassword) => {
    loadingToast("Обновлнение...");

    updatePassword({ ...data, sessionId });
  };

  return useMemo(
    () => ({
      onSubmit,
      isUpdatingPassword,
    }),
    [isUpdatingPassword, onSubmit]
  );
};
