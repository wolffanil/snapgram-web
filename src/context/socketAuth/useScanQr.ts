import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/services/api/getErrorMessage";
import { AuthService } from "@/services/auth/auth.service";
import { IAuthResponse } from "@/shared/types/auth.interface,";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const useScanQr = () => {
  const navigate = useNavigate();
  const { setUser, setSessionId } = useAuth();
  const { successToast, errorToast } = useToast();
  const { mutate: sendQrToken, isPending } = useMutation({
    mutationKey: ["send-token"],
    mutationFn: (token: string) => AuthService.scanToken(token),
    onSuccess: async (data: IAuthResponse) => {
      successToast(`Добро пожаловать обратно ${data.userData.name}`);
      setUser(data.userData);
      setSessionId(data.session.id);
      navigate("/");
    },
    onError: (error: string) => {
      errorToast(getErrorMessage(error));
    },
  });

  return useMemo(
    () => ({
      sendQrToken,
      isPending,
    }),
    [isPending, sendQrToken]
  );
};
