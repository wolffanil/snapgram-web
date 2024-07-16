import { Button, ButtonLoader, Field, Logo } from "@/components/ui";
import { IResetPasswordForm } from "@/shared/types/auth.interface,";
import { ResetPasswordValidation } from "@/shared/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useForgot } from "./useForgot";
import { IChangeForm } from "../openResetForm.interface";

function ForgotLogin({ setIsChangeForm }: IChangeForm) {
  const { control, reset, handleSubmit, setError } =
    useForm<IResetPasswordForm>({
      resolver: zodResolver(ResetPasswordValidation),
      defaultValues: {
        email: "",
        code: "",
        confirmNewPassword: "",
        newPassword: "",
      },
    });

  const { openIsFormReset, isLoading, onSubmit } = useForgot(
    setIsChangeForm,
    setError,
    reset
  );

  return (
    <div className="max-sm:max-w-[290px]  flex-center flex-col">
      <Logo />
      <h2 className="h3-bold md:h2-bold text-main-color mt-[24px]">
        Восстановление доступа
      </h2>

      <p className="text-light-3 small-medium md:base-regular mt-[14px] text-center">
        Сброс пароля: восстановление безопасного доступа.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full mt-[31px] gap-[20px]"
      >
        <Field<IResetPasswordForm>
          name="email"
          label="Email"
          control={control}
          disabled={isLoading || openIsFormReset}
        />

        {openIsFormReset && (
          <>
            <Field<IResetPasswordForm>
              name="code"
              control={control}
              label="Код"
              disabled={isLoading}
              required
            />

            <Field<IResetPasswordForm>
              name="newPassword"
              control={control}
              label="Пароль"
              disabled={isLoading}
              type="password"
            />

            <Field<IResetPasswordForm>
              name="confirmNewPassword"
              control={control}
              label="Повторить пароль"
              disabled={isLoading}
              type="password"
            />
          </>
        )}

        <Button type="submit" disabled={isLoading} className="mt-[10px]">
          {isLoading ? (
            <ButtonLoader />
          ) : openIsFormReset ? (
            "Сбросить пароль"
          ) : (
            "Отправить код"
          )}
        </Button>

        <p className="text-small-regular text- text-center mt-[5px] text-main-color">
          Вспомнили пароль?
          <button
            className="text-blue-color text-small-semibold ml-1"
            onClick={() => setIsChangeForm(false)}
            disabled={isLoading}
          >
            Вернуться
          </button>
        </p>
      </form>
    </div>
  );
}

export default ForgotLogin;
