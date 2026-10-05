import { google } from "googleapis";

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    throw new Error("Missing Google service account env vars");
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendReviewRow(row: {
  name: string;
  email: string;
  phone: string;
  project: string;
  rating: number;
  feedback: string;
}) {
  const sheets = getSheetsClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID env var");
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          row.name,
          row.email,
          row.phone,
          row.project,
          row.rating,
          row.feedback,
        ],
      ],
    },
  });
}
