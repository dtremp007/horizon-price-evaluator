import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken } from "../../lib/google-api/getAuthToken";
import { google } from "googleapis";
import { getSheetIdFromLink } from "../../lib/spreadsheet/get-sheet-id";
import { Listing } from "../../lib/types/listings";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/auth/session";
import { parseSpreadsheet } from "../../lib/spreadsheet/parse-spreadsheet";
import { transformHeader } from "../../lib/spreadsheet/transform-header";

export type SheetData = {
  name: string;
  headerRow?: string[];
};

type SheetDataResponse = {
    message?: string;
} | SheetData[];

async function handleAppend(req: NextApiRequest, res: NextApiResponse<SheetDataResponse>) {
  if (!req.session.user) {
    res.status(401).json({ message: "You are not logged in." });
  } else {
    try {
      const auth = await getAuthToken();
      const sheets = google.sheets({ version: "v4", auth });

      const spreadsheetId = getSheetIdFromLink((req.query.spreadsheetLink as string) || req.cookies.spreadsheetLink);

      if (!spreadsheetId) {
        throw new Error("No spreadsheet id found.");
      }

      if (req.method === "GET") {
        const sheetNames = await (
          await sheets.spreadsheets.get({ spreadsheetId })
        ).data.sheets?.map((sheet) => sheet.properties?.title);

        const ranges = sheetNames?.map((sheet) => `${sheet}!1:1`);

        const response = await sheets.spreadsheets.values.batchGet({
          spreadsheetId,
          ranges,
        });

        const headerRows = response.data.valueRanges?.map(
          (range) => range.values?.[0]
        );

        const sheetData = sheetNames?.map((name, index) => ({
            name: name as string,
            headerRow: headerRows?.[index]
        }));

        if (!sheetData) {
            throw new Error("No sheet data found.");
        }

        res.status(200).json(sheetData);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Something went wrong." });
      }
    }
  }
}

export default withIronSessionApiRoute(handleAppend, sessionOptions);
