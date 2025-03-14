const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Node server started at port ${port}`));
