import { nanoid } from "nanoid";

export function generateId(length = 21): string {
  return nanoid(length);
}

export function generateShortId(length = 12): string {
  return nanoid(length);
}

export function generateSlugId(length = 8): string {
  return nanoid(length).toLowerCase();
}
