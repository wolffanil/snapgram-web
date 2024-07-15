import { lazy } from "react";

const Login = lazy(() => import("./login/WrapperLogin"));
const Register = lazy(() => import("./register/Register"));

export { Login, Register };
