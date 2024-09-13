import { lazy } from "react";

const Login = lazy(() => import("./login/WrapperLogin"));
const Register = lazy(() => import("./register/Register"));
const Politic = lazy(() => import("./politic/Politic"));

export { Login, Register, Politic };
