import { DefaultProps, Popover } from "@mantine/core";
import { useState } from "react";
import { Listing } from "../../../lib/types/listings";
import ListingDetails from "../ListingDetails/ListingDetails";
import ListingMarker, {
  ListingMarkerProps,
} from "../ListingMarker/ListingMarker";

interface ListingPopoverProps extends DefaultProps {
  markerProps: ListingMarkerProps;
  listing: Partial<Listing>;
}

const ListingPopover = ({ markerProps, listing }: ListingPopoverProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <ListingMarker
          {...markerProps}
          active={opened}
          onClick={() => setOpened((o) => !o)}
        />
      </Popover.Target>
      <Popover.Dropdown style={{zIndex: 999}}>
        <ListingDetails listing={listing} />
      </Popover.Dropdown>
    </Popover>
  );
};
export default ListingPopover;
