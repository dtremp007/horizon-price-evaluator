import {
  Box,
  DefaultProps,
  Selectors,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { forwardRef, MouseEventHandler } from "react";
import { Marker } from "react-map-gl";
import { convertToPrice } from "../../../lib/utils/convert-to-price";
import useStyles from "./ListingMarker.styles";

export interface ListingMarkerProps
  extends DefaultProps<Selectors<typeof useStyles>> {
  text: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  active?: boolean;
}

const ListingMarker = forwardRef<HTMLDivElement, ListingMarkerProps>(
  (
    {
      classNames,
      styles,
      unstyled,
      className,
      text,
      onClick,
      active,
      ...others
    },
    ref
  ) => {
    const { classes, cx } = useStyles(void 0, {
      name: "ListingMarker",
      classNames,
      styles,
      unstyled,
    });

    return (
      <Box
        className={cx(classes.root, className)}
        ref={ref}
        data-active={active || undefined}
        onClick={onClick}
        {...others}
      >
        <Text>{text}</Text>
      </Box>
    );
  }
);

ListingMarker.displayName = "ListingMarker";

export default ListingMarker;
