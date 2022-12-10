import { createContext, useContext, useState } from "react";

export type FilterContextType = {
  category: string;
  setCategory: (category: string) => void;
  availableCategories: string[];
  setAvailableCategories: (categories: string[]) => void;
  search: string;
  setSearch: (search: string) => void;
};

const FilterContext = createContext<FilterContextType>({} as FilterContextType);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [category, _setCategory] = useState<string>("ALL");
  const [availableCategories, _setAvailableCategories] = useState<string[]>([
    "ALL",
  ]);
  const [search, _setSearch] = useState("");

  const setCategory = (category: string) => {
    _setCategory(category);
  };

  const setAvailableCategories = (categories: string[]) => {
    _setAvailableCategories(categories);
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
        setAvailableCategories,
        search,
        setSearch,
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
