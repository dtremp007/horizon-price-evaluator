export type Listing = {
    id: string;
    title: string;
    price: number | string;
    category: string;
    coordinates?: string;
    lat: number;
    lng: number;
    url?: string;
    thumbnail?: string;
    campo?: string;
    date_scraped?: string;
    size?: string;
}
