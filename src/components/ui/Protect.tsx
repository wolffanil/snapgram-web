import { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

function Protect({
  children,
  isProtect,
}: {
  children: ReactNode;
  isProtect: boolean;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  if (isProtect && user?.name) return children;

  if (!isProtect && !user?.name) return children;

  if (user?.name) return <Navigate to="/" />;
  else return <Navigate to="/login" />;
}

export default Protect;
