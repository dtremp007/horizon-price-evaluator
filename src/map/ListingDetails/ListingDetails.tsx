import { Anchor, Image, Table } from "@mantine/core";
import { Listing } from "../../../lib/types/listings";
import { excludeKeys } from "../../../lib/utils/exclude-key";
import { convertToPrice } from "../../../lib/utils/convert-to-price";

type ListingDetailsProps = {
  listing: Partial<Listing>;
  hiddenProperties?: (keyof Listing)[];
};

const ListingDetails = ({ listing, hiddenProperties }: ListingDetailsProps) => {

  return (
    <>
      {listing.thumbnail && (
        <Image height={100} fit="contain" src={listing.thumbnail} />
      )}
      <Anchor href={listing.url} target="_blank" size="sm">{listing.title}</Anchor>
      <Table>
        <tbody>
          {Object.entries(excludeKeys(listing, hiddenProperties))
          .map(([key, value]) => key === "price" ? [key, convertToPrice(value)] : [key, value])
          .map(
            ([key, value]) => {
              return (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
    </>
  );
};
export default ListingDetails;
