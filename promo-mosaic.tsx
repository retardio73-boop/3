import Link from "next/link";
import { categoryLabel } from "@/data/products";

export default function PromoMosaic() {
  return (
    <section className="relative grid gap-4 lg:grid-cols-3">
      {/* MegaCel signature top line */}
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-400 via-orange-400 to-sky-400 opacity-70 z-10" />
      {/* Tile grande (más identidad + color sutil) */}
      <Link
        href="/catalog"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/30 p-6 hover:border-white/20 lg:col-span-2"
      >
        <div className="pointer-events-none absolute inset-0 opacity-45 bg-gradient-to-br from-emerald-500/10 via-orange-500/5 to-sky-500/10" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <div className="text-xs text-zinc-400">Promo</div>
          <div className="mt-1 text-xl font-semibold text-white md:text-2xl">
            Encontrá ofertas por categoría
          </div>
          <div className="mt-2 max-w-xl text-sm text-zinc-300">
            Celulares, PCs, accesorios, seguridad, cuidado personal y outdoor/power.
          </div>

          <div className="mt-5 inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200">
            Ver catálogo
          </div>

          {/* "imagen" decorativa */}
          <div className="mt-6 h-28 rounded-2xl border border-white/10 bg-zinc-950">
            <div className="h-full w-full bg-gradient-to-r from-white/5 via-white/0 to-white/5" />
          </div>
        </div>
      </Link>

      {/* Tiles chicos */}
      <div className="grid gap-4">
        <Link
          href="/catalog?category=Security"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/30 p-6 hover:border-white/20"
        >
          <div className="pointer-events-none absolute inset-0 opacity-35 bg-gradient-to-br from-orange-500/10 to-transparent" />
          <div className="relative">
            <div className="text-xs text-zinc-400">Top</div>
            <div className="mt-1 text-lg font-semibold text-white">Seguridad</div>
            <div className="mt-2 text-sm text-zinc-300">
              Cámaras · Alarmas · Sensores
            </div>
            <div className="mt-4 h-16 rounded-2xl border border-white/10 bg-zinc-950" />
          </div>
        </Link>

        <Link
          href="/catalog?category=Outdoor%20%26%20Power"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/30 p-6 hover:border-white/20"
        >
          <div className="pointer-events-none absolute inset-0 opacity-35 bg-gradient-to-br from-sky-500/10 to-transparent" />
          <div className="relative">
            <div className="text-xs text-zinc-400">Hogar</div>
            <div className="mt-1 text-lg font-semibold text-white">Outdoor & Energía</div>
            <div className="mt-2 text-sm text-zinc-300">
              Power banks · Cargadores · Energía portátil
            </div>
            <div className="mt-4 h-16 rounded-2xl border border-white/10 bg-zinc-950" />
          </div>
        </Link>
      </div>
    </section>
  );
}
