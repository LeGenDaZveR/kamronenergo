const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  category: { type: String, required: true }, // news/services/about
  coverImage: { type: String, default: null }, // bitta asosiy rasm
  gallery: { type: [String], default: [] }, // ko‘p rasm
  translations: {
    uz: { title: String, content: String },
    ru: { title: String, content: String },
    en: { title: String, content: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
