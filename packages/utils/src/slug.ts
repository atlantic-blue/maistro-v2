import slugifyLib from "slugify";
import { generateSlugId } from "./id";

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function createUniqueSlug(text: string): string {
  const baseSlug = slugify(text);
  const uniqueId = generateSlugId();
  return `${baseSlug}-${uniqueId}`;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
