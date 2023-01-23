import { Flex, SegmentedControl, Select, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { MAP_STYLES } from "../../map/MapView";
import useFilterContext from "./FilterContext";

export default function ListingFilters() {
  const { category, setCategory, availableCategories } = useFilterContext();

  const [mapStyle, setMapStyle] = useLocalStorage({
    key: "map-style",
    defaultValue: MAP_STYLES.Street,
  });

  return (
    <Flex direction="column">
      <Select
        label="Category"
        value={category}
        onChange={(value) => setCategory(value || "ALL")}
        data={availableCategories}
      />
      <Flex direction="column" gap={6}>
        <Text align="center">Map Style</Text>
        <SegmentedControl
          value={mapStyle}
          onChange={(value) => setMapStyle(value)}
          data={[
            { label: "Street", value: MAP_STYLES.Street },
            {
              label: "Satellite",
              value: MAP_STYLES.Satellite,
            },
          ]}
        />
      </Flex>
    </Flex>
  );
}
