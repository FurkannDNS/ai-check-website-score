import { FeatureItem } from "@/types/content";

export const coreReferencePillars: FeatureItem[] = [
  {
    id: "ai-communication",
    title: "7/24 AI İletişim",
    subtitle: "Asla Müşteri Kaybetmeyin",
    description:
      "Günün her saati müşterilerinize anında yanıt veren sesli ve yazılı yapay zekâ asistanlarıyla müşteri memnuniyetinizi zirveye taşıyın.",
    iconName: "PhoneCall",
    gradient: "from-cyan-500 to-blue-600",
    badge: "Kesintisiz Destek",
    bulletPoints: [
      "Gecikmesiz akıllı sesli ve chat bot yanıtları",
      "Doğal dil işleme ile insansı iletişim kalitesi",
      "WhatsApp, Web ve Telefon entegrasyonu",
      "Kişiselleştirilmiş destek ve randevu oluşturma",
    ],
    metrics: {
      value: "< 2 sn",
      label: "Ortalama İlk Yanıt Süresi",
    },
  },
  {
    id: "more-sales",
    title: "Daha Fazla Satış",
    subtitle: "Otonom Gelir Artışı",
    description:
      "Potansiyel müşterileri satış hunisine otomatik dahil eden, kişiye özel teklif sunan ve dönüşüm oranlarını katlayan akıllı satış modelleri.",
    iconName: "TrendingUp",
    gradient: "from-blue-500 to-indigo-600",
    badge: "%42 Artış",
    bulletPoints: [
      "Ziyaretçiyi satın almaya yönlendiren otonom diyaloglar",
      "Çapraz satış ve yukarı satış (cross-sell / upsell) optimizasyonu",
      "Terk edilen sepetleri geri kazandıran akıllı hatırlatıcılar",
      "Gerçek zamanlı CRM ve sipariş tetikleyicileri",
    ],
    metrics: {
      value: "+%42",
      label: "Ortalama Dönüşüm Artışı",
    },
  },
  {
    id: "ai-visibility",
    title: "AI'da Görünürlük",
    subtitle: "AEO (AI Engine Optimization)",
    description:
      "ChatGPT, Perplexity, Google Gemini ve Claude gibi yapay zekâ modellerinin arama ve tavsiye listelerinde markanızı 1. sıraya taşıyın.",
    iconName: "Sparkles",
    gradient: "from-cyan-400 to-teal-500",
    badge: "Geleceğin SEO'su",
    bulletPoints: [
      "AI motorlarının anlayabileceği semantik veri altyapısı",
      "LLM tabanlı arama sonuçlarında doğrudan önerilme",
      "Doğrulanmış 'AI READY' rozeti ile güvenilirlik artışı",
      "Sürekli güncellenen AI arama ve indeksleme raporu",
    ],
    metrics: {
      value: "3.8x",
      label: "AI Öneri Sıralaması Artışı",
    },
  },
];

export const secondaryFeatures: FeatureItem[] = [
  {
    id: "verified-badge",
    title: "Resmi AI Ready Rozeti",
    subtitle: "Müşterilerinize Güven Verin",
    description:
      "Web sitenize, e-posta imzalarınıza ve sosyal profillerinize ekleyebileceğiniz dinamik, tıklanabilir ve taranabilir doğrulanmış rozet.",
    iconName: "ShieldCheck",
    gradient: "from-emerald-400 to-cyan-500",
  },
  {
    id: "audit-reports",
    title: "Detaylı AI Uyumluluk Raporu",
    subtitle: "Zayıf Noktaları Anında Görün",
    description:
      "İşletmenizin yapay zeka entegrasyonu, veri akışı ve müşteri süreçlerindeki açıkları gösteren kapsamlı 360° denetim.",
    iconName: "BarChart3",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: "metafonics-infrastructure",
    title: "Metafonics AI Altyapı Desteği",
    subtitle: "Uçtan Uca Kurulum & Danışmanlık",
    description:
      "Sertifikayı alırken eksik kalan tüm yapay zekâ entegrasyonlarınız Metafonics mühendisleri tarafından anahtar teslim tamamlanır.",
    iconName: "Cpu",
    gradient: "from-blue-600 to-cyan-500",
  },
];
