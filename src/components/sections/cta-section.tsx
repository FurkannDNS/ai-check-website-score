"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetafonicsSignature } from "@/components/common/logo";

export function CtaSection() {
  return (
    <section id="iletisim" className="py-20 relative overflow-hidden">
      <Container>
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-cyan-950/40 border border-cyan-500/30 overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.15)] text-center">
          {/* Ambient Glows */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <Badge variant="cyan" glow className="py-1 px-4 text-xs font-bold tracking-widest">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              HEMEN HAREKETE GEÇİN
            </Badge>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
              İşletmenizi Yapay Zekâ Çağına <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-blue-400">
                Bugün Taşıyın
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              7/24 AI İletişim, otonom satış motoru ve doğrulanmış yapay zekâ görünürlük rozeti ile sektörünüzün öncüsü olun.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="#dogrulama" className="w-full sm:w-auto">
                <Button size="xl" variant="primary" className="w-full sm:w-auto font-bold shadow-xl shadow-cyan-500/30">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Ücretsiz AI Uyumluluk Denetimi
                </Button>
              </Link>

              <Link
                href="https://aireadybusiness.ai"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-950/80 border border-cyan-400/40 text-cyan-300 font-mono text-sm hover:bg-slate-900 transition-colors"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>aireadybusiness.ai</span>
              </Link>
            </div>

            {/* Guarantees */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>60 Saniyede Ön Denetim Raporu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>2 Dakikada Rozet Entegrasyonu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Metafonics Güvencesi</span>
              </div>
            </div>

            <div className="pt-6">
              <MetafonicsSignature />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
