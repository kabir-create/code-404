const express = require("express");
require("./config/env");
const {connectDB} = require("./config/db");

const app = express();
app.use(express.json());

connectDB();

app.use("/auth", require("./routes/auth"));
app.use("/bill", require("./routes/bill"));
app.use("/payment", require("./routes/payment"));

app.listen(3000, () => console.log("Server running on port 3000"));
