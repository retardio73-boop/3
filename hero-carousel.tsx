"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  desc: string;
  primaryHref: string;
  primaryText: string;
  secondaryText: string;
  tone: "warm" | "cool" | "mix";
};

export default function HeroCarousel() {
  const slides: Slide[] = useMemo(
    () => [
      {
        eyebrow: "MegaCel · Tecnología para todos los días",
        title: "Tu tienda de tecnología en un solo lugar",
        desc: "Celulares, PCs, accesorios, seguridad, cuidado personal y más. Consultá por WhatsApp y te respondemos rápido.",
        primaryHref: "/catalog",
        primaryText: "Ver catálogo",
        secondaryText: "Consultar por WhatsApp",
        tone: "mix",
      },
      {
        eyebrow: "Ofertas y novedades",
        title: "Precios claros: contado y tarjeta",
        desc: "Buscá por categoría, filtrá por marca y encontrá lo que necesitás sin vueltas.",
        primaryHref: "/catalog",
        primaryText: "Explorar categorías",
        secondaryText: "Consultar por WhatsApp",
        tone: "warm",
      },
      {
        eyebrow: "Hogar + Outdoor + Energía",
        title: "Seguridad, power banks y más",
        desc: "Cámaras Wi-Fi, alarmas, cargadores, generadores y productos para tus salidas.",
        primaryHref: "/catalog",
        primaryText: "Ver productos",
        secondaryText: "Consultar por WhatsApp",
        tone: "cool",
      },
    ],
    []
  );

  const [i, setI] = useState(0);
  const s = slides[i];

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 7500);
    return () => clearInterval(t);
  }, [slides.length]);

  const wa = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "59891161283"}?text=${encodeURIComponent(
    "Hola! Quiero consultar por productos."
  )}`;

  const toneBg =
    s.tone === "warm"
      ? "from-orange-400/14 via-emerald-400/8 to-transparent"
      : s.tone === "cool"
        ? "from-sky-400/14 via-emerald-400/8 to-transparent"
        : "from-emerald-400/12 via-orange-400/10 to-sky-400/12";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/30 p-7 md:p-10">
      {/* MegaCel signature top line */}
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-400 via-orange-400 to-sky-400 opacity-70" />

      {/* Soft brand glow */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneBg}`} />
      <div className="pointer-events-none absolute -top-24 right-[-120px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-[-120px] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {s.eyebrow}
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">
            {s.title}
          </h1>

          <p className="mt-3 max-w-xl text-base text-zinc-300 md:text-lg">
            {s.desc}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={s.primaryHref}
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              {s.primaryText}
            </Link>

            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-200 hover:border-emerald-500/60"
            >
              {s.secondaryText}
            </a>
          </div>

          <div className="mt-6 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={[
                  "h-2 w-2 rounded-full border border-white/20",
                  idx === i ? "bg-white" : "bg-white/10 hover:bg-white/20",
                ].join(" ")}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* small MegaCel identity badges */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-zinc-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Contado y tarjeta
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Envíos / retiro
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Respuesta rápida
            </span>
          </div>
        </div>

        {/* Right column – visual tiles (more life + "images") */}
        <div className="grid gap-3">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="text-sm font-semibold text-white">Contado y tarjeta</div>
            <div className="mt-1 text-sm text-zinc-400">Precios claros en cada producto.</div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <Tile label="Celulares" tone="mix" />
              <Tile label="Accesorios" tone="warm" />
              <Tile label="Seguridad" tone="cool" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="text-sm font-semibold text-white">WhatsApp directo</div>
            <div className="mt-1 text-sm text-zinc-400">
              Te respondemos rápido y sin vueltas.
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniCard title="PCs & Monitores" sub="Notebooks · Desktop · Pantallas" />
              <MiniCard title="Cuidado personal" sub="Higiene · Belleza · Salud" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({ label, tone }: { label: string; tone: "warm" | "cool" | "mix" }) {
  const bg =
    tone === "warm"
      ? "from-orange-400/25 via-emerald-400/10 to-transparent"
      : tone === "cool"
        ? "from-sky-400/25 via-emerald-400/10 to-transparent"
        : "from-emerald-400/20 via-orange-400/12 to-sky-400/20";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-3">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${bg}`} />
      <div className="relative text-xs font-semibold text-white">{label}</div>
      <div className="relative mt-1 h-12 rounded-xl border border-white/10 bg-white/5" />
    </div>
  );
}

function MiniCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-zinc-400">{sub}</div>
    </div>
  );
}
