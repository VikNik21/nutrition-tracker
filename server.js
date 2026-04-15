const http = require("http");
const { google } = require("googleapis");

const SPREADSHEET_ID = "13paauEGoqT_Pt71En4qZ2HPPAaxFhvVBaJAfHbaYYmo";
const PORT = 3333;

const SERVICE_ACCOUNT = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);

const TARGETS = { kcal: 2200, protein: 170, carbs: 240, fat: 70 };

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function appendDay(data) {
  const sheets = await getSheets();
  const { day, location, kcal, protein, carbs, fat, meals } = data;

  const kcalPct = Math.round((kcal / TARGETS.kcal) * 100) + "%";
  const protPct = Math.round((protein / TARGETS.protein) * 100) + "%";
  const carbPct = Math.round((carbs / TARGETS.carbs) * 100) + "%";
  const fatPct = Math.round((fat / TARGETS.fat) * 100) + "%";

  const row = [
    `Day ${day}`, location,
    kcal, protein, carbs, fat,
    kcalPct, protPct, carbPct, fatPct,
    meals,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:K",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });

  console.log(`✅ Day ${day} appended to sheet`);
  return { success: true, day, kcalPct, protPct, carbPct, fatPct };
}

async function updateDay(data) {
  const sheets = await getSheets();
  const { day, location, kcal, protein, carbs, fat, meals } = data;

  // Find the row with this day
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:A",
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === `Day ${day}`);

  if (rowIndex === -1) {
    // Day not found, append instead
    return await appendDay(data);
  }

  const kcalPct = Math.round((kcal / TARGETS.kcal) * 100) + "%";
  const protPct = Math.round((protein / TARGETS.protein) * 100) + "%";
  const carbPct = Math.round((carbs / TARGETS.carbs) * 100) + "%";
  const fatPct = Math.round((fat / TARGETS.fat) * 100) + "%";

  const sheetRow = rowIndex + 1;
  const row = [
    `Day ${day}`, location,
    kcal, protein, carbs, fat,
    kcalPct, protPct, carbPct, fatPct,
    meals,
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Sheet1!A${sheetRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  console.log(`✅ Day ${day} updated in sheet (row ${sheetRow})`);
  return { success: true, day, updated: true, kcalPct, protPct, carbPct, fatPct };
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("ngrok-skip-browser-warning", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", message: "Nutrition tracker server running" }));
    return;
  }

  // Log a day
  if (req.method === "POST" && req.url === "/log") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);

        // Validate required fields
        const required = ["day", "kcal", "protein", "carbs", "fat", "meals"];
        const missing = required.filter((f) => data[f] === undefined);
        if (missing.length > 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: `Missing fields: ${missing.join(", ")}` }));
          return;
        }

        data.location = data.location || "Bosnia";
        const result = await updateDay(data);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error("Error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n🚀 Nutrition tracker server running on http://localhost:${PORT}`);
  console.log(`📊 Sheet: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health  — check if server is running`);
  console.log(`  POST /log     — log a day to the sheet`);
  console.log(`\nExample POST body:`);
  console.log(JSON.stringify({
    day: 29, location: "Bosnia",
    kcal: 1800, protein: 120, carbs: 180, fat: 65,
    meals: "Eggs + tuna + ajvar · Chicken breast + salad · Yogurt"
  }, null, 2));
  console.log(`\nWaiting for requests...\n`);
});
