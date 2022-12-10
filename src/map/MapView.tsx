import Map, { MapRef, ViewStateChangeEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Marker } from "react-map-gl";
import { useRef, useState, useContext, useEffect } from "react";
import useSupercluster from "use-supercluster";
import type { BBox } from "geojson";
import { Listing } from "../../lib/types/listings";
import { getAverageCoordinates } from "../../lib/map/get-average-coordinates";
import ListingMarker from "./ListingMarker/ListingMarker";
import ListingPopover from "./ListingPopover/ListingPopover";
import { convertToPrice } from "../../lib/utils/convert-to-price";
import { excludeKeys } from "../../lib/utils/exclude-key";
import { Box, Button, UnstyledButton } from "@mantine/core";

const MAP_INITIAL_ZOOM = 10;
//TODO: Add constraints to how far out use can zoom using turf. Check out this page https://visgl.github.io/react-map-gl/docs/get-started/state-management
//TODO: Produce a popup, when a listing is pressed. Also, make better icons.

type MapViewProps = {
  listings: Listing[];
};

/**
 * Takes in an array of listings.
 *
 * This function takes care of producing a map. Right now, it's full screen,
 * but I'll have to make some changes for desktop. I'm converting the geolocations
 * into GeoJSON Feature objects. This is something I could maybe take care of on the database side.
 *
 * @see https://morioh.com/p/4e3a9a52a0c8 for how I got most of this function.
 */
const MapView = ({ listings }: MapViewProps) => {
  const mapRef = useRef<MapRef>(null);
  const [latitude, longitude] = getAverageCoordinates(listings);
  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom: MAP_INITIAL_ZOOM,
  });
  const [activeMarker, setActiveMarker] = useState(0);

  const points = listings.map((listing) => {
    const { listingType, lat, lng } = listing;

    return {
      type: "Feature",
      properties: {
        cluster: false,
        listingId: listing.id,
        category: listingType,
        price: listing.price,
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };
  });

  const bounds = mapRef.current
    ? (mapRef.current.getMap().getBounds().toArray().flat() as BBox)
    : undefined;

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <Map
      style={{ width: "100%", height: "100%" }}
      reuseMaps
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      ref={mapRef}
      maxZoom={17}
      dragRotate={false}
      onMove={(event: ViewStateChangeEvent) => setViewport(event.viewState)}
      {...viewport}
    >
      {clusters.map((cluster, index) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;
        const listingId = cluster.properties.listingId;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              latitude={latitude}
              longitude={longitude}
            >
              <Box
                sx={(theme) => ({
                  width: `${20 + (pointCount / points.length) * 20}px`,
                  height: `${20 + (pointCount / points.length) * 20}px`,
                  backgroundColor: theme.colors.dark[9],
                  padding: theme.spacing.xs,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  "&:hover": {
                    cursor: "pointer",
                    transform: "scale(1.1)",
                  },
                })}
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );

                  mapRef.current?.easeTo({
                    center: [longitude, latitude],
                    zoom: expansionZoom,
                  });
                }}
              >
                {pointCount}
              </Box>
            </Marker>
          );
        }

        return (
          <Marker
            key={`listing-${listingId}`}
            latitude={latitude}
            longitude={longitude}
            onClick={() => setActiveMarker(index)}
            style={{ zIndex: activeMarker === index ? 1 : 0 }}
          >
            <ListingPopover
              markerProps={{ text: convertToPrice(cluster.properties.price) }}
              listing={excludeKeys(
                listings.find((listing) => listing.id === listingId)!,
                ["lat", "lng", "id", "coordinates"]
              )}
            />
          </Marker>
        );
      })}
    </Map>
  );
};
export default MapView;
