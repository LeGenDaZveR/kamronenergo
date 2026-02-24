const translations = {
  uz: {
    home: "Bosh sahifa",
    news: "Yangiliklar",
    services: "Xizmatlar",
    about: "Biz haqimizda",
    contact: "Aloqa",
    more: "Batafsil",
    viewAll: "Barchasini ko‘rish",


    footerTitle: "Kamron Energo Servis",
    footerDesc1: "Professional elektr xizmatlari",
    footerDesc2: "Jarayonlarni Avtomatlashtirish SCADA",
    sections: "Bo'limlar",
    contactTitle: "Aloqa",
    rights: "Barcha huquqlar himoyalangan",
    
  },

  ru: {
    home: "Главная",
    news: "Новости",
    services: "Услуги",
    about: "О нас",
    contact: "Контакты",
    more: "Подробнее",
    viewAll: "Смотреть все",

    footerTitle: "Kamron Energo Servis",
    footerDesc1: "Профессиональные электрические услуги",
    footerDesc2: "Автоматизация технологических процессов SCADA",
    sections: "Разделы",
    contactTitle: "Контакты",
    rights: "Все права защищены",
    
  },

  en: {
    home: "Home",
    news: "News",
    services: "Services",
    about: "About",
    contact: "Contact",
    more: "Read more",
    viewAll: "View all",

    footerTitle: "Kamron Energo Servis",
    footerDesc1: "Professional electrical services",
    footerDesc2: "Process Automation SCADA",
    sections: "Sections",
    contactTitle: "Contact",
    rights: "All rights reserved",
    
  }
};

module.exports = (req, res, next) => {
  if (!req.session.lang) req.session.lang = "uz";

  const lang = req.session.lang;

  res.locals.lang = lang;
  res.locals.t = translations[lang];

  next();
};

viewAll: "Barchasini ko‘rish"

viewAll: "Смотреть все"

viewAll: "View all"