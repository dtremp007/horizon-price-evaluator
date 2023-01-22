import { Box, DefaultProps, Selectors, Text } from "@mantine/core";
import { MouseEventHandler } from "react";
import useStyles, {
  ClusterMarkerStyles,
  ClusterVariant,
} from "./ClusterMarker.styles";

interface ClusterMarkerProps
  extends DefaultProps<Selectors<typeof useStyles>, ClusterMarkerStyles> {
  diameter: number;
  variant: ClusterVariant;
  label: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const ClusterMarker = ({
  classNames,
  styles,
  unstyled,
  className,
  diameter,
  variant,
  label,
  onClick,
  ...others
}: ClusterMarkerProps) => {
  const { classes, cx } = useStyles(
    { diameter, variant },
    {
      name: "ClusterMarker",
      classNames,
      styles,
      unstyled,
    }
  );

  return (
    <Box className={cx(classes.root, className)} onClick={onClick} {...others}>
      {label}
    </Box>
  );
};

export default ClusterMarker;
