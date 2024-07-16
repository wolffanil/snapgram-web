import { useAuth } from "@/hooks/useAuth";
import { SOCKET_AUTH_KEYS } from "@/shared/enums/socketKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const SocketAuthHelper = (socket: any) => {
  const { deleteUser } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /// on ResetPassword
  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_AUTH_KEYS.RESET_PASSWORD, () => {
      deleteUser();
      queryClient.clear();
      navigate("/login");
    });

    return () => {
      socket.off(SOCKET_AUTH_KEYS.RESET_PASSWORD);
    };
  }, [socket]);

  // on try sign in

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_AUTH_KEYS.TRY_SIGN_IN_YOUR_ACCOUNT, () => {
      toast(
        (t) => (
          <div className="flex justify-between items-center w-[220px] max-h-[50px] max-sm:max-h-[30px] max-sm:max-w-[200px] text-white text-[16px] max-sm:text-[14px]">
            ❗ Попытка входа в аккаунт
          </div>
        ),
        { duration: 3000 }
      );
    });

    return () => {
      socket.off(SOCKET_AUTH_KEYS.TRY_SIGN_IN_YOUR_ACCOUNT);
    };
  }, [socket]);
};
