import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "fr" | "en" | "ar";

const translations = {
  fr: {
    castings: "Castings",
    talents: "Talents",
    recruteurs: "Recruteurs",
    about: "A propos",
    aide: "Aide",
    login: "Connexion",
    register: "S'inscrire",
    logout: "Deconnexion",
    myProfile: "Mon profil",
    applications: "Candidatures",
    dashboard: "Tableau de bord",
    createOffer: "Creer une offre",
    admin: "Administration",
    roles: { performer: "Talent", recruiter: "Recruteur", admin: "Admin" },
    pages: {
      talents:    { title: "Talents",    desc: "Decouvrez les talents disponibles sur CATOURNE." },
      recruteurs: { title: "Recruteurs", desc: "Trouvez les meilleurs talents pour vos projets sur CATOURNE." },
      about:      { title: "A propos",   desc: "CATOURNE est la plateforme de reference pour les castings cinematographiques a Ouarzazate et dans la region Draa-Tafilalet." },
      aide:       { title: "Aide",       desc: "Besoin d'assistance ? Consultez notre centre d'aide ou contactez-nous." },
    },
    home: {
      // Hero
      heroLabel: "Plateforme de casting cinematographique",
      heroHeading: "Le cinema commence",
      heroHeadingAccent: "a Ouarzazate",
      heroDesc: "La plateforme qui connecte talents locaux et productions cinematographiques dans la capitale du cinema africain.",
      heroBtnTalent: "Je suis Talent",
      heroBtnRecruiter: "Je suis Recruteur",
      heroJoinNow: "Rejoindre maintenant",
      heroPostJob: "Publier une offre",
      heroDashboard: "Mon tableau de bord",
      heroBrowse: "Parcourir les offres",

      // Search Filters
      filtersTitle: "Trouvez votre prochain role",
      filtersKeyword: "Mot-cle",
      filtersKeywordPlaceholder: "Acteur, figurant, technicien...",
      filtersLocation: "Lieu",
      filtersLocationPlaceholder: "Ouarzazate, Errachidia...",
      filtersCategory: "Categorie",
      filtersCategoryAll: "Toutes les categories",
      filtersCategoryActor: "Acteur / Actrice",
      filtersCategoryExtra: "Figurant",
      filtersCategoryTech: "Technicien",
      filtersCategoryModel: "Mannequin",
      filtersCategoryVoice: "Voix off",
      filtersSearch: "Rechercher",

      // Casting Grid
      gridLabel: "Opportunites",
      gridHeading: "Explorez des milliers d'offres ouvertes",
      gridInfiniteLabel: "Opportunites infinies, candidatures illimitees",
      gridInfiniteAccent: "milliers",
      gridViewAll: "Voir toutes les offres",
      gridDeadline: "Limite :",
      gridApply: "Postuler",

      // How it works (4 steps)
      howLabel: "Comment ca marche",
      howHeading: "Comment CATOURNE fonctionne pour vous",
      step1Title: "Creez votre profil",
      step1Desc: "Inscrivez-vous et completez votre profil avec vos competences, photos et experience.",
      step1Icon: "profile",
      step2Title: "Decouvrez les castings",
      step2Desc: "Parcourez les offres de casting publiees par les producteurs et studios de la region.",
      step2Icon: "search",
      step3Title: "Postulez en un clic",
      step3Desc: "Envoyez votre candidature directement aux recruteurs avec votre message de motivation.",
      step3Icon: "apply",
      step4Title: "Decrochez le role",
      step4Desc: "Recevez des reponses, passez vos auditions et lancez votre carriere cinematographique.",
      step4Icon: "star",

      // Region section
      regionLabel: "La region",
      regionHeading: "Pourquoi la region Draa-Tafilalet ?",
      regionDesc: "Berceau du cinema marocain, Ouarzazate et sa region attirent chaque annee des productions internationales. CATOURNE met en lumiere les talents de cette terre de cinema.",
      regionStat1: "50+",
      regionStat1Label: "Productions / an",
      regionStat2: "Atlas Studios",
      regionStat2Label: "Plus grand studio d'Afrique",
      regionStat3: "1000+",
      regionStat3Label: "Talents inscrits",
      regionStat4: "Draa-Tafilalet",
      regionStat4Label: "Region d'excellence cinematographique",

      // CTA
      ctaHeading: "Votre prochaine scene commence ici",
      ctaDesc: "Rejoignez la communaute CATOURNE et connectez-vous avec les productions de Ouarzazate et de la region Draa-Tafilalet.",
      ctaRegister: "Creer un compte gratuit",
      ctaBrowse: "Explorer les castings",
    },
  },
  en: {
    castings: "Castings",
    talents: "Talents",
    recruteurs: "Recruiters",
    about: "About",
    aide: "Help",
    login: "Login",
    register: "Sign up",
    logout: "Logout",
    myProfile: "My profile",
    applications: "Applications",
    dashboard: "Dashboard",
    createOffer: "Post a job",
    admin: "Administration",
    roles: { performer: "Talent", recruiter: "Recruiter", admin: "Admin" },
    pages: {
      talents:    { title: "Talents",    desc: "Discover available talents on CATOURNE." },
      recruteurs: { title: "Recruiters", desc: "Find the best talents for your projects on CATOURNE." },
      about:      { title: "About",      desc: "CATOURNE is the leading platform for film castings in Ouarzazate and the Draa-Tafilalet region." },
      aide:       { title: "Help",       desc: "Need assistance? Browse our help center or contact us." },
    },
    home: {
      // Hero
      heroLabel: "Cinematic casting platform",
      heroHeading: "Cinema begins",
      heroHeadingAccent: "in Ouarzazate",
      heroDesc: "The platform connecting local talents with film productions in the capital of African cinema.",
      heroBtnTalent: "I'm a Talent",
      heroBtnRecruiter: "I'm a Recruiter",
      heroJoinNow: "Join now",
      heroPostJob: "Post a job",
      heroDashboard: "My dashboard",
      heroBrowse: "Browse offers",

      // Search Filters
      filtersTitle: "Find your next role",
      filtersKeyword: "Keyword",
      filtersKeywordPlaceholder: "Actor, extra, technician...",
      filtersLocation: "Location",
      filtersLocationPlaceholder: "Ouarzazate, Errachidia...",
      filtersCategory: "Category",
      filtersCategoryAll: "All categories",
      filtersCategoryActor: "Actor / Actress",
      filtersCategoryExtra: "Extra",
      filtersCategoryTech: "Technician",
      filtersCategoryModel: "Model",
      filtersCategoryVoice: "Voice over",
      filtersSearch: "Search",

      // Casting Grid
      gridLabel: "Opportunities",
      gridHeading: "Explore thousands of open jobs",
      gridInfiniteLabel: "Infinite opportunities, unlimited applications",
      gridInfiniteAccent: "thousands",
      gridViewAll: "View all offers",
      gridDeadline: "Deadline:",
      gridApply: "Apply",

      // How it works (4 steps)
      howLabel: "How it works",
      howHeading: "How CATOURNE works for you",
      step1Title: "Create your profile",
      step1Desc: "Sign up and complete your profile with your skills, photos and experience.",
      step1Icon: "profile",
      step2Title: "Discover castings",
      step2Desc: "Browse casting offers posted by producers and studios in the region.",
      step2Icon: "search",
      step3Title: "Apply in one click",
      step3Desc: "Send your application directly to recruiters with your cover message.",
      step3Icon: "apply",
      step4Title: "Land the role",
      step4Desc: "Receive responses, attend auditions and launch your film career.",
      step4Icon: "star",

      // Region section
      regionLabel: "The region",
      regionHeading: "Why Draa-Tafilalet?",
      regionDesc: "Cradle of Moroccan cinema, Ouarzazate and its region attract international productions every year. CATOURNE highlights the talents of this land of cinema.",
      regionStat1: "50+",
      regionStat1Label: "Productions / year",
      regionStat2: "Atlas Studios",
      regionStat2Label: "Largest studio in Africa",
      regionStat3: "1000+",
      regionStat3Label: "Registered talents",
      regionStat4: "Draa-Tafilalet",
      regionStat4Label: "Region of cinematic excellence",

      // CTA
      ctaHeading: "Your next scene starts here",
      ctaDesc: "Join the CATOURNE community and connect with productions in Ouarzazate and the Draa-Tafilalet region.",
      ctaRegister: "Create a free account",
      ctaBrowse: "Explore castings",
    },
  },
  ar: {
    castings: "الكاستينغ",
    talents: "المواهب",
    recruteurs: "المجنِّدون",
    about: "من نحن",
    aide: "المساعدة",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    myProfile: "ملفي الشخصي",
    applications: "الطلبات",
    dashboard: "لوحة التحكم",
    createOffer: "نشر عرض",
    admin: "الإدارة",
    roles: { performer: "موهبة", recruiter: "مجنِّد", admin: "مشرف" },
    pages: {
      talents:    { title: "المواهب",    desc: "اكتشف المواهب المتاحة على CATOURNE." },
      recruteurs: { title: "المجنِّدون", desc: "اعثر على أفضل المواهب لمشاريعك على CATOURNE." },
      about:      { title: "من نحن",    desc: "CATOURNE هي المنصة المرجعية للكاستينغ السينمائي في ورزازات وجهة درعة تافيلالت." },
      aide:       { title: "المساعدة",  desc: "هل تحتاج إلى مساعدة؟ تصفح مركز المساعدة أو تواصل معنا." },
    },
    home: {
      // Hero
      heroLabel: "منصة الكاستينغ السينمائي",
      heroHeading: "السينما تبدأ",
      heroHeadingAccent: "في ورزازات",
      heroDesc: "المنصة التي تربط المواهب المحلية بالإنتاجات السينمائية في عاصمة السينما الأفريقية.",
      heroBtnTalent: "أنا موهبة",
      heroBtnRecruiter: "أنا مجنِّد",
      heroJoinNow: "انضم الآن",
      heroPostJob: "انشر عرضا",
      heroDashboard: "لوحة التحكم",
      heroBrowse: "استعرض العروض",

      // Search Filters
      filtersTitle: "ابحث عن دورك التالي",
      filtersKeyword: "كلمة مفتاحية",
      filtersKeywordPlaceholder: "ممثل، كومبارس، تقني...",
      filtersLocation: "المكان",
      filtersLocationPlaceholder: "ورزازات، الراشيدية...",
      filtersCategory: "الفئة",
      filtersCategoryAll: "جميع الفئات",
      filtersCategoryActor: "ممثل / ممثلة",
      filtersCategoryExtra: "كومبارس",
      filtersCategoryTech: "تقني",
      filtersCategoryModel: "عارض أزياء",
      filtersCategoryVoice: "تعليق صوتي",
      filtersSearch: "بحث",

      // Casting Grid
      gridLabel: "الفرص",
      gridHeading: "استكشف آلاف العروض المتاحة",
      gridInfiniteLabel: "فرص لا حدود لها، طلبات غير محدودة",
      gridInfiniteAccent: "آلاف",
      gridViewAll: "عرض جميع العروض",
      gridDeadline: "الموعد النهائي:",
      gridApply: "تقدم",

      // How it works (4 steps)
      howLabel: "كيف يعمل",
      howHeading: "كيف يعمل CATOURNE من أجلك",
      step1Title: "أنشئ ملفك الشخصي",
      step1Desc: "سجل وأكمل ملفك بمهاراتك وصورك وخبراتك.",
      step1Icon: "profile",
      step2Title: "اكتشف الكاستينغات",
      step2Desc: "تصفح عروض الكاستينغ المنشورة من طرف المنتجين والاستوديوهات في المنطقة.",
      step2Icon: "search",
      step3Title: "تقدم بنقرة واحدة",
      step3Desc: "أرسل طلبك مباشرة للمجنِّدين مع رسالتك التحفيزية.",
      step3Icon: "apply",
      step4Title: "احصل على الدور",
      step4Desc: "استقبل الردود، اجتز الاختبارات وانطلق في مسيرتك السينمائية.",
      step4Icon: "star",

      // Region section
      regionLabel: "المنطقة",
      regionHeading: "لماذا جهة درعة تافيلالت؟",
      regionDesc: "مهد السينما المغربية، ورزازات ومنطقتها تستقطب كل عام إنتاجات دولية. CATOURNE تسلط الضوء على مواهب هذه الأرض السينمائية.",
      regionStat1: "+50",
      regionStat1Label: "إنتاج / سنة",
      regionStat2: "أطلس ستوديوز",
      regionStat2Label: "أكبر استوديو في أفريقيا",
      regionStat3: "+1000",
      regionStat3Label: "موهبة مسجلة",
      regionStat4: "درعة تافيلالت",
      regionStat4Label: "جهة التميز السينمائي",

      // CTA
      ctaHeading: "مشهدك القادم يبدأ هنا",
      ctaDesc: "انضم إلى مجتمع CATOURNE وتواصل مع الإنتاجات في ورزازات وجهة درعة تافيلالت.",
      ctaRegister: "إنشاء حساب مجاني",
      ctaBrowse: "استكشف الكاستينغات",
    },
  },
} as const;

type DeepString<T> = T extends string
  ? string
  : T extends object
  ? { [K in keyof T]: DeepString<T[K]> }
  : T;

export type Translations = DeepString<typeof translations.fr>;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) ?? "fr";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
