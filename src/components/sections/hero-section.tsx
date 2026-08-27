"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PhoneCall,
  TrendingUp,
  Sparkles,
  Globe,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[92svh] lg:min-h-screen flex flex-col justify-between pt-24 pb-10 sm:pt-28 sm:pb-14 md:pt-32 md:pb-16 overflow-hidden">
      {/* FULL-WIDTH RESPONSIVE BACKGROUND IMAGE */}
      <div className="absolute inset-0 w-full h-full -z-10 select-none overflow-hidden">
        <Image
          src="/images/ai_ready_image.jpg"
          alt="AI Ready Business Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%] sm:object-center"
        />
        {/* Responsive Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060913]/95 via-[#060913]/40 to-[#060913]" />
        <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-[#060913]/50 to-[#060913]/95" />
      </div>

      {/* TOP HEADER SECTION */}
      <Container size="fluid" className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Top Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2.5 sm:mb-3"
          >
            <Badge variant="cyan" glow className="py-1 px-3 sm:px-4 text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-cyan-400" />
              YAPAY ZEKÂ ÇAĞININ RESMİ GÜVEN STANDARDI
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
          >
            YAPAY ZEKÂ ÇAĞINA{" "}
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-100 to-cyan-300 drop-shadow-[0_0_35px_rgba(0,229,255,0.7)]">
              HAZIR MISINIZ?
            </span>
          </motion.h1>

          {/* Brand & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-2.5 sm:mt-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-lg sm:text-2xl md:text-3xl text-cyan-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]">
                AI
              </span>
              <span className="font-bold text-lg sm:text-2xl md:text-3xl text-white tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                READY
              </span>
              <span className="font-light text-lg sm:text-2xl md:text-3xl text-slate-300 tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                BUSINESS
              </span>
            </div>
            <span className="hidden sm:inline text-slate-500">•</span>
            <p className="text-xs sm:text-base md:text-lg text-slate-200 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              İşletmenizi yapay zekâya hazır hale getirin.
            </p>
          </motion.div>
        </div>
      </Container>

      {/* CENTER SPACER (Allows 3D badge in image background to be highlighted) */}
      <div className="flex-1 min-h-[120px] xs:min-h-[160px] sm:min-h-[220px] md:min-h-[260px]" />

      {/* BOTTOM FULL-WIDTH VALUE PILLARS & ACTIONS */}
      <Container size="fluid" className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-5 sm:gap-6"
        >
          {/* 3 Core Value Pillars Cards (Responsive Grid: 1 col on mobile, 3 cols on tablet/desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 w-full max-w-4xl">
            {/* 1. 7/24 AI İletişim */}
            <div className="flex sm:flex-col items-center sm:text-center p-3.5 sm:p-5 rounded-2xl bg-slate-950/75 border border-cyan-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-cyan-400 hover:bg-slate-950/90 transition-all group gap-3.5 sm:gap-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center sm:mb-2.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-110 transition-transform shrink-0">
                <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
                <span className="absolute -top-1 -right-1 text-[7px] sm:text-[8px] font-black bg-cyan-400 text-slate-950 px-1.5 py-0.2 rounded-full">
                  24/7
                </span>
              </div>
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <h3 className="font-bold text-white text-sm sm:text-base mb-0.5 sm:mb-1">
                  7/24 AI İletişim
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-tight sm:leading-normal">
                  Sıfır bekleme süresi, kesintisiz sesli ve chat AI desteği
                </p>
              </div>
            </div>

            {/* 2. Daha Fazla Satış */}
            <div className="flex sm:flex-col items-center sm:text-center p-3.5 sm:p-5 rounded-2xl bg-slate-950/75 border border-cyan-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-cyan-400 hover:bg-slate-950/90 transition-all group gap-3.5 sm:gap-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/80 border border-cyan-400/60 flex items-center justify-center sm:mb-2.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-110 transition-transform shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
              </div>
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <h3 className="font-bold text-white text-sm sm:text-base mb-0.5 sm:mb-1">
                  Daha Fazla Satış
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-tight sm:leading-normal">
                  Otonom satış hunileri ve kişiye özel akıllı teklif modelleri
                </p>
              </div>
            </div>

            {/* 3. AI'da Görünürlük */}
            <div className="flex sm:flex-col items-center sm:text-center p-3.5 sm:p-5 rounded-2xl bg-slate-950/75 border border-cyan-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-cyan-400 hover:bg-slate-950/90 transition-all group gap-3.5 sm:gap-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/80 border border-cyan-400/60 flex items-center justify-center sm:mb-2.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-110 transition-transform shrink-0">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
                <Sparkles className="w-3 h-3 text-cyan-200 absolute top-1 right-1" />
              </div>
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <h3 className="font-bold text-white text-sm sm:text-base mb-0.5 sm:mb-1">
                  AI'da Görünürlük
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-tight sm:leading-normal">
                  ChatGPT, Perplexity ve Claude aramalarında 1. sırada yer alın
                </p>
              </div>
            </div>
          </div>

          {/* Domain Pill & Metafonics Identity Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 w-full">
            {/* Domain Pill */}
            <Link
              href="#dogrulama"
              className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-slate-950/90 border border-cyan-400/60 hover:border-cyan-300 text-cyan-300 font-mono text-xs sm:text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all backdrop-blur-md group"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="font-medium tracking-wide">aireadybusiness.ai</span>
            </Link>

            {/* Metafonics Branding */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="flex items-center gap-[2.5px] h-4 sm:h-5">
                <span className="w-[2px] h-2 bg-cyan-400 rounded-full" />
                <span className="w-[2px] h-3.5 bg-cyan-300 rounded-full" />
                <span className="w-[2px] h-2.5 bg-cyan-400 rounded-full" />
                <span className="w-[2px] h-4.5 bg-cyan-200 rounded-full animate-pulse" />
                <span className="w-[2px] h-3 bg-cyan-300 rounded-full" />
                <span className="w-[2px] h-1.5 bg-cyan-400 rounded-full" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-100 uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  METAFONICS
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-300 tracking-wider drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  Yapay Zeka Teknolojileri A.Ş
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full justify-center max-w-md pt-1">
            <Link href="#dogrulama" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full font-bold px-6 sm:px-8 py-3 text-sm sm:text-base shadow-xl shadow-cyan-500/30">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Ücretsiz AI Denetimi Başlat
              </Button>
            </Link>
            <Link href="#nasil-calisir" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full py-3 text-sm sm:text-base">
                Nasıl Çalışır?
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
