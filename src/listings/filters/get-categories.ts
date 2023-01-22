import { Listing } from "../../../lib/types/listings";

export function getCategories(listings?: Listing[]) {
  const categories = new Set(["ALL"]);

  if (listings && listings.length > 0) {
    for (const listing of listings) {
      listing.category
        .split(",")
        .map((category) => category.trim().toUpperCase())
        .forEach((category) => categories.add(category));
    }
  }

  return Array.from(categories);
}
