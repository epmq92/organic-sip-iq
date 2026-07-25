import { useState, useEffect, useRef } from "react";
import {
  Menu, X, Globe, Instagram, Phone, MapPin, Plus, Trash2,
  Edit3, Save, Lock, LogOut, MessageCircle, Send, Key, ChevronDown,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Lang = "ar" | "ku" | "en";
type ML = { ar: string; ku: string; en: string };

interface Product {
  id: string;
  name: ML;
  description: ML;
  price: string;
  image: string;
}

interface MenuTab {
  id: string;
  name: ML;
  products: Product[];
}

interface SiteData {
  heroImages: string[];
  mapUrl: string;
  address: ML;
  tabs: MenuTab[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const OC_PW_KEY = "oc_pw";
const OC_DATA_KEY = "oc_data";
const DEF_PW = "organic2024";

const LANG_LABELS: Record<Lang, string> = { ar: "العربية", ku: "کوردی", en: "English" };

// ─── Translations ─────────────────────────────────────────────────────────────
const TR: Record<Lang, Record<string, string>> = {
  ar: {
    cafeName: "كافيه أورغانيك", tagline: "طعم الطبيعة في كل قطرة",
    menuBtn: "اكتشف القائمة", producer: "المطور", owner: "المالك",
    ourLocation: "موقعنا", pwTitle: "لوحة إدارة المالك", pwLabel: "كلمة المرور",
    pwError: "كلمة المرور غير صحيحة", login: "دخول", adminTitle: "لوحة الإدارة",
    secHero: "صور الرئيسية", secMenu: "تبويبات القائمة", secLoc: "الموقع", secPw: "الأمان",
    addImage: "إضافة صورة", imageUrl: "رابط الصورة", tabNameLabel: "اسم التبويب",
    addTab: "إضافة تبويب", deleteTab: "حذف", products: "المنتجات",
    addProduct: "إضافة منتج", editProduct: "تعديل المنتج",
    productName: "اسم المنتج", productDesc: "الوصف", productPrice: "السعر (IQD)",
    productImg: "رابط الصورة", save: "حفظ", cancel: "إلغاء",
    mapUrl: "رابط الخريطة", address: "العنوان",
    curPw: "كلمة المرور الحالية", newPw: "كلمة المرور الجديدة",
    changePw: "تغيير كلمة المرور", pwChanged: "✓ تم تغيير كلمة المرور", pwWrong: "كلمة المرور الحالية غير صحيحة",
    logout: "تسجيل الخروج", saved: "✓ تم الحفظ", followUs: "تواصل معنا",
    nameAr: "الاسم بالعربية", nameKu: "الاسم بالكردية", nameEn: "الاسم بالإنجليزية",
    descAr: "الوصف بالعربية", descKu: "الوصف بالكردية", descEn: "الوصف بالإنجليزية",
    addrAr: "العنوان بالعربية", addrKu: "العنوان بالكردية", addrEn: "العنوان بالإنجليزية",
    locationTitle: "الموقع والعنوان", noProducts: "لا توجد منتجات في هذا التبويب",
    delete: "حذف", edit: "تعديل", close: "إغلاق", rename: "إعادة تسمية",
    producerTitle: "معلومات المطور", heroImageAlt: "صورة المقهى",
  },
  ku: {
    cafeName: "کافێی ئۆرگانیک", tagline: "تامی سروشت لە هەر قەترێکدا",
    menuBtn: "مینیو بگەڕێ", producer: "دروستکەر", owner: "خاوەن",
    ourLocation: "شوێنمان", pwTitle: "پانێلی خاوەن", pwLabel: "وشەی نهێنی",
    pwError: "وشەی نهێنی هەڵەیە", login: "چوونەژوورەوە", adminTitle: "پانێلی بەڕێوەبردن",
    secHero: "وێنەی سەرەکی", secMenu: "تابەکانی مینیو", secLoc: "شوێن", secPw: "پاراستن",
    addImage: "زیادکردنی وێنە", imageUrl: "بەستەری وێنە", tabNameLabel: "ناوی تاب",
    addTab: "زیادکردنی تاب", deleteTab: "سڕینەوە", products: "بەرهەمەکان",
    addProduct: "زیادکردنی بەرهەم", editProduct: "دەستکاری بەرهەم",
    productName: "ناوی بەرهەم", productDesc: "وەسف", productPrice: "نرخ (IQD)",
    productImg: "بەستەری وێنە", save: "پاشەکەوتکردن", cancel: "هەڵوەشاندنەوە",
    mapUrl: "بەستەری خەریتە", address: "ناونیشان",
    curPw: "وشەی نهێنی ئێستا", newPw: "وشەی نهێنی نوێ",
    changePw: "گۆڕینی وشەی نهێنی", pwChanged: "✓ وشەی نهێنی گۆڕدرا", pwWrong: "وشەی نهێنی ئێستا هەڵەیە",
    logout: "چوونەدەرەوە", saved: "✓ پاشەکەوتکرا", followUs: "پەیوەندیمان پێوەبکە",
    nameAr: "ناو بە عەرەبی", nameKu: "ناو بە کوردی", nameEn: "ناو بە ئینگلیزی",
    descAr: "وەسف بە عەرەبی", descKu: "وەسف بە کوردی", descEn: "وەسف بە ئینگلیزی",
    addrAr: "ناونیشان بە عەرەبی", addrKu: "ناونیشان بە کوردی", addrEn: "ناونیشان بە ئینگلیزی",
    locationTitle: "شوێن و ناونیشان", noProducts: "هیچ بەرهەمێک نییە لەم تابەدا",
    delete: "سڕینەوە", edit: "دەستکاری", close: "داخستن", rename: "ناوگۆڕین",
    producerTitle: "زانیاری دروستکەر", heroImageAlt: "وێنەی کافێ",
  },
  en: {
    cafeName: "Organic Cafe", tagline: "Nature's taste in every sip",
    menuBtn: "Explore Menu", producer: "Producer", owner: "Owner",
    ourLocation: "Our Location", pwTitle: "Owner Admin Panel", pwLabel: "Password",
    pwError: "Incorrect password", login: "Login", adminTitle: "Admin Panel",
    secHero: "Hero Images", secMenu: "Menu Tabs", secLoc: "Location", secPw: "Security",
    addImage: "Add Image", imageUrl: "Image URL", tabNameLabel: "Tab Name",
    addTab: "Add Tab", deleteTab: "Delete", products: "Products",
    addProduct: "Add Product", editProduct: "Edit Product",
    productName: "Product Name", productDesc: "Description", productPrice: "Price (IQD)",
    productImg: "Image URL", save: "Save", cancel: "Cancel",
    mapUrl: "Map URL", address: "Address",
    curPw: "Current Password", newPw: "New Password",
    changePw: "Change Password", pwChanged: "✓ Password changed", pwWrong: "Current password is incorrect",
    logout: "Logout", saved: "✓ Saved", followUs: "Contact Us",
    nameAr: "Name in Arabic", nameKu: "Name in Kurdish", nameEn: "Name in English",
    descAr: "Description in Arabic", descKu: "Description in Kurdish", descEn: "Description in English",
    addrAr: "Address in Arabic", addrKu: "Address in Kurdish", addrEn: "Address in English",
    locationTitle: "Location & Address", noProducts: "No products in this tab",
    delete: "Delete", edit: "Edit", close: "Close", rename: "Rename",
    producerTitle: "Producer Info", heroImageAlt: "Cafe image",
  },
};

// ─── Default Site Data ────────────────────────────────────────────────────────
const DEFAULT_DATA: SiteData = {
  heroImages: [
    "https://images.unsplash.com/photo-1774108294505-36f1f336562b?w=1920&h=1080&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1550731358-491ded4af838?w=1920&h=1080&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=1920&h=1080&fit=crop&auto=format",
  ],
  mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=45.38,35.54,45.40,35.56&layer=mapnik&marker=35.55,45.39",
  address: {
    ar: "السليمانية، كردستان العراق — الشارع الرئيسي",
    ku: "سلێمانی، کوردستانی عێراق — شەقامی سەرەکی",
    en: "Sulaymaniyah, Kurdistan Iraq — Main Street",
  },
  tabs: [
    {
      id: "hot", name: { ar: "مشروبات ساخنة", ku: "خواردنی گەرم", en: "Hot Drinks" },
      products: [
        { id: "h1", name: { ar: "قهوة عربية", ku: "قاوەی عەرەبی", en: "Arabic Coffee" }, description: { ar: "قهوة عربية أصيلة بالهيل والزعفران", ku: "قاوەی عەرەبی ئەسڵی لەگەڵ هێڵ و زەعفەران", en: "Authentic Arabic coffee with cardamom and saffron" }, price: "3000", image: "https://images.unsplash.com/photo-1670404161009-29548c027d06?w=500&h=360&fit=crop&auto=format" },
        { id: "h2", name: { ar: "لاتيه", ku: "لاتێ", en: "Latte" }, description: { ar: "اسبريسو طازج مع حليب مبخر ناعم", ku: "ئیسپریسۆی تازە لەگەڵ شیری نەرمی بوخاری", en: "Fresh espresso with velvety steamed milk" }, price: "5000", image: "https://images.unsplash.com/photo-1742549626436-bf3c11dab212?w=500&h=360&fit=crop&auto=format" },
        { id: "h3", name: { ar: "شاي أعشاب عضوي", ku: "چای ئۆتریشکی ئۆرگانیک", en: "Organic Herbal Tea" }, description: { ar: "مزيج من أعشاب الطبيعة الطازجة", ku: "تێکەڵەیەک لە ئۆتریشکی سروشتی تازە", en: "A blend of fresh natural herbs" }, price: "2500", image: "https://images.unsplash.com/photo-1577594412764-f8fa57d4e5b4?w=500&h=360&fit=crop&auto=format" },
      ],
    },
    {
      id: "cold", name: { ar: "مشروبات باردة", ku: "خواردنی سارد", en: "Cold Drinks" },
      products: [
        { id: "c1", name: { ar: "عصير برتقال طازج", ku: "ئاوی پرتەقاڵی تازە", en: "Fresh Orange Juice" }, description: { ar: "عصير برتقال طبيعي ١٠٠٪ بدون إضافات", ku: "ئاوی پرتەقاڵی سروشتی ١٠٠٪ بەبێ زیادە", en: "100% natural orange juice, no additives" }, price: "3500", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&h=360&fit=crop&auto=format" },
        { id: "c2", name: { ar: "ليموناضة بالنعناع", ku: "لیمۆنادەی نینوو", en: "Mint Lemonade" }, description: { ar: "ليمون طازج مع نعناع وسكر طبيعي", ku: "لیمۆی تازە لەگەڵ نینوو و شەکری سروشتی", en: "Fresh lemon with mint and natural sugar" }, price: "3000", image: "https://images.unsplash.com/photo-1514995428455-447d4443fa7f?w=500&h=360&fit=crop&auto=format" },
      ],
    },
    {
      id: "smoothies", name: { ar: "السموذي", ku: "سموودی", en: "Smoothies" },
      products: [
        { id: "s1", name: { ar: "سموذي الفراولة", ku: "سموودی توو فرەنگی", en: "Strawberry Smoothie" }, description: { ar: "فراولة طازجة مع حليب وعسل طبيعي", ku: "توو فرەنگی تازە لەگەڵ شیر و هەنگوینی سروشتی", en: "Fresh strawberry with milk and natural honey" }, price: "6000", image: "https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=500&h=360&fit=crop&auto=format" },
        { id: "s2", name: { ar: "سموذي المانجو", ku: "سموودی مانگۆ", en: "Mango Smoothie" }, description: { ar: "مانجو طبيعية مع جوز الهند", ku: "مانگۆی سروشتی لەگەڵ نارگیل", en: "Natural mango with coconut water" }, price: "6500", image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=500&h=360&fit=crop&auto=format" },
        { id: "s3", name: { ar: "سموذي التوت", ku: "سموودی تووتی شین", en: "Blueberry Smoothie" }, description: { ar: "توت أزرق طازج غني بالمضادات الأكسدة", ku: "تووتی شینی تازە، دەوڵەمەند بە ئانتی ئۆکسیدەنت", en: "Fresh blueberry rich in antioxidants" }, price: "7000", image: "https://images.unsplash.com/photo-1577594412764-f8fa57d4e5b4?w=500&h=360&fit=crop&auto=format" },
      ],
    },
    {
      id: "coffee", name: { ar: "قهوة مختصة", ku: "قاوەی تایبەت", en: "Specialty Coffee" },
      products: [
        { id: "co1", name: { ar: "اسبريسو", ku: "ئیسپریسۆ", en: "Espresso" }, description: { ar: "شوت اسبريسو مركز من أجود حبوب البن", ku: "شۆتی ئیسپریسۆی بەهێز لە باشترین تووری قاوەدا", en: "Concentrated shot from premium coffee beans" }, price: "2000", image: "https://images.unsplash.com/photo-1550731358-491ded4af838?w=500&h=360&fit=crop&auto=format" },
        { id: "co2", name: { ar: "كابتشينو", ku: "کاپووچینۆ", en: "Cappuccino" }, description: { ar: "اسبريسو مع حليب مبخر ورغوة كثيفة", ku: "ئیسپریسۆ لەگەڵ شیری بوخاری و کۆپووی قووڵ", en: "Espresso with steamed milk and thick foam" }, price: "5000", image: "https://images.unsplash.com/photo-1670404161009-29548c027d06?w=500&h=360&fit=crop&auto=format" },
      ],
    },
    {
      id: "sandwiches", name: { ar: "السندويتشات", ku: "ساندەوێچ", en: "Sandwiches" },
      products: [
        { id: "sw1", name: { ar: "سندويتش الخضار العضوي", ku: "ساندەوێچی سەوزەی ئۆرگانیک", en: "Organic Veggie Sandwich" }, description: { ar: "خضار عضوية طازجة مع جبن وصلصة خاصة", ku: "سەوزەی ئۆرگانیکی تازە لەگەڵ پەنیر و سۆسی تایبەت", en: "Fresh organic vegetables with cheese and special sauce" }, price: "7000", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=360&fit=crop&auto=format" },
        { id: "sw2", name: { ar: "سندويتش الدجاج", ku: "ساندەوێچی مریشک", en: "Chicken Sandwich" }, description: { ar: "دجاج مشوي طازج مع خضار ومايونيز", ku: "مریشکی بریانی تازە لەگەڵ سەوزە و مایۆنیز", en: "Grilled fresh chicken with vegetables and mayo" }, price: "8500", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&h=360&fit=crop&auto=format" },
      ],
    },
    {
      id: "desserts", name: { ar: "الحلويات", ku: "شیرینی", en: "Desserts" },
      products: [
        { id: "d1", name: { ar: "كيك الشوكولاتة البلجيكية", ku: "کێکی چکلێتی بەلجیکی", en: "Belgian Chocolate Cake" }, description: { ar: "كيك فاخر بالشوكولاتة الداكنة البلجيكية", ku: "کێکی نایاب بە چکلێتی تاریکی بەلجیکی", en: "Premium cake with rich Belgian dark chocolate" }, price: "8000", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=360&fit=crop&auto=format" },
        { id: "d2", name: { ar: "تشيز كيك التوت", ku: "چیزکێکی تووت", en: "Berry Cheesecake" }, description: { ar: "تشيز كيك كريمي مع تنوع التوت الطازج", ku: "چیزکێکی کریمی لەگەڵ جۆرەبەجۆری تووتی تازە", en: "Creamy cheesecake with assorted fresh berries" }, price: "9000", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=360&fit=crop&auto=format" },
      ],
    },
    {
      id: "breakfast", name: { ar: "الإفطار", ku: "ناشتا", en: "Breakfast" },
      products: [
        { id: "b1", name: { ar: "طبق الإفطار الصحي", ku: "تەبسی ناشتای تەندروست", en: "Healthy Breakfast Plate" }, description: { ar: "بيض عضوي مع أفوكادو وخبز أسمر وخضار", ku: "هێلکەی ئۆرگانیک لەگەڵ ئاڤۆکادۆ و نانی قاوەیی و سەوزە", en: "Organic eggs with avocado, brown bread and greens" }, price: "10000", image: "https://images.unsplash.com/photo-1514995428455-447d4443fa7f?w=500&h=360&fit=crop&auto=format" },
        { id: "b2", name: { ar: "فطائر بالعسل", ku: "پاستری هەنگوینی", en: "Honey Pastries" }, description: { ar: "فطائر طازجة محلية الصنع مع عسل طبيعي", ku: "پاستری تازەی دەستکرد لەگەڵ هەنگوینی سروشتی", en: "Fresh homemade pastries with natural honey" }, price: "6500", image: "https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=500&h=360&fit=crop&auto=format" },
      ],
    },
    {
      id: "salads", name: { ar: "السلطات", ku: "سەلاتە", en: "Salads" },
      products: [
        { id: "sa1", name: { ar: "سلطة قيصر", ku: "سەلاتەی قەیسەر", en: "Caesar Salad" }, description: { ar: "خس روماني طازج مع صلصة القيصر وجبن البارميزان", ku: "کاسی ڕومانی تازە لەگەڵ سۆسی قەیسەر و پارمیزان", en: "Fresh romaine with classic Caesar dressing and parmesan" }, price: "8500", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=360&fit=crop&auto=format" },
        { id: "sa2", name: { ar: "سلطة الفيتا والزيتون", ku: "سەلاتەی فێتا و زەیتوون", en: "Feta & Olive Salad" }, description: { ar: "طماطم وخيار وجبن فيتا وزيتون أسود", ku: "تەماتم و خیار و پەنیری فێتا و زەیتوونی ڕەش", en: "Tomatoes, cucumber, feta cheese and black olives" }, price: "7500", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=360&fit=crop&auto=format" },
      ],
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isRTL = (l: Lang) => l !== "en";
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function loadData(): SiteData {
  try {
    const raw = localStorage.getItem(OC_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_DATA;
}
const saveData = (d: SiteData) => {
  try { localStorage.setItem(OC_DATA_KEY, JSON.stringify(d)); } catch {}
};
const loadPw = () => { try { return localStorage.getItem(OC_PW_KEY) || DEF_PW; } catch { return DEF_PW; } };
const savePw = (p: string) => { try { localStorage.setItem(OC_PW_KEY, p); } catch {} };

// ─── MLInput Component ────────────────────────────────────────────────────────
function MLInput({
  value, onChange, labels,
}: { value: ML; onChange: (v: ML) => void; labels: [string, string, string] }) {
  return (
    <div className="space-y-2">
      {(["ar", "ku", "en"] as Lang[]).map((l, i) => (
        <div key={l}>
          <label className="text-xs text-green-300/70 block mb-1">{labels[i]}</label>
          <input
            dir={isRTL(l) ? "rtl" : "ltr"}
            value={value[l]}
            onChange={(e) => onChange({ ...value, [l]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-green-950/60 border border-green-700/40 text-white text-sm placeholder:text-green-700 focus:outline-none focus:border-amber-400/80 transition-colors"
          />
        </div>
      ))}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>("ar");
  const [data, setData] = useState<SiteData>(() => loadData());
  const [ownerPw, setOwnerPw] = useState(loadPw);

  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ownerLoginOpen, setOwnerLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [producerOpen, setProducerOpen] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);

  // Hero slideshow
  const [heroIdx, setHeroIdx] = useState(0);

  // Menu tab
  const [activeTab, setActiveTab] = useState(0);

  // Owner login
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  // Admin
  const [adminSection, setAdminSection] = useState<"hero" | "menu" | "location" | "security">("hero");
  const [adminTabIdx, setAdminTabIdx] = useState(0);

  // Product modal
  const [productModal, setProductModal] = useState<{
    tabId: string;
    product: { id?: string; name: ML; description: ML; price: string; image: string };
  } | null>(null);

  // Tab rename
  const [renamingTabId, setRenamingTabId] = useState<string | null>(null);
  const [renamingTabName, setRenamingTabName] = useState<ML>({ ar: "", ku: "", en: "" });

  // Location form
  const [locForm, setLocForm] = useState({ mapUrl: data.mapUrl, address: { ...data.address } });

  // Password change form
  const [curPwInput, setCurPwInput] = useState("");
  const [newPwInput, setNewPwInput] = useState("");

  // New image input
  const [newImgUrl, setNewImgUrl] = useState("");

  // New tab form
  const [newTabName, setNewTabName] = useState<ML>({ ar: "", ku: "", en: "" });

  // Messages
  const [adminMsg, setAdminMsg] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);

  const t = (k: string) => TR[lang][k] || k;
  const ml = (v: ML) => v[lang];
  const dir = isRTL(lang) ? "rtl" : "ltr";

  // Hero slideshow
  useEffect(() => {
    if (data.heroImages.length <= 1) return;
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % data.heroImages.length), 5000);
    return () => clearInterval(timer);
  }, [data.heroImages.length]);

  // Sync location form when admin opens
  useEffect(() => {
    if (adminOpen) setLocForm({ mapUrl: data.mapUrl, address: { ...data.address } });
  }, [adminOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => setLangDropOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  function updateData(d: SiteData) {
    setData(d);
    saveData(d);
  }

  function showMsg(msg: string) {
    setAdminMsg(msg);
    setTimeout(() => setAdminMsg(""), 2500);
  }

  function scrollToMenu() {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
    setDrawerOpen(false);
  }

  // ── Owner login ──
  function handleLogin() {
    if (pwInput === ownerPw) {
      setOwnerLoginOpen(false);
      setAdminOpen(true);
      setAdminSection("hero");
      setPwInput("");
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  // ── Admin: Hero Images ──
  function addHeroImage() {
    if (!newImgUrl.trim()) return;
    updateData({ ...data, heroImages: [...data.heroImages, newImgUrl.trim()] });
    setNewImgUrl("");
  }

  function removeHeroImage(i: number) {
    updateData({ ...data, heroImages: data.heroImages.filter((_, idx) => idx !== i) });
    if (heroIdx >= data.heroImages.length - 1) setHeroIdx(0);
  }

  // ── Admin: Tabs ──
  function addTab() {
    if (!newTabName.ar && !newTabName.en && !newTabName.ku) return;
    const tab: MenuTab = { id: uid(), name: { ...newTabName }, products: [] };
    updateData({ ...data, tabs: [...data.tabs, tab] });
    setNewTabName({ ar: "", ku: "", en: "" });
  }

  function deleteTab(id: string) {
    const idx = data.tabs.findIndex(t => t.id === id);
    const newTabs = data.tabs.filter(t => t.id !== id);
    updateData({ ...data, tabs: newTabs });
    setAdminTabIdx(Math.max(0, idx - 1));
  }

  function startRenameTab(tab: MenuTab) {
    setRenamingTabId(tab.id);
    setRenamingTabName({ ...tab.name });
  }

  function saveRenameTab() {
    if (!renamingTabId) return;
    updateData({ ...data, tabs: data.tabs.map(t => t.id === renamingTabId ? { ...t, name: renamingTabName } : t) });
    setRenamingTabId(null);
  }

  // ── Admin: Products ──
  function openAddProduct(tabId: string) {
    setProductModal({ tabId, product: { name: { ar: "", ku: "", en: "" }, description: { ar: "", ku: "", en: "" }, price: "", image: "" } });
  }

  function openEditProduct(tabId: string, product: Product) {
    setProductModal({ tabId, product: { ...product } });
  }

  function saveProduct() {
    if (!productModal) return;
    const { tabId, product } = productModal;
    if (!product.name.ar && !product.name.en && !product.name.ku) return;
    if (product.id) {
      updateData({ ...data, tabs: data.tabs.map(t => t.id === tabId ? { ...t, products: t.products.map(p => p.id === product.id ? product as Product : p) } : t) });
    } else {
      const newProduct: Product = { ...product, id: uid() };
      updateData({ ...data, tabs: data.tabs.map(t => t.id === tabId ? { ...t, products: [...t.products, newProduct] } : t) });
    }
    setProductModal(null);
  }

  function deleteProduct(tabId: string, productId: string) {
    updateData({ ...data, tabs: data.tabs.map(t => t.id === tabId ? { ...t, products: t.products.filter(p => p.id !== productId) } : t) });
  }

  // ── Admin: Location ──
  function saveLocation() {
    updateData({ ...data, mapUrl: locForm.mapUrl, address: locForm.address });
    showMsg(t("saved"));
  }

  // ── Admin: Password ──
  function changePassword() {
    if (curPwInput !== ownerPw) { showMsg(t("pwWrong")); return; }
    if (!newPwInput.trim()) return;
    savePw(newPwInput);
    setOwnerPw(newPwInput);
    setCurPwInput("");
    setNewPwInput("");
    showMsg(t("pwChanged"));
  }

  const safeAdminTabIdx = Math.min(adminTabIdx, data.tabs.length - 1);
  const adminCurrentTab = data.tabs[safeAdminTabIdx];

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div dir={dir} style={{ fontFamily: "'Cairo', sans-serif" }} className="min-h-screen bg-[#F8F3E8] text-[#2C1A0E]">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4" style={{ background: "linear-gradient(to bottom, rgba(27,58,18,0.95) 0%, rgba(27,58,18,0) 100%)" }}>
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
          aria-label="menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div className="text-center">
          <span className="text-white text-xl font-bold tracking-wide drop-shadow-lg">{t("cafeName")}</span>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="text-[10px] text-green-300 font-light tracking-widest uppercase">Organic</span>
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            <span className="text-[10px] text-green-300 font-light tracking-widest uppercase">Cafe</span>
          </div>
        </div>

        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setLangDropOpen(v => !v); }}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all gap-1"
            aria-label="language"
          >
            <Globe size={18} />
            <ChevronDown size={12} className={`transition-transform ${langDropOpen ? "rotate-180" : ""}`} />
          </button>
          {langDropOpen && (
            <div className={`absolute top-14 ${isRTL(lang) ? "left-0" : "right-0"} w-36 rounded-xl overflow-hidden shadow-2xl border border-white/10`} style={{ background: "#1B3A12" }}>
              {(["ar", "ku", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={(e) => { e.stopPropagation(); setLang(l); setLangDropOpen(false); }}
                  className={`w-full text-right px-4 py-3 text-sm font-medium transition-colors ${lang === l ? "bg-amber-500/20 text-amber-400" : "text-white/80 hover:bg-white/10"}`}
                  dir={isRTL(l) ? "rtl" : "ltr"}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden bg-[#1B3A12]">
        {/* Slideshow images */}
        {data.heroImages.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={t("heroImageAlt")}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.7) 100%)" }} />

        {/* Dots */}
        {data.heroImages.length > 1 && (
          <div className="absolute bottom-32 inset-x-0 flex justify-center gap-2">
            {data.heroImages.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? "bg-amber-400 w-6" : "bg-white/40"}`} />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-amber-400/60" />
            <span className="text-amber-400 text-xs font-medium tracking-[0.3em] uppercase">Organic Cafe</span>
            <div className="w-8 h-px bg-amber-400/60" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-xl" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            {t("cafeName")}
          </h1>
          <p className="text-lg md:text-2xl text-white/80 font-light mb-10 max-w-xl">
            {t("tagline")}
          </p>
          <button
            onClick={scrollToMenu}
            className="group flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base text-white transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #C8860A 0%, #D4A020 100%)" }}
          >
            <span>{t("menuBtn")}</span>
            <ChevronDown size={18} className="transition-transform group-hover:translate-y-1" />
          </button>
        </div>
      </section>

      {/* ── MENU ───────────────────────────────────────────────────────────── */}
      <section ref={menuRef} className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-12 bg-[#C8860A]/40" />
              <span className="text-[#C8860A] text-xs font-semibold tracking-[0.25em] uppercase">Menu</span>
              <div className="h-px w-12 bg-[#C8860A]/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1B3A12]">{t("menuBtn").replace("اكتشف ", "").replace("Explore ", "").replace(" بگەڕێ", "")}</h2>
          </div>

          {/* Tab bar */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide snap-x">
            {data.tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === i
                    ? "text-white shadow-lg shadow-green-900/20"
                    : "bg-white text-[#2C1A0E]/70 hover:bg-[#EDE7D5] border border-[#2C1A0E]/10"
                }`}
                style={activeTab === i ? { background: "linear-gradient(135deg, #1B3A12 0%, #2D5A1E 100%)" } : {}}
              >
                {ml(tab.name)}
              </button>
            ))}
          </div>

          {/* Products grid */}
          {data.tabs[activeTab] && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.tabs[activeTab].products.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#2C1A0E]/5">
                  <div className="relative h-48 bg-[#EDE7D5] overflow-hidden">
                    <img
                      src={product.image}
                      alt={ml(product.name)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base text-[#2C1A0E] mb-1">{ml(product.name)}</h3>
                    <p className="text-sm text-[#7A6040] leading-relaxed mb-3 line-clamp-2">{ml(product.description)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#C8860A] font-black text-lg">{Number(product.price).toLocaleString()}</span>
                      <span className="text-xs text-[#7A6040] font-medium bg-[#EDE7D5] px-2 py-1 rounded-full">IQD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LOCATION ───────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-12 bg-[#C8860A]/40" />
              <MapPin size={16} className="text-[#C8860A]" />
              <div className="h-px w-12 bg-[#C8860A]/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1B3A12]">{t("locationTitle")}</h2>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-[#2C1A0E]/8" style={{ height: "280px" }}>
            <iframe
              src={data.mapUrl}
              title="Cafe Location"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
          <div className="mt-5 flex items-start gap-3 bg-[#F8F3E8] rounded-xl p-4">
            <MapPin size={20} className="text-[#C8860A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#2C1A0E]">{t("ourLocation")}</p>
              <p className="text-[#7A6040] text-sm mt-1">{ml(data.address)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER / PRODUCER INFO ─────────────────────────────────────────── */}
      <footer className="py-14 px-4" style={{ background: "linear-gradient(135deg, #0F2210 0%, #1B3A12 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-px bg-amber-400/40" />
            <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">By</span>
            <div className="w-6 h-px bg-amber-400/40" />
          </div>
          <h3 className="text-white font-bold text-xl mb-1">{t("producerTitle")}</h3>
          <p className="text-green-400/60 text-sm mb-8">Developer & Designer</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto mb-10">
            {/* Instagram */}
            <a href="https://instagram.com/xs92m" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
              <Instagram size={22} className="text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="text-white/60 text-xs">@xs92m</span>
            </a>
            {/* Telegram */}
            <a href="https://t.me/xs92m" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
              <Send size={22} className="text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="text-white/60 text-xs">@xs92m</span>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/9647706460230" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
              <MessageCircle size={22} className="text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-white/60 text-xs">@xm92s</span>
            </a>
            {/* Phone */}
            <a href="tel:+9647706460230"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
              <Phone size={22} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-white/60 text-xs">0770 646 0230</span>
            </a>
          </div>

          <div className="h-px bg-white/10 max-w-xs mx-auto mb-6" />
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} {t("cafeName")} — {t("followUs")}</p>
        </div>
      </footer>

      {/* ── DRAWER ─────────────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex" dir={dir}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className={`relative w-72 h-full flex flex-col shadow-2xl ${isRTL(lang) ? "mr-auto" : "ml-auto"}`}
            style={{ background: "linear-gradient(160deg, #1B3A12 0%, #0F2210 100%)" }}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <span className="text-white font-bold text-lg">{t("cafeName")}</span>
              <button onClick={() => setDrawerOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-3 p-5">
              {/* Producer button */}
              <button
                onClick={() => { setProducerOpen(true); setDrawerOpen(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/8 hover:bg-white/14 text-white text-base font-semibold transition-all group border border-white/10"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(200,134,10,0.2)" }}>
                  <Instagram size={20} className="text-amber-400" />
                </div>
                <span>{t("producer")}</span>
              </button>
              {/* Owner button */}
              <button
                onClick={() => { setOwnerLoginOpen(true); setDrawerOpen(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/8 hover:bg-white/14 text-white text-base font-semibold transition-all group border border-white/10"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(200,134,10,0.2)" }}>
                  <Lock size={20} className="text-amber-400" />
                </div>
                <span>{t("owner")}</span>
              </button>
            </div>
            <div className="p-5 border-t border-white/10">
              <p className="text-white/30 text-xs text-center">{t("cafeName")}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCER OVERLAY ───────────────────────────────────────────────── */}
      {producerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={dir}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setProducerOpen(false)} />
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(160deg, #1B3A12 0%, #0F2210 100%)" }}>
            <button onClick={() => setProducerOpen(false)} className="absolute top-4 end-4 text-white/50 hover:text-white transition-colors">
              <X size={22} />
            </button>
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #C8860A, #D4A020)" }}>
                <span className="text-white text-3xl font-black">X</span>
              </div>
              <h3 className="text-white font-bold text-2xl mb-1">{t("producerTitle")}</h3>
              <p className="text-green-400/60 text-sm mb-7">Developer & Designer</p>
              <div className="space-y-3">
                <a href="https://instagram.com/xs92m" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/8 hover:bg-white/14 transition-colors text-white group">
                  <Instagram size={20} className="text-pink-400" />
                  <div className="text-start">
                    <p className="text-xs text-white/40 leading-none mb-0.5">Instagram</p>
                    <p className="font-semibold text-sm">@xs92m</p>
                  </div>
                </a>
                <a href="https://t.me/xs92m" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/8 hover:bg-white/14 transition-colors text-white">
                  <Send size={20} className="text-sky-400" />
                  <div className="text-start">
                    <p className="text-xs text-white/40 leading-none mb-0.5">Telegram</p>
                    <p className="font-semibold text-sm">@xs92m</p>
                  </div>
                </a>
                <a href="https://wa.me/9647706460230" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/8 hover:bg-white/14 transition-colors text-white">
                  <MessageCircle size={20} className="text-green-400" />
                  <div className="text-start">
                    <p className="text-xs text-white/40 leading-none mb-0.5">WhatsApp</p>
                    <p className="font-semibold text-sm">@xm92s</p>
                  </div>
                </a>
                <a href="tel:+9647706460230"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/8 hover:bg-white/14 transition-colors text-white">
                  <Phone size={20} className="text-amber-400" />
                  <div className="text-start">
                    <p className="text-xs text-white/40 leading-none mb-0.5">Phone</p>
                    <p className="font-semibold text-sm">0770 646 0230</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── OWNER LOGIN MODAL ──────────────────────────────────────────────── */}
      {ownerLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={dir}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => { setOwnerLoginOpen(false); setPwInput(""); setPwError(false); }} />
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(160deg, #1B3A12 0%, #0F2210 100%)" }}>
            <button onClick={() => { setOwnerLoginOpen(false); setPwInput(""); setPwError(false); }} className="absolute top-4 end-4 text-white/50 hover:text-white transition-colors">
              <X size={22} />
            </button>
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(200,134,10,0.15)", border: "1px solid rgba(200,134,10,0.3)" }}>
                  <Lock size={28} className="text-amber-400" />
                </div>
              </div>
              <h3 className="text-white font-bold text-xl text-center mb-6">{t("pwTitle")}</h3>
              <div className="mb-4">
                <label className="text-green-300/70 text-sm block mb-2">{t("pwLabel")}</label>
                <input
                  type="password"
                  value={pwInput}
                  onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••••"
                  className={`w-full px-4 py-3 rounded-xl bg-green-950/60 border text-white placeholder:text-green-800 focus:outline-none transition-colors ${pwError ? "border-red-500 focus:border-red-400" : "border-green-700/40 focus:border-amber-400/80"}`}
                  dir="ltr"
                />
                {pwError && <p className="text-red-400 text-xs mt-2">{t("pwError")}</p>}
              </div>
              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #C8860A, #D4A020)" }}
              >
                {t("login")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADMIN PANEL ────────────────────────────────────────────────────── */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 flex" dir={dir} style={{ fontFamily: "'Cairo', sans-serif" }}>
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 flex flex-col border-e border-green-900/60" style={{ background: "#0A1F0A" }}>
            <div className="p-4 border-b border-green-900/40">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Admin</p>
              <p className="text-white font-bold text-sm">{t("adminTitle")}</p>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {(["hero", "menu", "location", "security"] as const).map((sec) => {
                const icons = { hero: "🖼️", menu: "📋", location: "📍", security: "🔐" };
                const labels = { hero: t("secHero"), menu: t("secMenu"), location: t("secLoc"), security: t("secPw") };
                return (
                  <button
                    key={sec}
                    onClick={() => setAdminSection(sec)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${adminSection === sec ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
                    style={adminSection === sec ? { background: "rgba(200,134,10,0.2)", color: "#E8A020" } : {}}
                  >
                    <span>{icons[sec]}</span>
                    <span>{labels[sec]}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-green-900/40">
              {adminMsg && <p className="text-amber-400 text-xs text-center mb-3">{adminMsg}</p>}
              <button
                onClick={() => setAdminOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-900/20 transition-all"
              >
                <LogOut size={16} />
                <span>{t("logout")}</span>
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto" style={{ background: "#0F2210" }}>
            <div className="p-6 max-w-2xl">

              {/* ── HERO IMAGES ── */}
              {adminSection === "hero" && (
                <div>
                  <h2 className="text-white font-bold text-xl mb-6">{t("secHero")}</h2>
                  <div className="space-y-3 mb-6">
                    {data.heroImages.map((url, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-green-950/60 border border-green-800/30">
                        <img src={url} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0 bg-green-900" />
                        <p className="flex-1 text-white/60 text-xs truncate" dir="ltr">{url}</p>
                        <button onClick={() => removeHeroImage(i)} className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newImgUrl}
                      onChange={(e) => setNewImgUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addHeroImage()}
                      placeholder={t("imageUrl")}
                      dir="ltr"
                      className="flex-1 px-4 py-3 rounded-xl bg-green-950/60 border border-green-700/40 text-white text-sm placeholder:text-green-700 focus:outline-none focus:border-amber-400/80 transition-colors"
                    />
                    <button onClick={addHeroImage} className="px-5 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 transition-all hover:opacity-90" style={{ background: "#C8860A" }}>
                      <Plus size={16} />
                      <span>{t("addImage")}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── MENU TABS ── */}
              {adminSection === "menu" && (
                <div>
                  <h2 className="text-white font-bold text-xl mb-6">{t("secMenu")}</h2>

                  {/* Tab list */}
                  <div className="flex gap-2 flex-wrap mb-6">
                    {data.tabs.map((tab, i) => (
                      <button
                        key={tab.id}
                        onClick={() => { setAdminTabIdx(i); setRenamingTabId(null); }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${safeAdminTabIdx === i ? "text-white" : "bg-green-950/60 text-white/50 hover:text-white/80 border border-green-800/30"}`}
                        style={safeAdminTabIdx === i ? { background: "#C8860A" } : {}}
                      >
                        {ml(tab.name)}
                      </button>
                    ))}
                  </div>

                  {/* Add tab */}
                  <div className="p-4 rounded-2xl bg-green-950/40 border border-green-800/20 mb-6">
                    <p className="text-green-300/60 text-xs uppercase tracking-widest mb-3">{t("addTab")}</p>
                    <MLInput value={newTabName} onChange={setNewTabName} labels={[t("nameAr"), t("nameKu"), t("nameEn")]} />
                    <button onClick={addTab} className="mt-3 px-5 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: "#C8860A" }}>
                      <Plus size={15} /><span>{t("addTab")}</span>
                    </button>
                  </div>

                  {/* Current tab actions */}
                  {adminCurrentTab && (
                    <div>
                      {/* Tab header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-base">{ml(adminCurrentTab.name)}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => startRenameTab(adminCurrentTab)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/14 text-white/60 hover:text-white text-xs font-medium transition-all">
                            <Edit3 size={12} />{t("rename")}
                          </button>
                          <button onClick={() => deleteTab(adminCurrentTab.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400/70 hover:text-red-400 text-xs font-medium transition-all">
                            <Trash2 size={12} />{t("deleteTab")}
                          </button>
                        </div>
                      </div>

                      {/* Rename form */}
                      {renamingTabId === adminCurrentTab.id && (
                        <div className="p-4 rounded-2xl bg-green-950/40 border border-amber-700/30 mb-4">
                          <p className="text-amber-400/60 text-xs uppercase tracking-widest mb-3">{t("rename")}</p>
                          <MLInput value={renamingTabName} onChange={setRenamingTabName} labels={[t("nameAr"), t("nameKu"), t("nameEn")]} />
                          <div className="flex gap-2 mt-3">
                            <button onClick={saveRenameTab} className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: "#C8860A" }}>
                              <Save size={14} /><span>{t("save")}</span>
                            </button>
                            <button onClick={() => setRenamingTabId(null)} className="px-4 py-2.5 rounded-xl text-white/50 hover:text-white text-sm font-medium bg-white/5 transition-all">
                              {t("cancel")}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Products */}
                      <div className="space-y-3 mb-4">
                        {adminCurrentTab.products.length === 0 && (
                          <p className="text-white/30 text-sm text-center py-6">{t("noProducts")}</p>
                        )}
                        {adminCurrentTab.products.map((product) => (
                          <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-950/60 border border-green-800/30">
                            <img src={product.image} alt="" className="w-14 h-10 object-cover rounded-lg flex-shrink-0 bg-green-900" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm truncate">{ml(product.name)}</p>
                              <p className="text-white/40 text-xs">{Number(product.price).toLocaleString()} IQD</p>
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button onClick={() => openEditProduct(adminCurrentTab.id, product)} className="p-2 rounded-lg bg-white/8 hover:bg-white/14 text-white/60 hover:text-white transition-all">
                                <Edit3 size={14} />
                              </button>
                              <button onClick={() => deleteProduct(adminCurrentTab.id, product.id)} className="p-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400/60 hover:text-red-400 transition-all">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button onClick={() => openAddProduct(adminCurrentTab.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ background: "#1B3A12", border: "1px dashed rgba(200,134,10,0.5)" }}>
                        <Plus size={15} className="text-amber-400" /><span className="text-amber-400">{t("addProduct")}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── LOCATION ── */}
              {adminSection === "location" && (
                <div>
                  <h2 className="text-white font-bold text-xl mb-6">{t("secLoc")}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-green-300/70 text-xs uppercase tracking-widest block mb-2">{t("mapUrl")}</label>
                      <input
                        value={locForm.mapUrl}
                        onChange={(e) => setLocForm(f => ({ ...f, mapUrl: e.target.value }))}
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-green-950/60 border border-green-700/40 text-white text-sm placeholder:text-green-700 focus:outline-none focus:border-amber-400/80 transition-colors"
                      />
                      <p className="text-white/30 text-xs mt-1.5">Use OpenStreetMap embed URL</p>
                    </div>
                    <div>
                      <label className="text-green-300/70 text-xs uppercase tracking-widest block mb-2">{t("address")}</label>
                      <MLInput
                        value={locForm.address}
                        onChange={(v) => setLocForm(f => ({ ...f, address: v }))}
                        labels={[t("addrAr"), t("addrKu"), t("addrEn")]}
                      />
                    </div>
                    <button onClick={saveLocation} className="px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: "#C8860A" }}>
                      <Save size={16} /><span>{t("save")}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── SECURITY ── */}
              {adminSection === "security" && (
                <div>
                  <h2 className="text-white font-bold text-xl mb-6">{t("secPw")}</h2>
                  <div className="p-5 rounded-2xl bg-green-950/40 border border-green-800/20 space-y-4">
                    <div>
                      <label className="text-green-300/70 text-xs block mb-2">{t("curPw")}</label>
                      <input type="password" value={curPwInput} onChange={(e) => setCurPwInput(e.target.value)} dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-green-950/60 border border-green-700/40 text-white text-sm focus:outline-none focus:border-amber-400/80 transition-colors" />
                    </div>
                    <div>
                      <label className="text-green-300/70 text-xs block mb-2">{t("newPw")}</label>
                      <input type="password" value={newPwInput} onChange={(e) => setNewPwInput(e.target.value)} dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-green-950/60 border border-green-700/40 text-white text-sm focus:outline-none focus:border-amber-400/80 transition-colors" />
                    </div>
                    <button onClick={changePassword} className="px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: "#C8860A" }}>
                      <Key size={16} /><span>{t("changePw")}</span>
                    </button>
                  </div>
                  <div className="mt-6 p-4 rounded-2xl bg-amber-900/15 border border-amber-700/20">
                    <p className="text-amber-400/80 text-xs">Default password: <span className="font-mono font-bold">{DEF_PW}</span></p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* ── PRODUCT MODAL ──────────────────────────────────────────────────── */}
      {productModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" dir={dir}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setProductModal(null)} />
          <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl overflow-y-auto" style={{ background: "#0F2210", maxHeight: "90vh" }}>
            <div className="flex items-center justify-between p-5 border-b border-green-900/40">
              <h3 className="text-white font-bold">{productModal.product.id ? t("editProduct") : t("addProduct")}</h3>
              <button onClick={() => setProductModal(null)} className="text-white/50 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-green-300/70 text-xs uppercase tracking-widest block mb-2">{t("productName")}</label>
                <MLInput
                  value={productModal.product.name}
                  onChange={(v) => setProductModal(m => m ? { ...m, product: { ...m.product, name: v } } : null)}
                  labels={[t("nameAr"), t("nameKu"), t("nameEn")]}
                />
              </div>
              <div>
                <label className="text-green-300/70 text-xs uppercase tracking-widest block mb-2">{t("productDesc")}</label>
                <MLInput
                  value={productModal.product.description}
                  onChange={(v) => setProductModal(m => m ? { ...m, product: { ...m.product, description: v } } : null)}
                  labels={[t("descAr"), t("descKu"), t("descEn")]}
                />
              </div>
              <div>
                <label className="text-green-300/70 text-xs block mb-2">{t("productPrice")}</label>
                <input
                  type="number"
                  value={productModal.product.price}
                  onChange={(e) => setProductModal(m => m ? { ...m, product: { ...m.product, price: e.target.value } } : null)}
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl bg-green-950/60 border border-green-700/40 text-white text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                />
              </div>
              <div>
                <label className="text-green-300/70 text-xs block mb-2">{t("productImg")}</label>
                <input
                  value={productModal.product.image}
                  onChange={(e) => setProductModal(m => m ? { ...m, product: { ...m.product, image: e.target.value } } : null)}
                  dir="ltr"
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-green-950/60 border border-green-700/40 text-white text-sm placeholder:text-green-700 focus:outline-none focus:border-amber-400/80 transition-colors"
                />
                {productModal.product.image && (
                  <img src={productModal.product.image} alt="" className="mt-2 w-full h-28 object-cover rounded-xl bg-green-900" />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveProduct} className="flex-1 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: "#C8860A" }}>
                  <Save size={16} /><span>{t("save")}</span>
                </button>
                <button onClick={() => setProductModal(null)} className="px-5 py-3 rounded-xl text-white/50 hover:text-white text-sm font-medium bg-white/5 transition-all">
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
