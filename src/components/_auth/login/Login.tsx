import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "./useLogin";
import { Link } from "react-router-dom";
import { SigninValidation } from "@/shared/validation";
import { ILogin } from "@/shared/types/auth.interface,";
import { Button, ButtonLoader, Field, Logo, ResetCode } from "@/components/ui";

function Login() {
  const { control, handleSubmit, reset, watch } = useForm<ILogin>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dataUser = watch(["email", "password"]);

  const { isLoginLoading, onLogin, openIsFormCode } = useLogin(reset);

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
          <Field<ILogin>
            name="email"
            label="Email"
            control={control}
            disabled={openIsFormCode}
          />

          <Field<ILogin>
            name="password"
            label="Пароль"
            control={control}
            type="password"
            disabled={openIsFormCode}
          />

          {openIsFormCode && (
            <ResetCode
              control={control}
              name="code"
              label="Код"
              dataUser={{
                email: dataUser[0],
                password: dataUser[1],
              }}
            />
          )}

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
