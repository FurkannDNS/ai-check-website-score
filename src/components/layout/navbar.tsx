"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck, ArrowRight } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { mainNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/15 py-3 shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-slate-950/80 to-transparent py-4 sm:py-5"
      )}
    >
      <Container size="fluid" className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size="sm" showMetafonics={false} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs xl:text-sm font-medium text-slate-300 hover:text-cyan-300 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2.5 md:gap-3">
            <Link href="#dogrulama">
              <Button variant="ghost" size="sm" className="gap-1.5 text-cyan-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Rozet Doğrula</span>
              </Button>
            </Link>

            <Link href="#paketler">
              <Button variant="primary" size="sm" className="gap-1.5 font-bold text-xs sm:text-sm">
                <span>Hemen Başvur</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 focus:outline-none transition-colors"
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 sm:p-5 rounded-2xl bg-slate-950/95 border border-cyan-500/25 backdrop-blur-2xl shadow-2xl shadow-cyan-950/50 flex flex-col gap-3 animate-in fade-in slide-in-from-top-3">
            <nav className="flex flex-col gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-200 hover:text-cyan-300 hover:bg-cyan-950/30 px-3 py-2.5 rounded-xl transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-2 pt-3 border-t border-slate-800/80">
              <Link href="#dogrulama" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-center text-xs py-2.5">
                  <ShieldCheck className="w-4 h-4 mr-2 text-cyan-400" />
                  Rozet Doğrulama Simülatörü
                </Button>
              </Link>
              <Link href="#paketler" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full justify-center font-bold text-xs py-2.5">
                  Hemen Başvur & Sertifika Al
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
