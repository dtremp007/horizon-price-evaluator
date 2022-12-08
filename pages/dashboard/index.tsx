import { GetServerSideProps } from "next";
import { google } from "googleapis";
import { getAuthToken } from "../../lib/google-api/getAuthToken";

export default function Dashboard({data}: {data: string[][]}) {
    console.log(data)
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const auth = await getAuthToken();
    const sheets = google.sheets({version: "v4", auth})

    const range = "Sheet1!A1:A21";

    const response = await sheets.spreadsheets.values.get({
     spreadsheetId: process.env.GOOGLE_SHEET_ID,
     range
    })

    const data = response.data.values;

    return {
        props: {data}
    }
}
