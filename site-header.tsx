"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        {/* Logo with gradient glow */}
        <Link href="/" className="group relative flex items-center gap-3">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/20 via-orange-500/20 to-sky-500/20 blur-sm group-hover:from-emerald-500/30 group-hover:via-orange-500/30 group-hover:to-sky-500/30 transition-all duration-300" />
          <div className="relative">
            <Image
              src="/logo-megacel.png"
              alt="MegaCel"
              width={140}
              height={36}
              priority
              className="relative z-10 h-9 w-auto object-contain"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
              <span className="text-xl font-bold text-white">MegaCel</span>
            </div>
          </div>
        </Link>

        {/* Search bar - desktop only */}
        <div className="hidden flex-1 md:block">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-white/20 focus:bg-zinc-900/80 transition-all"
          />
        </div>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-3 text-sm text-zinc-200 md:flex">
          <Link 
            href="/catalog" 
            className="hover:text-white transition-colors duration-200"
          >
            Catálogo
          </Link>
          <Link 
            href="#contacto" 
            className="hover:text-white transition-colors duration-200"
          >
            Contacto
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "59891161283"}?text=${encodeURIComponent("Hola! Quiero consultar por un producto.")}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors duration-200 shadow-lg hover:shadow-emerald-500/25"
          >
            WhatsApp
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-zinc-200 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-3">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-white/20 focus:bg-zinc-900/80 transition-all"
            />
            <div className="flex flex-col gap-2 text-sm">
              <Link 
                href="/catalog" 
                className="text-zinc-200 hover:text-white transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link 
                href="#contacto" 
                className="text-zinc-200 hover:text-white transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "59891161283"}?text=${encodeURIComponent("Hola! Quiero consultar por un producto.")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors duration-200 text-center"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
