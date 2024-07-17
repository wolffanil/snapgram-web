import { useSocket } from "@/hooks/useSocket";
import { AuthService } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const useScanQr = () => {
  const [qrcode, setQrcode] = useState("");
  const { handleSendTokenQr } = useSocket();

  const { mutate: sendTokenQr, isPending } = useMutation({
    mutationKey: ["send-token"],
    mutationFn: () => AuthService.generateQrToken(),
    onSuccess: (data) => {
      handleSendTokenQr(data.token, qrcode);
      setQrcode("");
    },
  });

  return useMemo(
    () => ({
      qrcode,
      setQrcode,
      sendTokenQr,
      isPending,
    }),
    [qrcode, isPending, setQrcode, sendTokenQr]
  );
};
