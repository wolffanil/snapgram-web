import { ITimestamps } from "./timestamps.interface";

export interface IToken extends ITimestamps {
  _id: string;
  userId: string;
  browser: string;
  device: string;
  brand: string;
  model: string;
  type: typeDevice;
  ip: string;
}

export type typeDevice = "browser" | "mobile";
