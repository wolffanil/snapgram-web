import { lazy } from "react";

const Login = lazy(() => import("./login/Login"));
const Register = lazy(() => import("./register/Register"));

export { Login, Register };
