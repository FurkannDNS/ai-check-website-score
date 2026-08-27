"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, PhoneCall, CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { landingStats } from "@/config/testimonials";

export function StatsSection() {
  const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
    TrendingUp: <TrendingUp className="w-5 h-5 text-blue-400" />,
    PhoneCall: <PhoneCall className="w-5 h-5 text-cyan-400" />,
    CheckCircle: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  };

  return (
    <section className="py-16 relative border-y border-slate-800/80 bg-slate-950/80">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {landingStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {iconMap[stat.iconName]}
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 font-mono">
                  {stat.value}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-200">{stat.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
