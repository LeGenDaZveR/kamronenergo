require("dotenv").config();
const express = require("express");
const session = require("express-session");

const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true
  })
);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(require("./middleware/language"));

app.use("/", require("./routes/public"));
app.use("/admin", require("./routes/admin"));

async function ensureAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin12345";

  const exists = await Admin.findOne({ username });
  if (!exists) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });
    console.log("✅ Admin created:", username, "password:", password);
  }
}

(async () => {
  await connectDB(process.env.MONGO_URI);
  await ensureAdmin();

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log("Server " + port + " portda"));
})();
