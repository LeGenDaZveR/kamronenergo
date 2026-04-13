/*require("dotenv").config();
const express = require("express");
const session = require("express-session");

const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

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
    const passwordHash = await bcryptjs.hash(password, 10);
    await Admin.create({ username, passwordHash });
    console.log("✅ Admin created:", username, "password:", password);
  }
}

(async () => {
  await connectDB(process.env.MONGO_URI);
  await ensureAdmin();

  const port = process.env.PORT || 10000;
  app.listen(port, () => console.log("Server " + port + " portda"));
})();*/


require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// --- Express base
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

// --- Session (MemoryStore warning — hozircha mayli)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // https bo'lsa keyin true qilamiz (proxy bilan)
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// --- Middleware/routes ulashda xato bo'lsa ko'rsatadi
try {
  app.use(require("./middleware/language"));
  app.use("/", require("./routes/public"));
  app.use("/admin", require("./routes/admin"));
} catch (e) {
  console.error("❌ Middleware/route ulashda xato:", e);
}

// --- 404
app.use((req, res) => res.status(404).send("Not found"));

// --- Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Express error:", err);
  res.status(500).send("Server error");
});

// --- Process level error logs (MUHIM)
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// ✅ AVVAL PORTNI OCHAMIZ (Render shuni talab qiladi)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("✅ Server port:", port));

// ✅ KEYIN Mongo'ga ulanib ko'ramiz (timeout bilan)
(async () => {
  try {
    const mongo = process.env.MONGO_URI;
    if (!mongo) throw new Error("MONGO_URI env topilmadi (Render -> Environment).");

    console.log("⏳ MongoDB ga ulanyapman...");
    await mongoose.connect(mongo, { serverSelectionTimeoutMS: 15000 });
    console.log("✅ MongoDB connected");
  } catch (e) {
    console.error("❌ MongoDB ulanishda xato:", e?.message || e);
  }
})();
    
  
