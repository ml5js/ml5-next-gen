// generate_data.js — run once with: node generate_data.js
// Requires Node.js 18+ (built-in fetch)
// Writes weather_data.json with 30 days of hourly data for 4 cities.

const START_DATE = "2025-01-01";
const END_DATE   = "2025-01-30";

const CITIES = {
  new_york:  { lat: 40.7128,  lon: -74.0060  },
  abu_dhabi: { lat: 24.4539,  lon:  54.3773  },
  shanghai:  { lat: 31.2304,  lon: 121.4737  },
  london:    { lat: 51.5074,  lon:  -0.1278  },
};

async function fetchCity(key, { lat, lon }) {
  const params = new URLSearchParams({
    latitude:  lat,
    longitude: lon,
    start_date: START_DATE,
    end_date:   END_DATE,
    hourly: "temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m",
    timezone: "UTC",
  });
  const url = `https://archive-api.open-meteo.com/v1/archive?${params}`;
  console.log(`Fetching ${key}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
  const payload = await res.json();
  const h = payload.hourly;
  if (!h || !h.time) throw new Error(`${key}: no hourly data in response`);

  const rows = [];
  for (let i = 0; i < h.time.length; i++) {
    const row = {
      date:          h.time[i] + "Z",
      temperature:   h.temperature_2m[i],
      humidity:      h.relative_humidity_2m[i],
      wind_speed:    h.wind_speed_10m[i],
      pressure:      h.surface_pressure[i],
      precipitation: h.precipitation[i],
    };
    if (Object.values(row).some(v => v === null || (typeof v === "number" && isNaN(v)))) continue;
    rows.push(row);
  }
  console.log(`  ${key}: ${rows.length} clean rows`);
  return rows;
}

async function main() {
  const result = {};
  for (const [key, coords] of Object.entries(CITIES)) {
    result[key] = await fetchCity(key, coords);
  }
  const { writeFileSync } = await import("fs");
  writeFileSync("weather_data.json", JSON.stringify(result, null, 2));
  console.log("\nDone — weather_data.json written.");
}

main().catch(err => { console.error(err); process.exit(1); });
