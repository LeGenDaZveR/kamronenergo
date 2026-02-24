const axios = require("axios");

async function libreTranslate(text, target) {
  const res = await axios.post(
    "https://libretranslate.de/translate",
    { q: text, source: "uz", target, format: "text" },
    { headers: { "Content-Type": "application/json" }, timeout: 15000 }
  );
  return res?.data?.translatedText;
}

// MyMemory (public, ba’zan sekin, lekin backup sifatida zo‘r)
async function myMemoryTranslate(text, target) {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=uz|" +
    encodeURIComponent(target);

  const res = await axios.get(url, { timeout: 15000 });
  return res?.data?.responseData?.translatedText;
}

async function translateSafe(text, target) {
  try {
    if (!text || !text.trim()) return "";
    let t = "";

    try {
      t = await libreTranslate(text, target);
      if (t && t.trim()) return t;
    } catch (_) {}

    try {
      t = await myMemoryTranslate(text, target);
      if (t && t.trim()) return t;
    } catch (_) {}

    return text; // fallback
  } catch {
    return text;
  }
}

module.exports = translateSafe;
