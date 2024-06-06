import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupValidation } from "../../../shared/validation";
import { IRegister } from "../../../shared/types/auth.interface,";
import { useRegister } from "./useRegister";
import { Button, ButtonLoader, Field } from "../../ui";
import { Link } from "react-router-dom";

function Register() {
  const { control, handleSubmit, reset } = useForm<IRegister>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const { onRegister, isRegisterLoading } = useRegister(reset);

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
          <Field<IRegister> name="name" label="Имя" control={control} />

          <Field<IRegister> name="email" label="Email" control={control} />

          <Field<IRegister>
            name="password"
            label="Пароль"
            control={control}
            type="password"
          />

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
