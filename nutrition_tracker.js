const { google } = require("googleapis");

const SPREADSHEET_ID = "13paauEGoqT_Pt71En4qZ2HPPAaxFhvVBaJAfHbaYYmo";

const SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "nutrition-tracker-493413",
  private_key_id: "54c5f10634c174192da37c425ed4059e42770bfd",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDVM39hqPLKM2Qj\nhBm/XlY0ByNA9deec0RiQFuKa5h/SlkVUNai/06J/5+L5n6UGn9Y5hc9N0kts4KV\nUIp5p14gCkEJ8Quz9+5Fgns8M3Mvy1J2N/fZBnBe05JiLOUq0uuTiOBfE5u3kYOW\nWKdYK+ymilMzXNRzLtGlOpUhun1tytAQCmYyhaq3CRkkS9fdC4aCazf7rK3abJWi\na6tcmjtB7d78am6nCQdie0refzVpgDecurK5LlblxXJgDAXVShQyAbkw4W9itRv0\n/w/Kfc57cCCJ5rta4yVECS8e7qyw7/9f9u4s6St+8KnVIuw3PEwZegLpI5Zpw92x\nBWlcbLBfAgMBAAECggEAFq3lOYLK3PaNivek84X5/ovZ1LGyL6FMX3VAJ5/dd4D1\nq/5O7sTg2m4uTygERAXzkQXc5/6nEqz7UZ3hNSK4MQlWNNQG7iyMFKnWKSfB844Z\n5gh7HYOBVZ0E/9uNvznzpFyVnZeM44CfslEY8BiwEmE5i4eu89fBpmVucsmPSSvt\nlveJgnvyrNDRbqJkZmS7ikm+fs1kMKrQk3M2zQH2zt4oaYjmVLgx26xriTBHoPSI\n8aLZAVtOxHbY4QG5mEYx1P1FW9Fb4MN47Aj5aggblf1pV3yMvzmxV3sgLO2RCW1I\npSlsrltxzagOBC/Os4P9ZyxSgwADI3IsusL48isBsQKBgQD6NUBL5IFYcySGwQK7\nsqeqo0tGjquMxIyNSQB4ci4Vzh56Sv87LKDfdmRo/DEJLf2LQ1YVSwTU4u2QakpA\nQFm0VNGa94gKjDKri/pNFf6twV8yBAdp2amcrwlX8QV4XHShgjQ4oEcufMXnMSpV\njEWV8ggnake90l1wpv8+af7tsQKBgQDaIvECasCoPNMHSmnh153Aeh0IHh0Xrsfq\nmHnu4c05kDJYkWxhjvztjyNzm2ds1ZXhykyYIo+DmTYYkcMSWNDv/KduEggMwh3V\n1UtI9OLNcK3wMo53+mylh7Uk+H3QuYaxQvFLosVYPOhKANz1zMbUlvnwOyT9NCZ4\nUJgk62qzDwKBgAKFDsS05GiToEaLIw/o2K9rPZLUVP3x7Mhvd8W+wKAPl1b78l4S\nMPyPIKu9/nBtOiRw5SkJvF64elP9/glvnHeocwPwgjo49zmrCzZDhnERhXfnenui\naYbebGWqU7fGlpYZzZTUaGMbdpLBd/+sjfbYnSRoeZh7yd0ckW17e8nBAoGBAKuq\nKc7EIh+D1nL7Xb4sh+nsb6JuyGhV1OBK5FJZAr+VOfm3X/qao3N0XOri1o6wu0Y4\nhPSI5jYjQY4uT7zFhpAGXeDicdFQhlg8hgXBKieQ0GGh97p1qkDOPoD8yU6UYmpn\niysBypo5PHjYmwsY/zRYKBOlB+P3wXqXulP7rDmDAoGAHVTZZVAjEFDEUF+91FKc\n8M+onLKNOEz+FZ0DOHF64S3v9fHPLXShuo96d+LqxERoOnFnXkR6Qv3AlGsMJ2py\nbhtFJ58l36Hny0g5w0GKh5M6bKEbINjzY4OOMq6ZLr5y2o164mWJCxFoctfItcTf\nFOdJCw3DCrD/2gSUvI3/myQ=\n-----END PRIVATE KEY-----\n",
  client_email: "nutrition-tracker@nutrition-tracker-493413.iam.gserviceaccount.com",
  client_id: "109337867384026664915",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

const TARGETS = { kcal: 2200, protein: 170, carbs: 240, fat: 70 };

const DAYS = [
  {
    day: 23, location: "Bosnia",
    kcal: 2080, protein: 99, carbs: 212, fat: 91,
    meals: "Espresso x2 · Dimljeni šaran + baguette · Fried carp + 2 fish sarma + 2 bread rolls · 5x Hi-Chew · Štrudla sa orasima x2 · 1 cup milk"
  },
  {
    day: 24, location: "Bosnia",
    kcal: 1715, protein: 95, carbs: 154, fat: 76,
    meals: "Eggs + rice · Chicken tortilla + pork in mushroom sauce · Ice cream · Macchiato · Chicken+tofu curry"
  },
  {
    day: 25, location: "Bosnia",
    kcal: 1870, protein: 109, carbs: 67, fat: 129,
    meals: "Chicken liver + pavlaka + 3 boiled eggs + ajvar · Pita sa sirom 4pc · Roštilj: kobasice + vrat svinjski + tikvice + šampinjoni · Kinder jaje"
  },
  {
    day: 26, location: "Bosnia",
    kcal: 1250, protein: 78, carbs: 96, fat: 60,
    meals: "Palenta + pavlaka + 2 boiled eggs · Crna kafa · 3 egg whites + ajvar · Ćevapi x5 + ½ kobasica + 2 egg whites + tikvice + kupus salata + bread + yogurt"
  },
  {
    day: 27, location: "Bosnia",
    kcal: 1921, protein: 92, carbs: 219, fat: 75,
    meals: "Chicken+tofu curry · ½ banana + chia + lemon · Plazma Rolsi x4 · Pork mince + lentil pasta + homemade fries · Pizza slice + pumpkin seeds"
  },
  {
    day: 28, location: "Bosnia",
    kcal: 1308, protein: 62, carbs: 118, fat: 64,
    meals: "Mortadela sandwich + urnebesa + majoneza · Pork neck + pečenica + lettuce + spring onions + Thai chilli + Coke + 2 bread slices"
  },
];

async function getService() {
  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function setupHeaders(sheets) {
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1",
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        ["NUTRITION TRACKER — VIKTOR"],
        [""],
        ["Targets:", "Kcal", "Protein (g)", "Carbs (g)", "Fat (g)"],
        ["", 2200, 170, 240, 70],
        [""],
        ["Day", "Location", "Kcal", "Protein (g)", "Carbs (g)", "Fat (g)", "Kcal %", "Protein %", "Carbs %", "Fat %", "Meals"],
      ],
    },
  });
  console.log("✅ Headers set up");
}

async function insertDays(sheets) {
  const rows = DAYS.map((d) => {
    const kcalPct = Math.round((d.kcal / TARGETS.kcal) * 100) + "%";
    const protPct = Math.round((d.protein / TARGETS.protein) * 100) + "%";
    const carbPct = Math.round((d.carbs / TARGETS.carbs) * 100) + "%";
    const fatPct = Math.round((d.fat / TARGETS.fat) * 100) + "%";
    return [
      `Day ${d.day}`, d.location,
      d.kcal, d.protein, d.carbs, d.fat,
      kcalPct, protPct, carbPct, fatPct,
      d.meals,
    ];
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A7",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows },
  });
  console.log(`✅ Inserted ${rows.length} days`);
}

async function formatSheet(sheets) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetId = meta.data.sheets[0].properties.sheetId;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        // Bold + dark bg on header row
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 5, endRowIndex: 6 },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                backgroundColor: { red: 0.15, green: 0.15, blue: 0.15 },
              },
            },
            fields: "userEnteredFormat(textFormat,backgroundColor)",
          },
        },
        // Bold title
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true, fontSize: 14 } } },
            fields: "userEnteredFormat(textFormat)",
          },
        },
        // Freeze top 6 rows
        {
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { frozenRowCount: 6 } },
            fields: "gridProperties.frozenRowCount",
          },
        },
        // Auto resize all columns
        {
          autoResizeDimensions: {
            dimensions: { sheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 11 },
          },
        },
        // Alternating row colors for data rows
        {
          addBanding: {
            bandedRange: {
              bandedRangeId: 1,
              range: { sheetId, startRowIndex: 6, startColumnIndex: 0, endColumnIndex: 11 },
              rowProperties: {
                headerColor: { red: 0.9, green: 0.9, blue: 0.9 },
                firstBandColor: { red: 1, green: 1, blue: 1 },
                secondBandColor: { red: 0.95, green: 0.97, blue: 1 },
              },
            },
          },
        },
      ],
    },
  });
  console.log("✅ Formatting applied");
}

async function main() {
  try {
    const sheets = await getService();
    await setupHeaders(sheets);
    await insertDays(sheets);
    await formatSheet(sheets);
    console.log("\n🎉 Done! Open your sheet:");
    console.log(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
