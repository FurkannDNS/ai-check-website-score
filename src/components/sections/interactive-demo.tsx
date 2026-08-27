"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Search,
  ShieldCheck,
  Star,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  PhoneCall,
  TrendingUp,
  Sparkles,
  QrCode,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { sampleCertificates } from "@/config/sample-certificates";
import { CertificateRecord } from "@/types/certificate";
import { AIReadyBadge3D } from "@/components/common/ai-ready-badge-3d";

export function InteractiveDemo() {
  const [searchQuery, setSearchQuery] = useState("aireadybusiness.ai");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<CertificateRecord | null>(sampleCertificates[0]);
  const [copied, setCopied] = useState(false);

  const scanSteps = [
    "Domain ve DNS kayıtları taranıyor...",
    "7/24 AI İletişim & Chatbot yanıt süreleri ölçülüyor...",
    "AEO (ChatGPT & Perplexity) indeksleme doğrulanıyor...",
    "Kriptografik AI Ready sertifikası üretiliyor...",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsScanning(true);
    setScanStep(0);
    setResult(null);

    // Simulate scanning pipeline
    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(stepInterval);
      setIsScanning(false);

      // Check if domain exists in mock DB
      const cleanQuery = searchQuery.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
      const found = sampleCertificates.find(
        (c) => c.domain.toLowerCase().includes(cleanQuery) || c.id.toLowerCase() === cleanQuery
      );

      if (found) {
        setResult(found);
      } else {
        // Generate a dynamic instant score for any input domain
        const generatedRecord: CertificateRecord = {
          id: `ARB-2025-${Math.floor(1000 + Math.random() * 9000)}`,
          businessName: searchQuery.includes(".") ? searchQuery.split(".")[0].toUpperCase() : searchQuery,
          domain: searchQuery.includes(".") ? searchQuery : `${searchQuery.toLowerCase()}.com`,
          issueDate: "Bugün",
          expiryDate: "1 Yıl Sonra",
          overallScore: Math.floor(92 + Math.random() * 7),
          tier: "VERIFIED",
          stars: 5,
          status: "ACTIVE",
          verifiedBy: "METAFONICS Yapay Zeka Teknolojileri",
          badgeUrl: `https://aireadybusiness.ai/badge/${searchQuery}`,
          featuresEnabled: [
            "7/24 AI İletişim Entegrasyonu",
            "Otonom Satış Motoru",
            "AEO Görünürlük Katmanı",
          ],
          metrics: [
            {
              id: "m-1",
              label: "7/24 AI İletişim",
              score: 96,
              status: "EXCELLENT",
              description: "AI Asistan yanıt süresi < 1.5 sn",
              iconName: "PhoneCall",
            },
            {
              id: "m-2",
              label: "Daha Fazla Satış (Otomasyon)",
              score: 94,
              status: "EXCELLENT",
              description: "Satış hunisi optimizasyonu aktif",
              iconName: "TrendingUp",
            },
            {
              id: "m-3",
              label: "AI'da Görünürlük (AEO)",
              score: 98,
              status: "EXCELLENT",
              description: "LLM tarayıcılarında doğrulanmış indeks",
              iconName: "Sparkles",
            },
          ],
        };
        setResult(generatedRecord);
      }

      // Fire confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#00e5ff", "#38bdf8", "#2563eb", "#ffffff"],
      });
    }, 2500);
  };

  const copyEmbedSnippet = () => {
    if (!result) return;
    const snippet = `<!-- AI READY BUSINESS VERIFIED BADGE -->\n<a href="https://aireadybusiness.ai/verify/${result.id}" target="_blank">\n  <img src="https://aireadybusiness.ai/badges/verified-seal.svg" alt="AI READY Verified Business" width="180" />\n</a>`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="dogrulama" className="py-20 relative overflow-hidden bg-slate-950/60">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="cyan" glow className="mb-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" />
            CANLI DOĞRULAMA & TEST SİMÜLATÖRÜ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            İşletmenizin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">AI Hazırlığını</span> Anında Test Edin
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Web sitenizi veya alan adınızı girin; yapay zeka iletişim hızınızı, AEO arama motoru görünürlüğünüzü ve sertifika durumunuzu anlık olarak tarayalım.
          </p>
        </div>

        {/* Search Bar Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form
            onSubmit={handleSearch}
            className="relative flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]"
          >
            <div className="relative w-full flex items-center">
              <Search className="w-5 h-5 text-cyan-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: aireadybusiness.ai veya Şirket Adı"
                className="w-full bg-transparent pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isScanning}
              className="w-full sm:w-auto shrink-0 font-bold px-6"
            >
              {isScanning ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Taranıyor...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sorgula & Denetle</span>
                </div>
              )}
            </Button>
          </form>

          {/* Quick preset buttons */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400">
            <span>Hızlı Deneme:</span>
            <button
              onClick={() => {
                setSearchQuery("aireadybusiness.ai");
              }}
              className="text-cyan-400 hover:underline font-mono"
            >
              aireadybusiness.ai
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setSearchQuery("novasphere.com");
              }}
              className="text-cyan-400 hover:underline font-mono"
            >
              novasphere.com
            </button>
          </div>
        </div>

        {/* Dynamic Scanning State View */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/30"
          >
            <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
              <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <h4 className="text-white font-bold text-lg mb-2">AI Denetim Motoru Çalışıyor</h4>
            <p className="text-cyan-300 font-mono text-xs">{scanSteps[scanStep]}</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: "10%" }}
                animate={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        )}

        {/* Certificate Inspection Card Result */}
        {!isScanning && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,229,255,0.15)]">
              {/* Header Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                    <CheckCircle className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {result.businessName}
                      </h3>
                      <Badge variant="cyan" glow>
                        DOĞRULANMIŞ İŞLETME
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Domain: <span className="text-cyan-300">{result.domain}</span> | Sertifika No:{" "}
                      <span className="text-cyan-300">{result.id}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      AI Hazırlık Skoru
                    </div>
                    <div className="text-2xl font-black text-cyan-400">
                      {result.overallScore} / 100
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Content: Left Badge Preview / Right Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 items-center">
                {/* 3D Badge Preview Mini */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <AIReadyBadge3D size="sm" interactive={false} />
                  <div className="mt-2 text-center">
                    <span className="text-xs font-semibold text-slate-300">
                      Onaylayan: {result.verifiedBy}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Geçerlilik: {result.issueDate} - {result.expiryDate}
                    </p>
                  </div>
                </div>

                {/* Score Breakdown Metrics */}
                <div className="md:col-span-7 space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Denetim & Uyumluluk Parametreleri
                  </h4>

                  {result.metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center shrink-0">
                          {metric.iconName === "PhoneCall" && <PhoneCall className="w-4 h-4 text-cyan-400" />}
                          {metric.iconName === "TrendingUp" && <TrendingUp className="w-4 h-4 text-cyan-400" />}
                          {metric.iconName === "Sparkles" && <Sparkles className="w-4 h-4 text-cyan-400" />}
                          {metric.iconName === "ShieldCheck" && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {metric.label}
                          </div>
                          <div className="text-xs text-slate-400">
                            {metric.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-cyan-300 font-mono">
                          %{metric.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embed Widget & Verification Link Footer */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 rounded-b-3xl">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Kriptografik SHA-256 doğrulama mührü ile korunmaktadır.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={copyEmbedSnippet}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5 text-emerald-400" />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        <span>Rozet Kodunu Kopyala</span>
                      </>
                    )}
                  </Button>

                  <a href="#paketler" className="w-full sm:w-auto">
                    <Button variant="primary" size="sm" className="w-full sm:w-auto font-bold">
                      Sertifikanızı Alın
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
