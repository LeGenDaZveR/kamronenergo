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
      timeout: 15000
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

  const res = await axios.get(url, { timeout: 15000 });
  return res?.data?.responseData?.translatedText || "";
}

function splitText(text, maxLength = 400) {
  const paragraphs = text.split("\n");
  const chunks = [];
  let current = "";

  for (const p of paragraphs) {
    const next = current ? current + "\n" + p : p;

    if (next.length > maxLength) {
      if (current.trim()) chunks.push(current.trim());

      if (p.length > maxLength) {
        for (let i = 0; i < p.length; i += maxLength) {
          chunks.push(p.slice(i, i + maxLength));
        }
        current = "";
      } else {
        current = p;
      }
    } else {
      current = next;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function translateChunk(text, target) {
  try {
    const t = await libreTranslate(text, target);
    if (t && t.trim()) return t;
  } catch (e) {}

  try {
    const t = await myMemoryTranslate(text, target);
    if (t && t.trim()) return t;
  } catch (e) {}

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
