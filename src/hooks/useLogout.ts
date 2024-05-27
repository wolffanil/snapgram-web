import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { AuthService } from "../services/auth/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useLogout = () => {
  const { setUser, setIsAuth } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLogoutLoading } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      setUser(null);
      setIsAuth(false);
      queryClient.removeQueries();
      navigate("/login", { replace: true });
      window.history.forward();
    },
  });

  return useMemo(
    () => ({
      logout,
      isLogoutLoading,
    }),
    [logout, isLogoutLoading]
  );
};
