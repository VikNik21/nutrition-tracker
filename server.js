const http = require("http");
const { google } = require("googleapis");

const SPREADSHEET_ID = "13paauEGoqT_Pt71En4qZ2HPPAaxFhvVBaJAfHbaYYmo";
const PORT = 3333;

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
