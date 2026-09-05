import { PublicationProps } from "../Interfaces";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Attach the first-page image path to entries whose id has a generated PNG. */
export function withThumbnails<T extends PublicationProps>(
  list: T[],
  thumbnailIds: string[],
): T[] {
  return list.map((p) =>
    p.id && thumbnailIds.includes(p.id)
      ? { ...p, thumbnail: `${BASE_PATH}/imgs/publications/${p.id}.png` }
      : p,
  );
}
