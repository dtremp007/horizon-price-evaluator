import useSWR from "swr";
import { Listing } from "../../lib/types/listings";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (res.status !== 200) {
    const error = new Error((await res.json()).message || "Failed to fetch");
    throw error;
  }
  return res.json();
};

export function useListings(shouldFetch: boolean = true) {
  const { data, error } = useSWR<Listing[]>(shouldFetch ? '/api/listings' : null, fetcher)

  return {
    listings: data,
    isLoading: !error && !data,
    error,
  }
}
