"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhoneCall, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, Zap, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { coreReferencePillars } from "@/config/features";

export function PillarsDeepDive() {
  return (
    <section id="ozellikler" className="py-24 relative overflow-hidden">
      {/* Background cyan glow */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="cyan" glow className="mb-3">
            TEMEL DEĞER ÖNERİSİ
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            AI Ready Standardının <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              3 Vazgeçilmez Temeli
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Geleneksel işletmeler ile yapay zekâ çağının lider markaları arasındaki farkı belirleyen 3 kritik teknoloji sütunu.
          </p>
        </div>

        {/* 3 Large Pillar Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {coreReferencePillars.map((pillar, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card
                  className="h-full flex flex-col justify-between p-8 bg-slate-900/60 border-slate-800/90 hover:border-cyan-500/50 transition-all duration-300 group"
                  hoverEffect={true}
                >
                  <div>
                    {/* Header: Icon & Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.2)] group-hover:scale-110 transition-transform">
                        {isFirst && <PhoneCall className="w-8 h-8 text-cyan-300" />}
                        {isSecond && <TrendingUp className="w-8 h-8 text-blue-300" />}
                        {isThird && <Sparkles className="w-8 h-8 text-cyan-300" />}
                      </div>

                      {pillar.badge && (
                        <Badge variant="cyan" glow>
                          {pillar.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Subtitle & Title */}
                    <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
                      {pillar.subtitle}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    {/* Bullet Points */}
                    {pillar.bulletPoints && (
                      <ul className="space-y-2.5 mb-8">
                        {pillar.bulletPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Footer Metric Banner */}
                  {pillar.metrics && (
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{pillar.metrics.label}</span>
                      <span className="text-lg font-black text-cyan-300 font-mono">
                        {pillar.metrics.value}
                      </span>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
