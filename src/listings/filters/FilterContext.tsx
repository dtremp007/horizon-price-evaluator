import { createContext, useContext, useEffect, useState } from "react";
import useUser from "../../../lib/auth/useUser";
import { useListings } from "../useListings";
import { getCategories } from "./get-categories";

export type FilterContextType = {
  category: string;
  setCategory: (category: string) => void;
  availableCategories: string[];
  search: string;
  setSearch: (search: string) => void;
    mapStyle: string;
  setMapStyle: (mapStyle: string) => void;
};

const FilterContext = createContext<FilterContextType>({} as FilterContextType);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const {listings} = useListings(!!user);
  const [category, _setCategory] = useState<string>("ALL");
  const [availableCategories, setAvailableCategories] = useState(getCategories(listings));
  const [search, _setSearch] = useState("");
  const [mapStyle, _setMapStyle] = useState("mapbox://styles/mapbox/streets-v11");

  useEffect(() => {
    setAvailableCategories(getCategories(listings));
  }, [listings]);

  const setCategory = (category: string) => {
    _setCategory(category);
  };

  const setMapStyle = (mapStyle: string) => {
    _setMapStyle(mapStyle);
    };

  const setSearch = (search: string) => {
    _setSearch(search);
  };

  return (
    <FilterContext.Provider
      value={{
        category,
        setCategory,
        availableCategories,
        search,
        setSearch,
        mapStyle,
        setMapStyle,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export default function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === null) {
    throw new Error("useFilterContext must be used within a FilterContext");
  }

  return context;
}
