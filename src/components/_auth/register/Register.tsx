import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "./useRegister";
import { Link } from "react-router-dom";
import { IRegister } from "@/shared/types/auth.interface,";
import { SignupValidation } from "@/shared/validation";
import { Button, ButtonLoader, Field, ResetCode } from "@/components/ui";

function Register() {
  const { control, handleSubmit, reset, watch } = useForm<IRegister>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const { onRegister, isRegisterLoading, openIsFormCode } = useRegister(reset);

  const dataUser = watch(["email", "password"]);

  return (
    <div>
      <div className=" max-sm:max-w-[290px] flex-center flex-col">
        <h2 className="h3-bold md:h2-bold text-main-color">
          Создать новый аккаунт{" "}
        </h2>

        <p className="text-light-3 small-medium md:base-regular text-center">
          Чтобы использовать Snapgram, введите свои данные
        </p>

        <form
          onSubmit={handleSubmit(onRegister)}
          className="flex flex-col w-full mt-[31px] gap-[25px]"
        >
          <Field<IRegister>
            name="name"
            label="Имя"
            control={control}
            disabled={openIsFormCode}
          />

          <Field<IRegister>
            name="email"
            label="Email"
            control={control}
            disabled={openIsFormCode}
          />

          <Field<IRegister>
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

          <Button
            type="submit"
            disabled={isRegisterLoading}
            className="mt-[5px]"
          >
            {isRegisterLoading ? <ButtonLoader /> : "Зарегистрироваться"}
          </Button>

          <p className="text-small-regular text- text-center mt-[20px] text-main-color">
            Есть аккаунт?
            <Link
              to="/login"
              className="text-blue-color text-small-semibold ml-1"
            >
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
