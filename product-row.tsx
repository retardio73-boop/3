"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { formatUYU, getWhatsAppLink, categoryLabel, type Product } from "@/data/products";

export default function ProductRow({
  title,
  subtitle,
  href,
  products,
}: {
  title: string;
  subtitle: string;
  href: string;
  products: Product[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => products.slice(0, 10), [products]);

  const scrollBy = (dir: "left" | "right") => {
    if (!ref.current) return;
    const amount = Math.round(ref.current.clientWidth * 0.9);
    ref.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollBy("left")}
            className="rounded-xl border border-white/10 bg-zinc-900/30 px-3 py-2 text-sm text-zinc-200 hover:border-white/20"
          >
            ←
          </button>
          <button
            onClick={() => scrollBy("right")}
            className="rounded-xl border border-white/10 bg-zinc-900/30 px-3 py-2 text-sm text-zinc-200 hover:border-white/20"
          >
            →
          </button>

          <Link href={href} className="ml-2 text-sm text-zinc-300 hover:text-white">
            Ver todo →
          </Link>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p) => (
          <Card key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

function Card({ p }: { p: Product }) {
  const wa = getWhatsAppLink(`Hola! Quiero consultar por: ${p.name}`);

  return (
    <div className="w-[270px] flex-none rounded-2xl border border-white/10 bg-zinc-900/30 p-4 hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-400">{categoryLabel(p.category)}</div>
          <div className="mt-1 line-clamp-2 text-base font-semibold text-white">
            {p.name}
          </div>
          {p.brand ? <div className="mt-1 text-xs text-zinc-500">{p.brand}</div> : null}
        </div>

        {p.badge ? (
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-zinc-200">
            {p.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-1 text-sm">
        <div className="flex items-center justify-between text-zinc-300">
          <span>Contado</span>
          <span className="font-semibold text-zinc-100">{formatUYU(p.priceCash)}</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>Tarjeta</span>
          <span>{formatUYU(p.priceCard)}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <Link
          href={`/product/${p.id}`}
          className="w-full rounded-xl bg-white px-3 py-2 text-center text-sm font-semibold text-black hover:bg-zinc-200"
        >
          Ver producto
        </Link>

        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-sm font-semibold text-emerald-200 hover:border-emerald-500/60"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
