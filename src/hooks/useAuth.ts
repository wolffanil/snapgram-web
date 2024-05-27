import { useContext } from "react";
import { AuthContext } from "../context/auth/AuthProvider";

export const useAuth = () => useContext(AuthContext);
