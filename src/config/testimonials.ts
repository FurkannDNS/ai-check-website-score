import { TestimonialItem, StatItem } from "@/types/content";

export const testimonials: TestimonialItem[] = [
  {
    id: "test-1",
    author: "Emre Yılmaz",
    role: "Genel Müdür",
    company: "Novasphere E-Ticaret",
    quote:
      "AI READY rozetini sitemize ekledikten sonra hem yurt dışı müşterilerimizin güveni arttı hem de Perplexity aramalarında kategorimizde 1. sıraya yükseldik. Satış dönüşümlerimiz %48 arttı.",
    rating: 5,
    certificateId: "ARB-2025-9921",
    growthMetric: "+%48 Satış Artışı",
  },
  {
    id: "test-2",
    author: "Selin Kaya",
    role: "Pazarlama Direktörü",
    company: "Apex Lojistik A.Ş.",
    quote:
      "7/24 AI İletişim entegrasyonu sayesinde gece saatlerinde gelen taleplerin %94'ü otomatik randevuya ve teklife dönüştü. Metafonics altyapısı mükemmel çalışıyor.",
    rating: 5,
    certificateId: "ARB-2025-4102",
    growthMetric: "7/24 Sıfır Cevapsız Çağrı",
  },
  {
    id: "test-3",
    author: "Kerem Alpay",
    role: "Kurucu Ortak",
    company: "Lumina Sağlık Grubu",
    quote:
      "Doğrulanmış sertifika rozeti web sitemizde yer aldığı andan itibaren hasta randevu formlarının doluluk oranı iki katına çıktı. AI çağında geride kalmamak şart.",
    rating: 5,
    certificateId: "ARB-2025-6310",
    growthMetric: "2.4x Randevu Dönüşümü",
  },
];

export const landingStats: StatItem[] = [
  {
    value: "500+",
    label: "Doğrulanmış İşletme",
    sublabel: "Aktif AI READY Rozeti Sahibi",
    iconName: "ShieldCheck",
  },
  {
    value: "%42",
    label: "Ortalama Satış Artışı",
    sublabel: "Sertifikalı Şirketlerde",
    iconName: "TrendingUp",
  },
  {
    value: "7/24",
    label: "Kesintisiz AI İletişimi",
    sublabel: "< 2 Saniye Yanıt Hızı",
    iconName: "PhoneCall",
  },
  {
    value: "99.8%",
    label: "Sistem Doğruluğu",
    sublabel: "Metafonics AI Motoru Güvencesi",
    iconName: "CheckCircle",
  },
];
