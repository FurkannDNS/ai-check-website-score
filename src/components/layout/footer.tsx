import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo, MetafonicsSignature } from "@/components/common/logo";
import { footerNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Globe, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950/90 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-cyan-900/10 blur-[120px] pointer-events-none -z-10" />

      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand & Metafonics Identity Column */}
          <div className="sm:col-span-2 space-y-5">
            <Logo size="md" showMetafonics={false} />
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              İşletmenizi yapay zekâ çağına hazır hale getirin. 7/24 AI İletişim,
              Otonom Satış Motoru ve AEO görünürlük standartları ile doğrulanmış güven rozeti.
            </p>

            {/* Official domain pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{siteConfig.url.replace("https://", "")}</span>
            </div>

            {/* Metafonics Provider Badge */}
            <div className="pt-2">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-medium">
                Geliştirici & Yetkili Sertifikasyon Sağlayıcısı
              </p>
              <MetafonicsSignature />
            </div>
          </div>

          {/* Solutions Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AI Çözümleri
            </h4>
            <ul className="space-y-2.5">
              {footerNavItems.solutions.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification & Trust Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Sertifika & Doğrulama
            </h4>
            <ul className="space-y-2.5">
              {footerNavItems.verification.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Metafonics */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              İletişim & Destek
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${siteConfig.company.email}`} className="hover:text-cyan-300 transition-colors">
                  {siteConfig.company.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${siteConfig.company.phone.replace(/\s+/g, '')}`} className="hover:text-cyan-300 transition-colors">
                  {siteConfig.company.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{siteConfig.company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} AI READY BUSINESS. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-400 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">
              Kullanım Koşulları
            </Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">
              Güvenlik & KVKK
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
