// Function: getAverageCoordinates
// Description: Returns the average coordinates of a list of coordinates

import { Listing } from "../types/listings"

// Takes a an object of type Listing and returns an a tuble
export function getAverageCoordinates(listings: Listing[]): [number, number] {
    // Get the average lat and lng
    const averageLat = listings.reduce((acc, listing) => acc + listing.lat, 0) / listings.length
    const averageLng = listings.reduce((acc, listing) => acc + listing.lng, 0) / listings.length

    return [averageLat, averageLng]
}
