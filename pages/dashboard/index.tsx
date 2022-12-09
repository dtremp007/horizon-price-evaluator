import { GetServerSideProps } from "next";
import { google } from "googleapis";
import { getAuthToken } from "../../lib/google-api/getAuthToken";
import json2csv from "json2csv";
import { parseSpreadsheet } from "../../lib/spreadsheet/parse-spreadsheet";
import { Listing } from "../../lib/types/listings";
import MapView from "../../components/map/MapView";

type DashboardProps = {
  listings: Listing[];
};

export default function Dashboard({ listings }: DashboardProps) {
  return (
    <MapView listings={listings} />
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const auth = await getAuthToken();
  const sheets = google.sheets({ version: "v4", auth });

  const range = "Sheet2!A1:G";
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
    });

    // const data = response.data.values;
    const listings = parseSpreadsheet(response.data.values || [[]]);

    return {
      props: { listings },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { listings: [] },
    };
  }
};
