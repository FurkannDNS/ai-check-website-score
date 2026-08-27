"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { pricingPlans } from "@/config/pricing";

export function PricingSection() {
  return (
    <section id="paketler" className="py-24 relative overflow-hidden bg-slate-950/60">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="cyan" glow className="mb-3">
            ŞEFFAF FİYATLANDIRMA
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            İşletmenizin İhtiyacına Uygun <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              Sertifikasyon Paketleri
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Denetim, rozet entegrasyonu ve Metafonics yapay zeka mühendisliği desteğiyle hazır paketler.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => {
            const isPopular = plan.isPopular;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex"
              >
                <Card
                  className={`w-full flex flex-col justify-between p-8 relative ${
                    isPopular
                      ? "bg-slate-900/90 border-cyan-400/50 shadow-[0_0_35px_rgba(0,229,255,0.2)] lg:-translate-y-2"
                      : "bg-slate-900/50 border-slate-800/80"
                  }`}
                  hoverEffect={true}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-8 -translate-y-1/2">
                      <Badge variant="cyan" glow className="py-1 px-3.5 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <div>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-400 min-h-[36px]">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price display */}
                    <div className="mb-6 pb-6 border-b border-slate-800">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                          {plan.price}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          / {plan.period}
                        </span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <div className="w-4 h-4 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-cyan-400" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a href={plan.ctaHref} className="w-full mt-auto block">
                    <Button
                      variant={isPopular ? "primary" : "outline"}
                      size="lg"
                      className="w-full justify-center font-bold"
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </a>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
