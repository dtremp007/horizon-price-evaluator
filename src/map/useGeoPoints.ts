import { useMemo } from "react";
import { Listing } from "../../lib/types/listings";

type GeoPointOptions = {
  filterBy: string;
};

export function useGeoPoints(
  listings: Listing[],
  { filterBy }: GeoPointOptions
) {
  return useMemo(() => {
    return listings
      .filter(
        (listing) =>
          listing.category.toUpperCase().includes(filterBy) ||
          filterBy === "ALL"
      )
      .map((listing) => {
        const { lat, lng } = listing;

        return {
          type: "Feature",
          properties: {
            cluster: false,
            listingId: listing.id || Math.random(),
            category: listing.category || "No category",
            price: listing.price,
          },
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };
      });
  }, [listings]);
}
