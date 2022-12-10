import { Box, DefaultProps, Selectors, Text } from "@mantine/core";
import { Marker } from "react-map-gl";
import useStyles from "./ClusterMarker.styles";

interface ClusterMarkerProps extends DefaultProps<Selectors<typeof useStyles>> {
  price: number;
}

const ClusterMarker = ({
  classNames,
  styles,
  unstyled,
  className,
  price,
  ...others
}: ClusterMarkerProps) => {
  const { classes, cx } = useStyles(void 0, {
    name: "MyComponent",
    classNames,
    styles,
    unstyled,
  });

  return (
    <Marker>
      <Box className={cx(classes.root, className)} {...others}>
        <Text>{price}</Text>
      </Box>
    </Marker>
  );
};

export default ClusterMarker;
