import * as z from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Too short" }),

  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  name: z.string().min(2, { message: "Too short" }),
  nick: z.string().min(2, { message: "Too short" }),
  bio: z
    .string()
    .min(5, { message: "Too short" })
    .max(1024, { message: "text must be less then 1024 chart" }),
  file: z.custom<File[]>(),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const PostValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});
