import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken } from "../../lib/google-api/getAuthToken";
import { google } from "googleapis";
import { getSheetIdFromLink } from "../../lib/spreadsheet/get-sheet-id";
import { Listing } from "../../lib/types/listings";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/auth/session";
import { parseSpreadsheet } from "../../lib/spreadsheet/parse-spreadsheet";
import { transformHeader } from "../../lib/spreadsheet/transform-header";

type Data = {
  message?: string;
} | Listing[];

async function handleAppend(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!req.session.user) {
    res.status(401).json({ message: "You are not logged in." });
  } else {
    try {
      const auth = await getAuthToken();
      const sheets = google.sheets({ version: "v4", auth });

      const spreadsheetId = getSheetIdFromLink(req.cookies.spreadsheetLink);
      const range = req.cookies.range;

      if (!spreadsheetId) {
        throw new Error("No spreadsheet id found.");
      }

      if (!range) {
        throw new Error("No range specified.");
      }

      if (req.method === "GET") {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
        });

        if (!response.data.values) {
          throw new Error("No data found.");
        }
        const [header, ...data] = response.data.values;

        const listings = parseSpreadsheet<Listing>(data, transformHeader(header));

        res.status(200).json(listings);
      }

      if (req.method === "POST") {
        const body = JSON.parse(req.body);

        const response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [Object.values(body as Listing)],
          },
        });

        res.status(response.status).json({ message: response.statusText });
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
