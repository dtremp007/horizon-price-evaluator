import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { google } from "googleapis";
import { getAuthToken } from "../../lib/google-api/getAuthToken";
import json2csv from "json2csv";
import { parseSpreadsheet } from "../../lib/spreadsheet/parse-spreadsheet";
import { Listing } from "../../lib/types/listings";
import MapView from "../../src/map/MapView";
import { getSheetIdFromLink } from "../../lib/spreadsheet/get-sheet-id";
import { Code, List, Text, Title } from "@mantine/core";
import { transformHeader } from "../../lib/spreadsheet/transform-header";
import useFilterContext from "../../src/listings/filter-context/FilterContext";
import { useEffect } from "react";

type DashboardProps = {
  listings: Listing[];
  error?: string;
};

export default function Dashboard({ listings, error }: DashboardProps) {
  const { category, setAvailableCategories } = useFilterContext();

  useEffect(() => {
    if (
      listings &&
      listings.length > 0 &&
      listings[0].category &&
      setAvailableCategories
    ) {
      const categories = listings.map((listing) => listing.category);
      setAvailableCategories(Array.from(new Set(categories)).concat("ALL"));
    }
  }, []);

  return (
    <>
      {listings && listings.length > 0 ? (
        <MapView
          listings={listings.filter((listing) => {
            if (category === "ALL" || !listing.category || !category) {
              return true;
            } else {
              return listing.category === category;
            }
          })}
        />
      ) : (
        <div>
          <Title>There are no listings to display</Title>
          <Text>{error}</Text>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const auth = await getAuthToken();
    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = getSheetIdFromLink(ctx.req.cookies.spreadsheetLink);
    const range = ctx.req.cookies.range;

    if (!spreadsheetId) {
      return {
        props: {
          listings: [],
          error: "Go into settings and provide a spreadsheet and a range.",
        },
      };
    }

    if (!range) {
      return {
        props: { listings: [], error: "No range provided" },
      };
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const listings = parseSpreadsheet(response.data.values, transformHeader);

    return {
      props: { listings },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        props: { listings: [], error: error.message },
      };
    } else {
      return {
        props: { listings: [], error: "Unknown error" },
      };
    }
  }
};
