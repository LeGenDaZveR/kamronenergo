/*const axios = require("axios");

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

module.exports = translateSafe;*/

const axios = require("axios");

async function libreTranslate(text, target) {
  const res = await axios.post(
    "https://libretranslate.de/translate",
    {
      q: text,
      source: "uz",
      target,
      format: "text"
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 20000
    }
  );

  return res?.data?.translatedText || "";
}

async function myMemoryTranslate(text, target) {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=uz|" +
    encodeURIComponent(target);

  const res = await axios.get(url, { timeout: 20000 });
  return res?.data?.responseData?.translatedText || "";
}

// uzun matnni bo‘lib olish
function splitText(text, maxLength = 400) {
  const paragraphs = text.split("\n");
  const chunks = [];
  let current = "";

  for (const p of paragraphs) {
    if ((current + "\n" + p).length > maxLength) {
      if (current.trim()) chunks.push(current.trim());
      current = p;
    } else {
      current += (current ? "\n" : "") + p;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function translateChunk(text, target) {
  try {
    const libre = await libreTranslate(text, target);
    if (libre && libre.trim()) return libre;
  } catch (_) {}

  try {
    const mem = await myMemoryTranslate(text, target);
    if (mem && mem.trim()) return mem;
  } catch (_) {}

  return text;
}

async function translateSafe(text, target) {
  try {
    if (!text || !text.trim()) return "";

    const chunks = splitText(text, 400);
    const translatedChunks = [];

    for (const chunk of chunks) {
      const translated = await translateChunk(chunk, target);
      translatedChunks.push(translated);
    }

    return translatedChunks.join("\n");
  } catch (err) {
    console.error("Tarjima xatosi:", err.message);
    return text;
  }
}

module.exports = translateSafe;
