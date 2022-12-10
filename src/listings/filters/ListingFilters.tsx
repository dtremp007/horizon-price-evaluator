import { Select } from "@mantine/core";
import useFilterContext from "../filter-context/FilterContext";

export default function ListingFilters() {
  const { category, setCategory, availableCategories, search, setSearch } =
    useFilterContext();

  return (
    <div>
      <Select
        label="Category"
        value={category}
        onChange={(value) => setCategory(value || "ALL")}
        data={availableCategories}
      />
    </div>
  );
}
