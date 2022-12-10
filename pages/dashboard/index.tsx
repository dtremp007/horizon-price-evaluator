import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { google } from "googleapis";
import { getAuthToken } from "../../lib/google-api/getAuthToken";
import json2csv from "json2csv";
import { parseSpreadsheet } from "../../lib/spreadsheet/parse-spreadsheet";
import { Listing } from "../../lib/types/listings";
import MapView from "../../src/map/MapView";
import { getSheetIdFromLink } from "../../lib/spreadsheet/get-sheet-id";
import { Code, List, Title } from "@mantine/core";

type DashboardProps = {
  listings: Listing[];
  error?: string;
};

export default function Dashboard({ listings }: DashboardProps) {
  return (
    <>
      {listings && listings.length > 0 ? (
        <MapView listings={listings} />
      ) : (
        <div>
          <Title>There are no listings to display</Title>
          <List>
            <List.Item>
              Make sure you input a spreadsheet link in the settings page.
            </List.Item>
            <List.Item>
              Make sure you input a range in the settings page.
            </List.Item>
            <List.Item>
              Make the following email an editor of the spreadsheet:
            </List.Item>
          </List>
          <Code>{process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}</Code>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const auth = await getAuthToken();
  const sheets = google.sheets({ version: "v4", auth });
  console.log(ctx.req.cookies);

  const range = ctx.req.cookies.range || "Sheet2!A1:G";
  const spreadsheetId =
    getSheetIdFromLink(ctx.req.cookies.spreadsheetLink) ||
    process.env.GOOGLE_SHEET_ID!;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    // const data = response.data.values;
    const listings = parseSpreadsheet(response.data.values || [[]]);

    return {
      props: { listings },
    };
  } catch (error) {
    if (error instanceof Error) {
        return {
            props: { listings: [], error: error.message },
        }
    } else  {
        return {
            props: { listings: [], error: "Unknown error" },
        }
    }
  }
};
