import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IUser } from "../shared/types/user.interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("ru-RU", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} в ${time}`;
}

//
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} день назад
      `;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} дней назад`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} 
      несколько часов назад`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} минут назад`;
    default:
      return "Прямо сейчас";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export const getMedia = (path: string) =>
  import.meta.env.VITE_SERVER_URL + "/" + path;

export function getСompanion(users: IUser[], myId: string): number {
  return Number(users[0]?._id === myId);
}

function formatTodayDate(date: Date): string {
  const now = new Date();

  // Проверяем, совпадают ли годы, месяцы и дни
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (!isToday) {
    throw new Error("Переданная дата не является сегодняшним днем");
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Форматируем часы и минуты, чтобы добавлять ведущие нули, если нужно
  const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

  return `Сегодня, ${formattedHours}:${formattedMinutes}`;
}
