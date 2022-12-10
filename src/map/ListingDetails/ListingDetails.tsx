import { Table } from "@mantine/core";
import { Listing } from "../../../lib/types/listings";

type ListingDetailsProps = {
  listing: Partial<Listing>;
};

const ListingDetails = ({ listing }: ListingDetailsProps) => {
  return (
    <Table>
      <tbody>
        {Object.entries(listing).map(([key, value]) => {
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
export default ListingDetails;
