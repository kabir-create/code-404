const express = require("express");
const cors = require("cors");
require("./config/env");
const {connectDB} = require("./config/db");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));



app.use(express.json());

connectDB();

app.use("/auth", require("./routes/auth"));
app.use("/bill", require("./routes/bill"));
app.use("/payment", require("./routes/payment"));
app.use("/restaurants", require("./routes/restaurant"));

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
  console.log("📡 Endpoints:");
  console.log("   - GET  /restaurants/cities");
  console.log("   - GET  /restaurants/city/:citySlug");
  console.log("   - GET  /restaurants/:restaurantId");
  console.log("   - POST /bill/create");
  console.log("   - POST /payment/confirm");
});