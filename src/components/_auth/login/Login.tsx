import { useForm } from "react-hook-form";
import { ILogin } from "../../../shared/types/auth.interface,";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninValidation } from "../../../shared/validation";
import { useLogin } from "./useLogin";
import { Button, ButtonLoader, Field, Logo } from "../../ui";
import { Link } from "react-router-dom";

function Login() {
  const { control, handleSubmit, reset } = useForm<ILogin>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isLoginLoading, onLogin } = useLogin(reset);

  return (
    <>
      <div className="max-sm:max-w-[290px]  flex-center flex-col">
        <Logo />
        <h2 className="h3-bold md:h2-bold text-main-color mt-[24px]">
          Войдите в свой аккаунт
        </h2>

        <p className="text-light-3 small-medium md:base-regular mt-[14px] text-center">
          Добро пожаловать! Пожалуйста, введите свои данные.
        </p>

        <form
          onSubmit={handleSubmit(onLogin)}
          className="flex flex-col w-full mt-[31px] gap-[20px]"
        >
          <Field<ILogin> name="email" label="Email" control={control} />

          <Field<ILogin>
            name="password"
            label="Пароль"
            control={control}
            type="password"
          />

          <Button type="submit" disabled={isLoginLoading} className="mt-[10px]">
            {isLoginLoading ? <ButtonLoader /> : "Войти"}
          </Button>

          <p className="text-small-regular text- text-center mt-[5px] text-main-color">
            У вас нет учетной записи?
            <Link
              to="/register"
              className="text-blue-color text-small-semibold ml-1"
            >
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
