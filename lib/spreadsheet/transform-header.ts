// A function that takes an array of strings, and conversts anything that like longitudes or latitudes into lng/lat
// Things to look for: "lng", "lon", "long", "lat", "latitude", "longitude"
// If the array doesn't contain any of these, throw an error
export function transformHeader(headers: string[]): string[] {
    const lng = headers.find((header) => header.match(/lng|lon|long/i));
    const lat = headers.find((header) => header.match(/lat|latitude/i));

    if (!lng || !lat) {
        throw new Error(
        "The spreadsheet must contain a column with the header 'lng' or 'lon' or 'long' and a column with the header 'lat' or 'latitude'"
        );
    }

    return headers.map((header) => {
        if (header === lng) {
        return "lng";
        }
        if (header === lat) {
        return "lat";
        }
        return header;
    });
    }
