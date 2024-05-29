import { Controller, useForm } from "react-hook-form";
import { IEditUser } from "../../../shared/types/user.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileValidation } from "../../../shared/validation";
import { useUpdateProfile } from "./useUpdatProfile";
import { useAuth } from "../../../hooks/useAuth";
import { useTheme } from "../../../hooks/useTheme";
import { Button, ButtonLoader, Field, ProfileUploader } from "../../ui";

function UpdateProfile() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { setValue, reset, control, handleSubmit } = useForm<IEditUser>({
    resolver: zodResolver(ProfileValidation),
  });
  const { isUpdatingProfile, onSubmit } = useUpdateProfile(setValue, reset);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className={isDarkMode ? "invert-white" : "invert-black"}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full text-main-color">
            Редактировать профиль
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-7 w-full mt-4 max-w-5xl "
        >
          <Controller
            control={control}
            name="file"
            render={({ field: { onChange } }) => (
              <div className="mr-auto">
                <ProfileUploader
                  fieldChange={onChange}
                  mediaUrl={user?.imageUrl || ""}
                />
              </div>
            )}
          />

          <Field<IEditUser> control={control} name="name" label="Имя" />

          <Field<IEditUser> control={control} name="nick" label="Ник" />

          <Field<IEditUser>
            control={control}
            name="email"
            label="Email"
            disabled={true}
          />

          <Controller
            control={control}
            name="bio"
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => (
              <div className={"flex flex-col w-full items-start"}>
                <label className=" text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-second-color mb-[9px] ">
                  Биография
                </label>
                <textarea
                  className="shad-textarea custom-scrollbar bg-second-color text-main-color shad-input w-full"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ""}
                />

                {errors.bio && errors.bio.message && (
                  <p className="shad-form_message mt-[8px]">
                    {errors.bio.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex gap-4 items-center justify-end">
            <Button
              type="submit"
              className=" whitespace-nowrap"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile && <ButtonLoader />}
              Обновить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
