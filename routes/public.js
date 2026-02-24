const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// tilni o‘zgartirish
router.get("/lang/:lang", (req, res) => {
  const l = req.params.lang;
  if (!["uz", "ru", "en"].includes(l)) return res.redirect("back");
  req.session.lang = l;
  res.redirect("back");
});

/*router.get("/", async (req, res) => {
  const posts = await Post.find({ category: "news" }).sort({ createdAt: -1 });
  res.render("index", { posts });
});*/

/*router.get("/", async (req, res) => {
  const posts = await Post.find({ category: "news" })
    .sort({ createdAt: -1 })
    .limit(5);   // 👈 faqat 5 ta

  res.render("index", { posts, bgImage: "/bg/home.jpg" });
});


router.get("/category/:name", async (req, res) => {
  const category = req.params.name;
  const posts = await Post.find({ category }).sort({ createdAt: -1 });
  res.render("category", { posts, category });
});


router.get("/post/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post topilmadi");*/

  // 📰 Category sahifalar
/*router.get("/category/:name", async (req, res) => {
  const category = req.params.name;

  const posts = await Post.find({ category })
    .sort({ createdAt: -1 });

  const bgMap = {
    news: "/bg/news.jpg",
    services: "/bg/services.jpg",
    about: "/bg/about.jpg"
  };

  res.render("category", {
    posts,
    category,
    bgImage: bgMap[category] || "/bg/home.jpg"
  });
});


// 📄 Post detail
router.get("/post/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post topilmadi");

  res.render("post", {
    post,
    bgImage: "/bg/post.jpg"
  });
});

  // qayerdan kirildi: news/services/about
  const from = req.query.from;

  // Agar from bor bo'lsa va post category bilan mos kelmasa - ruxsat bermaymiz
  if (from && post.category !== from) {
    return res.status(404).send("Bu post bu bo‘limga tegishli emas");
  }

  res.render("post", { post 
});



module.exports = router;*/


// 🏠 Bosh sahifa
router.get("/", async (req, res) => {
  const posts = await Post.find({ category: "news" })
    .sort({ createdAt: -1 })
    .limit(4);

  res.render("index", {
    posts,
    bgImage: "/bg/home.jpg"
  });
});

// 📂 Category
router.get("/category/:name", async (req, res) => {

  const category = req.params.name;

  const posts = await Post.find({ category })
    .sort({ createdAt: -1 });

  const bgMap = {
    news: "/bg/news.jpg",
    services: "/bg/services.jpg",
    about: "/bg/about.jpg"
  };

  res.render("category", {
    posts,
    category,
    bgImage: bgMap[category] || "/bg/home.jpg"
  });

});

router.get("/about", (req, res) => {
  const aboutData = {
    heroImage: "/bg/about-hero.jpg",

    // Stats
    stats: [
      { key: "projects", value: "250+", uz: "Loyihalar", ru: "Проекты", en: "Projects" },
      { key: "years", value: "7+", uz: "Yillik tajriba", ru: "Лет опыта", en: "Years experience" },
      { key: "clients", value: "150+", uz: "Mijozlar", ru: "Клиенты", en: "Clients" }
    ],

    // Team
    team: [
      {
        name: "______",
        roleUz: "Elektr muhandis",
        roleRu: "Инженер-электрик",
        roleEn: "Electrical engineer",
        photo: "/bg/team1.jpg"
      },
      {
        name: "______",
        roleUz: "Montaj ustasi",
        roleRu: "Мастер монтажа",
        roleEn: "Installation specialist",
        photo: "/bg/team2.jpg"
      },
      {
        name: "_______",
        roleUz: "IT mutaxassis",
        roleRu: "IT специалист",
        roleEn: "IT specialist",
        photo: "/bg/team3.jpg"
      }
    ],

    // Gallery / certificates
    gallery: [
      "/bg/0.jpg",
      "/bg/1.jpg",
      "/bg/2.jpg",
      "/bg/3.jpg",
      "/bg/4.jpg",
      "/bg/5.jpg",
      "/bg/6.jpg"
    ],

    // Contact links
    contacts: {
      phone: "+998 93 442 00 50",
      telegram: "https://t.me/YOUR_USERNAME",
      instagram: "https://instagram.com/YOUR_USERNAME",
      mapEmbed:
        //"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11984.9!2d69.2401!3d41.3111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b7c2f3f3b5f%3A0x0000000000000000!2sTashkent!5e0!3m2!1sen!2s!4v0000000000"//
       "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3066.0288474838303!2d64.42803490018092!3d39.78390798870896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMznCsDQ3JzAyLjEiTiA2NMKwMjUnNDYuOCJF!5e0!3m2!1sru!2s!4v1771865860293!5m2!1sru!2s"
      },

    uz: {
      title: "Biz haqimizda",
      text:
        "Kamron Energo Servis — elektr montaj, servis va IT yechimlar bo‘yicha professional xizmat ko‘rsatadi.\n\n" +
        "Biz xavfsizlik, sifat va tezkorlikni birinchi o‘ringa qo‘yamiz. Loyihalashdan tortib o‘rnatish va keyingi servisgacha — hammasini to‘liq qilamiz.\n\n" +
        "Yetakchi mutaxasislar, ahil jamoa, ko'p yillik tajriba.\n\n"+
        "NIMA UCHUN BIZ? 7 yildan ortiq davr mobaynida 150 dan ortiq mijozlar va yirik korxonalar bilan shartnomalar asosida professional va sifatli xizmat ko`rsatib kelmoqdamiz. 250 dan ortiq loyixalarda ishtirok etganmiz. Bizning shior: TEZKORLIK, SIFAT VA PROFESSIONALLIK"
    },

    ru: {
      title: "О нас",
      text:
        "Kamron Energo Servis — профессиональные услуги по электромонтажу, сервису и IT решениям.\n\n" +
        "Мы ставим на первое место безопасность, качество и оперативность. Полный цикл работ: от проектирования до установки и дальнейшего обслуживания.\n\n"+
        "Ведущие специалисты, сплоченная команда, многолетний опыт.\n\n"+
        "Почему именно мы? Более 7 лет мы предоставляем профессиональные и высококачественные услуги, работая по контрактам с более чем 150 клиентами и крупными предприятиями. Мы участвовали в более чем 250 проектах. Наш девиз: СКОРОСТЬ, КАЧЕСТВО И ПРОФЕССИОНАЛИЗМ»"
    },

    en: {
      title: "About us",
      text:
        "Kamron Energo Servis provides professional electrical installation, maintenance and IT solutions.\n\n" +
        "We focus on safety, quality and fast delivery. Full cycle: from design to installation and ongoing support.\n\n"+
        "Leading specialists, a close-knit team, many years of experience.\n\n"+
        "WHY US? For more than 7 years, we have been providing professional and high-quality services based on contracts with more than 150 clients and large enterprises. We have participated in more than 250 projects. Our motto: SPEED, QUALITY AND PROFESSIONALISM"

    }
  };

  res.render("about", {
    aboutData,
    bgImage: "/bg/about.jpg"
  });
});


// 📄 Post detail
router.get("/post/:id", async (req, res) => {

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post topilmadi");

  res.render("post", {
    post,
    bgImage: "/bg/post.jpg"
  });

});

module.exports = router;
