import Map, { MapRef, ViewStateChangeEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Marker, Popup } from "react-map-gl";
import { useRef, useState, useEffect, useCallback } from "react";
import useSupercluster from "use-supercluster";
import type { BBox } from "geojson";
import { Listing } from "../../lib/types/listings";
import { getAverageCoordinates, getMedianCoordinates } from "../../lib/map/get-average-coordinates";
import ListingMarker from "./ListingMarker/ListingMarker";
import ListingPopover from "./ListingPopover/ListingPopover";
import { convertToPrice } from "../../lib/utils/convert-to-price";
import { ActionIcon, Box, Button, UnstyledButton } from "@mantine/core";
import { registerSpotlightActions, useSpotlight } from "@mantine/spotlight";
import getPropertyCaseInsensitive from "../../lib/utils/get-property-case-insensitive";
import ListingDetails from "./ListingDetails/ListingDetails";
import AddListingModal from "./AddListingModel/AddListingModal";
import { IconPlus } from "@tabler/icons";
import { mutate } from "swr";
import useFilterContext from "../listings/filters/FilterContext";
import { useGeoPoints } from "./useGeoPoints";
import ClusterMarker from "./ClusterMarker/ClusterMarker";
import {
  useEventListener,
  useLocalStorage,
  useWindowEvent,
} from "@mantine/hooks";

const MAP_INITIAL_ZOOM = 10;
export const MAP_STYLES = {
  Street: "mapbox://styles/mapbox/streets-v11",
  Satellite: "mapbox://styles/mapbox/satellite-streets-v12",
};

const getInitialViewport = (listings: Listing[]) => {
    const [lat, lng] = getMedianCoordinates(listings);
    return {
        latitude: lat,
        longitude: lng,
        zoom: MAP_INITIAL_ZOOM,
    };
};

/**
 * TODO:
 * - Create a usePoints hook that takes in listings and returns points.
 * - Moved mutating logic to AddListingModal.
 * - Try to get satellite view
 */

/**
 * Takes in an array of listings.
 *
 * This function takes care of producing a map. Right now, it's full screen,
 * but I'll have to make some changes for desktop. I'm converting the geolocations
 * into GeoJSON Feature objects. This is something I could maybe take care of on the database side.
 *
 * @see https://morioh.com/p/4e3a9a52a0c8 for how I got most of this function.
 */
const MapView = ({ listings }: { listings: Listing[] }) => {
  const mapRef = useRef<MapRef>(null);
  const [viewport, setViewport] = useLocalStorage({
    key: "map-view",
    defaultValue: getInitialViewport(listings),
  });
  const [mapStyle, setMapStyle] = useLocalStorage({
    key: "map-style",
    defaultValue: MAP_STYLES.Street,
  });
  const { category } = useFilterContext();
  const [activeMarker, setActiveMarker] = useState(0);
  const [createListing, setCreateListing] = useState({
    active: false,
    modalOpen: false,
    lat: 0,
    lng: 0,
  });
  const resetCreateListing = () => {
    setCreateListing((prev) => ({
      ...prev,
      active: false,
      modalOpen: false,
    }));
  };

  useWindowEvent("keydown", (event) => {
    if (event.key === "Escape") resetCreateListing();
  });

  const safeEaseTo = useCallback(
    (options: mapboxgl.EaseToOptions) => {
      if (mapRef.current) {
        mapRef.current.getMap().easeTo(options);
      }
    },
    [mapRef.current]
  );

  useEffect(() => {
    if (window !== undefined) {
      registerSpotlightActions(
        listings.map((listing, index) => ({
          id: listing.id,
          title: getPropertyCaseInsensitive(listing, "title")
            ? getPropertyCaseInsensitive(listing, "title")
            : `${getPropertyCaseInsensitive(listing, "type") || "Property"} ${
                getPropertyCaseInsensitive(listing, "campo") ||
                "at unspecified location"
              }`,
          description:
            convertToPrice(getPropertyCaseInsensitive(listing, "price")) ||
            undefined,
          onTrigger: () =>
            safeEaseTo({
              center: [listing.lng, listing.lat],
              zoom: 14,
            }),
        }))
      );
    }
  }, [listings]);

  const points = useGeoPoints(listings, { filterBy: category });

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
      mapStyle={mapStyle}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      ref={mapRef}
      maxZoom={17}
      dragRotate={false}
      onMove={(event: ViewStateChangeEvent) => setViewport(event.viewState)}
      onMouseDown={(e) => {
        // Check if user was holding down cmd or ctrl
        if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
          e.preventDefault();

          setCreateListing({
            active: true,
            modalOpen: false,
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
          });
        }
      }}
      {...viewport}
    >
      <>
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
                <ClusterMarker
                  variant={mapStyle === MAP_STYLES.Satellite ? "light" : "dark"}
                  label={pointCount}
                  diameter={30 + (pointCount / points.length) * 20}
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
                />
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
                maw={300}
              >
                <ListingDetails
                  listing={
                    listings.find((listing) => listing.id === listingId)!
                  }
                  hiddenProperties={[
                    "title",
                    "lat",
                    "lng",
                    "id",
                    "thumbnail",
                    "url",
                  ]}
                />
              </ListingPopover>
            </Marker>
          );
        })}

        {/* Everything below this is for adding listings */}

        {createListing.active && (
          <Marker latitude={createListing.lat} longitude={createListing.lng}>
            <>
              <ActionIcon
                variant="filled"
                onClick={() =>
                  setCreateListing((prev) => ({ ...prev, modalOpen: true }))
                }
              >
                <IconPlus />
              </ActionIcon>
              <AddListingModal
                lat={createListing.lat}
                lng={createListing.lng}
                opened={createListing.modalOpen}
                onClose={() =>
                  setCreateListing((prev) => ({
                    ...prev,
                    modalOpen: false,
                    active: false,
                  }))
                }
                onSave={(listing) => {
                  mutate("/api/listings", listings.concat(listing), {
                    revalidate: false,
                  });
                }}
              />
            </>
          </Marker>
        )}
      </>
    </Map>
  );
};
export default MapView;
