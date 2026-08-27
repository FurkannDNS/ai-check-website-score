"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/config/testimonials";

export function TestimonialsSection() {
  return (
    <section id="neden" className="py-24 relative overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="cyan" glow className="mb-3">
            BAŞARI HİKAYELERİ
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            AI Ready Rozeti Alan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              Lider İşletmeler Ne Diyor?
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Metafonics onaylı yapay zekâ sertifikasyonu ile dönüşüm oranlarını ve güven skorlarını artıran şirketler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="h-full flex flex-col justify-between p-8 bg-slate-900/50 border-slate-800/80 hover:border-cyan-500/40">
                <div>
                  {/* Rating Stars & Growth Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-cyan-400 fill-cyan-400"
                        />
                      ))}
                    </div>
                    <Badge variant="pill" className="text-[10px] py-0.5">
                      {item.growthMetric}
                    </Badge>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-cyan-500/20 absolute -top-3 -left-3 -z-10" />
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      "{item.quote}"
                    </p>
                  </div>
                </div>

                {/* Author Info & Verified Badge ID */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.author}</h4>
                    <p className="text-xs text-slate-400">
                      {item.role}, {item.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{item.certificateId}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
