import * as z from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Слишком короткий" }),

  email: z.string().email({ message: "Почта должна быть каретной" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не менее 8 символов." }),
  code: z.custom<string>(),
});

export const ProfileValidation = z.object({
  name: z.string().min(2, { message: "Слишком короткий" }),
  nick: z.string().min(2, { message: "Слишком короткий" }),
  bio: z
    .string()
    .min(5, { message: "Слишком короткий" })
    .max(1024, { message: "Текст должен быть меньше 1024 диаграммы" }),
  file: z.custom<File[]>(),
});

export const SigninValidation = z.object({
  email: z.string().email({ message: "Почта должна быть каретной" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не менее 8 символов." }),
  code: z.custom<string>(),
});

export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Строка должна содержать не менее 5 символов." })
    .max(100),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(2, { message: "Строка должна содержать не менее 5 символов." })
    .max(100),
  tags: z
    .string({ message: "Теги обязательны" })
    .min(2, { message: "Строка должна содержать не менее 2 символов" }),
});
