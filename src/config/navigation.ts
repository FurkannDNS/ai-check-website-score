import { NavItem } from "@/types/site";

export const mainNavItems: NavItem[] = [
  { label: "Neden AI Ready?", href: "#neden" },
  { label: "Temel Özellikler", href: "#ozellikler" },
  { label: "Nasıl Çalışır?", href: "#nasil-calisir" },
  { label: "Doğrulama Simülatörü", href: "#dogrulama" },
  { label: "Paketler", href: "#paketler" },
  { label: "SSS", href: "#sss" },
];

export const footerNavItems = {
  solutions: [
    { label: "7/24 AI İletişim Entegrasyonu", href: "#ozellikler" },
    { label: "Otonom Satış Motoru", href: "#ozellikler" },
    { label: "AI Motorlarında (AEO) Görünürlük", href: "#ozellikler" },
    { label: "Akıllı Veri & Güvenlik Denetimi", href: "#ozellikler" },
  ],
  verification: [
    { label: "Rozet Sorgulama Portalı", href: "#dogrulama" },
    { label: "Sertifika Kriterleri", href: "#nasil-calisir" },
    { label: "Rozet Doğrulama Standartları", href: "#nasil-calisir" },
    { label: "API ve Webhook Entegrasyonu", href: "#dogrulama" },
  ],
  company: [
    { label: "METAFONICS Hakkında", href: "https://metafonics.com", isExternal: true },
    { label: "Gizlilik Politikası", href: "#" },
    { label: "Kullanım Şartları", href: "#" },
    { label: "İletişim & Başvuru", href: "#iletisim" },
  ],
};
