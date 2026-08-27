"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Zap, Award, CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { howItWorksSteps } from "@/config/steps";

export function HowItWorks() {
  const iconMap: Record<string, React.ReactNode> = {
    Search: <Search className="w-6 h-6 text-cyan-300" />,
    Zap: <Zap className="w-6 h-6 text-cyan-300" />,
    Award: <Award className="w-6 h-6 text-cyan-300" />,
  };

  return (
    <section id="nasil-calisir" className="py-24 relative overflow-hidden bg-slate-950/40">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="cyan" glow className="mb-3">
            SÜREÇ & ADIMLAR
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            3 Kolay Adımda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              AI Ready Sertifikasyonunuz
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Karmaşık teknik süreçlerle vakit kaybetmeyin. Metafonics altyapısı ile işletmenizi hızla denetleyin ve onaylı rozetinizi sitenize ekleyin.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-cyan-500/20 via-cyan-400/50 to-blue-500/20 -z-10" />

          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative flex flex-col p-8 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Step number badge & icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/70 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.25)]">
                  {iconMap[step.iconName] || <CheckCircle className="w-6 h-6 text-cyan-300" />}
                </div>
                <span className="text-3xl font-black font-mono text-slate-700 select-none">
                  {step.number}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Detail Pill */}
              <div className="mt-auto pt-3 border-t border-slate-800/70 text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{step.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
