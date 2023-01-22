import { Flex, Loader, Text, Title } from "@mantine/core";
import { useListings } from "../../src/listings/useListings";
import MapView from "../../src/map/MapView";

export default function Home() {
  const { listings, isLoading, error } = useListings();

  if (error)
    return (
      <div>
        <Title>Error</Title>
        <Text>{error.message}</Text>
      </div>
    );

  if (isLoading) return (
    <Flex justify="center" align="center" h="100%">
        <Loader />
    </Flex>
  )


  return <MapView listings={listings!} />;
}
