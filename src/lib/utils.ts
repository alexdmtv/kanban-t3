import { type ClassValue, clsx } from "clsx";
import { type NextRouter } from "next/router";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  classGroups: {
    "font-size": [
      {
        text: [
          "heading-xl",
          "heading-l",
          "heading-m",
          "heading-s",
          "body-l",
          "body-m",
        ],
      },
    ],
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export function removeQueryKeyFromUrl(router: NextRouter, key: string) {
  const query = { ...router.query };
  delete query[key];

  void router.push({
    query: {
      ...query,
    },
  });
}
