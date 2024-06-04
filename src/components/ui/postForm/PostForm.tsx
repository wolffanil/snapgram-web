import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { PostValidation } from "../../../shared/validation";
import { IEditPost, IPost } from "../../../shared/types/post.interface";
import { usePost } from "./usePost";
import { useNavigate } from "react-router-dom";
import Field from "../form-elements/Field";
import FileUploader from "../form-elements/FileUploader";
import Button from "../Button";

interface IPostForm {
  action: "Create" | "Update";
  post?: IPost;
}

function PostForm({ post, action }: IPostForm) {
  const navigate = useNavigate();

  const { control, handleSubmit, reset, setError } = useForm<IEditPost>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
      imageUrl: post ? post?.imageUrl : "",
    },
  });

  const { onSubmit, isLoading } = usePost(action, reset, setError, post?._id);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-9 w-full max-w-[627px]"
    >
      <Field<IEditPost> control={control} name="caption" label="Заголовок" />

      <Controller
        control={control}
        name="file"
        render={({ field: { onChange }, formState: { errors } }) => (
          <>
            <FileUploader
              fieldChange={onChange}
              mediaUrl={post?.imageUrl || ""}
            />
            {errors?.file && errors.file?.message && (
              <p className="shad-form_message mt-[-20px]">
                {errors.file.message}
              </p>
            )}
          </>
        )}
      />

      <Field<IEditPost>
        control={control}
        name="location"
        label="Добавить местоположение"
      />

      <Field<IEditPost> control={control} name="tags" label="Тэги" />

      <div className="flex gap-4 items-center justify-end">
        <Button type="reset" disabled={isLoading} onClick={() => navigate(-1)}>
          Отмена
        </Button>

        <Button
          type="submit"
          className="whitespace-nowrap"
          disabled={isLoading}
        >
          {isLoading
            ? "Загрузка..."
            : `${action === "Create" ? "Создать" : "Обновить"} Пост`}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
