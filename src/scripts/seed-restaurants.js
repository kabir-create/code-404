const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

// .env is in src/ folder, not project root
const envPath = path.resolve(__dirname, "../.env");
console.log(`Loading .env from: ${envPath}`);
console.log(`File exists: ${fs.existsSync(envPath) ? "✓ Yes" : "✗ No"}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ Error loading .env file:", result.error);
  process.exit(1);
}

console.log("Environment loaded:", {
  DATABASE_URL: process.env.DATABASE_URL ? "✓ Found" : "✗ Missing",
  PORT: process.env.PORT
});

const { Pool } = require("pg");

// Use the same connection as your app
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seedRestaurants() {
  console.log("\n🌱 Starting database seeding...");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not defined!");
    console.log("Make sure .env file exists at:", envPath);
    process.exit(1);
  }
  
  console.log(`📍 Connecting to database on port 5433...\n`);
  
  const client = await pool.connect();
  
  try {
    // Test connection
    await client.query("SELECT 1");
    console.log("✓ Database connected successfully\n");
    
    // Read scraped data (go up two levels from scripts/ to project root, then into scraper/)
    const dataPath = path.join(__dirname, "../../scraper/scraped_data/eazydiner_restaurants.json");
    
    console.log(`Looking for data at: ${dataPath}`);
    
    if (!fs.existsSync(dataPath)) {
      console.error("❌ eazydiner_restaurants.json not found!");
      console.log(`Expected location: ${dataPath}`);
      console.log("\nRun the Python scraper first:");
      console.log("  cd scraper");
      console.log("  python eazydiner_scraper.py");
      process.exit(1);
    }
    
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(rawData);
    
    await client.query("BEGIN");
    
    // Clear existing restaurant data
    console.log("🗑️  Clearing existing restaurant data...");
    await client.query("DELETE FROM restaurants");
    await client.query("ALTER SEQUENCE restaurants_id_seq RESTART WITH 1");
    console.log("✓ Existing data cleared\n");
    
    let totalInserted = 0;
    const restaurantsByCity = data.restaurants_by_city;
    
    for (const [city, restaurants] of Object.entries(restaurantsByCity)) {
      console.log(`📍 Processing ${city}...`);
      
      for (const restaurant of restaurants) {
        const phoneNo = generatePhoneNumber(restaurant.slug);
        const name = restaurant.name || "Unknown Restaurant";
        const address = restaurant.address || restaurant.location || `${city}, India`;
        const cuisine = restaurant.cuisine || "Multi-Cuisine";
        const rating = restaurant.rating || 0;
        const priceRange = restaurant.price_range || "₹₹";
        const imageUrl = restaurant.image_url || "";
        const eazyDinerUrl = restaurant.url || "";
        const citySlug = city.toLowerCase().replace(/\s+/g, "-");
        
        try {
          await client.query(
            `INSERT INTO restaurants 
             (name, phone_no, address, city, city_slug, cuisine, rating, price_range, image_url, eazydiner_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [name, phoneNo, address, city, citySlug, cuisine, rating, priceRange, imageUrl, eazyDinerUrl]
          );
          
          totalInserted++;
          
          if (totalInserted % 10 === 0) {
            process.stdout.write(`  ✓ ${totalInserted} restaurants inserted...\r`);
          }
        } catch (err) {
          if (err.code !== "23505") { // Not a unique violation
            console.error(`  ✗ Error inserting ${name}:`, err.message);
          }
        }
      }
      
      console.log(`\n  ✓ ${restaurants.length} restaurants from ${city} processed\n`);
    }
    
    await client.query("COMMIT");
    
    console.log("═".repeat(60));
    console.log(`✓ Database seeding completed!`);
    console.log(`📊 Total restaurants inserted: ${totalInserted}`);
    console.log(`🏙️  Cities: ${Object.keys(restaurantsByCity).join(", ")}`);
    console.log("═".repeat(60));
    
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error seeding database:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

function generatePhoneNumber(slug) {
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const lastDigits = String(hash).slice(-8).padStart(8, "0");
  return `9198${lastDigits}`;
}

seedRestaurants()
  .then(() => {
    console.log("\n✅ Seeding process completed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Seeding process failed:", err);
    process.exit(1);
  });
