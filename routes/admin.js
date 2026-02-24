const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const multer = require("multer");

const Admin = require("../models/Admin");
const Post = require("../models/Post");
const translate = require("../config/translate");
const auth = require("../middleware/auth");

const upload = multer({ dest: "public/uploads/" });

// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("admin/login", { error: null });
});

// LOGIN POST
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.render("admin/login", { error: "Login yoki parol xato" });

  const ok = await bcryptjs.compare(password, admin.passwordHash);
  if (!ok) return res.render("admin/login", { error: "Login yoki parol xato" });

  req.session.admin = { username: admin.username };
  res.redirect("/admin");
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.admin = null;
  res.redirect("/admin/login");
});

// DASHBOARD
router.get("/", auth, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.render("admin/dashboard", { posts });
});

// CREATE PAGE
router.get("/create", auth, (req, res) => {
  res.render("admin/create");
});

// CREATE POST (coverImage + gallery[])
router.post(
  "/create",
  auth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 15 }
  ]),
  async (req, res) => {
    const { title, content, category } = req.body;

    // cover
    const cover = req.files?.coverImage?.[0]?.filename || null;

    // gallery
    const gallery = (req.files?.gallery || []).map((f) => f.filename);

    // auto translate
    const ruTitle = await translate(title, "ru");
    const ruContent = await translate(content, "ru");
    const enTitle = await translate(title, "en");
    const enContent = await translate(content, "en");

    await Post.create({
      category,
      coverImage: cover,
      gallery,
      translations: {
        uz: { title, content },
        ru: { title: ruTitle, content: ruContent },
        en: { title: enTitle, content: enContent }
      }
    });

    res.redirect("/admin");
  }
);

// EDIT PAGE
router.get("/edit/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post topilmadi");
  res.render("admin/edit", { post });
});

// EDIT POST (UZ o‘zgarsa RU/EN qayta tarjima bo‘ladi)
router.post(
  "/edit/:id",
  auth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 15 }
  ]),
  async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post topilmadi");

    const { title, content, category, keepOldGallery } = req.body;

    // cover update (ixtiyoriy)
    const newCover = req.files?.coverImage?.[0]?.filename;
    if (newCover) post.coverImage = newCover;

    // gallery update
    const newGallery = (req.files?.gallery || []).map((f) => f.filename);

    // keepOldGallery = "on" bo‘lsa eski rasmlar qoladi, bo‘lmasa tozalanadi
    if (keepOldGallery === "on") {
      post.gallery = [...post.gallery, ...newGallery];
    } else {
      if (newGallery.length > 0) post.gallery = newGallery;
    }

    // data
    post.category = category;
    post.translations.uz.title = title;
    post.translations.uz.content = content;

    // re-translate from UZ
    post.translations.ru.title = await translate(title, "ru");
    post.translations.ru.content = await translate(content, "ru");
    post.translations.en.title = await translate(title, "en");
    post.translations.en.content = await translate(content, "en");

    post.updatedAt = new Date();
    await post.save();

    res.redirect("/admin");
  }
);

// DELETE POST
router.post("/delete/:id", auth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

module.exports = router;
