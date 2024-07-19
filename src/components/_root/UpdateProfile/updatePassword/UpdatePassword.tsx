import { Button, ButtonLoader, Field } from "@/components/ui";
import { IUpdatePassword } from "@/shared/types/user.interface";
import { UpdatePasswordValidation } from "@/shared/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdatePassword } from "./useUpdatePassword";

function UpdatePassword() {
  const { control, reset, handleSubmit } = useForm<IUpdatePassword>({
    resolver: zodResolver(UpdatePasswordValidation),
    defaultValues: {
      passwordCurrent: "",
      newPassword: "",
    },
  });

  const { onSubmit, isUpdatingPassword } = useUpdatePassword(reset);

  return (
    <>
      <h2 className="h3-bold md:h2-bold text-left w-full text-main-color">
        Обновить пароль
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-7 w-full max-w-5xl "
      >
        <Field<IUpdatePassword>
          control={control}
          name="passwordCurrent"
          label="пароль"
          type="password"
        />

        <Field<IUpdatePassword>
          control={control}
          name="newPassword"
          label="новый пароль"
          type="password"
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="submit"
            className=" whitespace-nowrap"
            disabled={isUpdatingPassword}
          >
            {isUpdatingPassword ? <ButtonLoader /> : "Обновить"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default UpdatePassword;
