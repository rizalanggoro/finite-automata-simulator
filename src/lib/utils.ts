import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStrings = (str: string, delimiter: string): string[] => {
  if (str.trim().length > 0) {
    return str.split(delimiter).filter((it) => it.trim().length > 0);
  }

  return [];
};

export const generateRandomStrings = (characters: string, length: number) => {
  let result = "";
  for (let a = 0; a < length; a++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
};
