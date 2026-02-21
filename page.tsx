"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatUYU, categoryLabel, type Product } from "@/data/products";
import { useProducts } from "@/lib/use-products";

const ORDENES = [
  { value: "featured", label: "Ordenar: Destacados" },
  { value: "price-asc", label: "Precio: Menor a Mayor" },
  { value: "price-desc", label: "Precio: Mayor a Menor" },
  { value: "newest", label: "Más nuevos" },
] as const;

function uniq(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort();
}

export default function CatalogPage() {
  const { products, loading, error, source } = useProducts();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>("");
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("featured");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState<Record<string, boolean>>({});

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaSeleccionada("");
    setMarcaSeleccionada("");
    setMarcasSeleccionadas({});
    setPrecioMin("");
    setPrecioMax("");
    setOrdenSeleccionado("featured");
  };

  const productosFiltrados = useMemo(() => {
    return products.filter((p: Product) => {
      const matchBusqueda = !busqueda || p.name.toLowerCase().includes(busqueda.toLowerCase()) || p.brand?.toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = !categoriaSeleccionada || p.category === categoriaSeleccionada;
      const matchMarca = !marcaSeleccionada || p.brand === marcaSeleccionada;
      const matchPrecioMin = !precioMin || (p.priceCash || 0) >= parseFloat(precioMin);
      const matchPrecioMax = !precioMax || (p.priceCash || 0) <= parseFloat(precioMax);
      return matchBusqueda && matchCategoria && matchMarca && matchPrecioMin && matchPrecioMax;
    });
  }, [products, busqueda, categoriaSeleccionada, marcaSeleccionada, precioMin, precioMax]);

  const productosOrdenados = useMemo(() => {
    const sorted = [...productosFiltrados];
    switch (ordenSeleccionado) {
      case "price-asc":
        return sorted.sort((a: Product, b: Product) => (a.priceCash || 0) - (b.priceCash || 0));
      case "price-desc":
        return sorted.sort((a: Product, b: Product) => (b.priceCash || 0) - (a.priceCash || 0));
      case "newest":
        return sorted.sort((a: Product, b: Product) => b.id.localeCompare(a.id));
      default:
        return sorted.sort((a: Product, b: Product) => Number(!!b.badge) - Number(!!a.badge));
    }
  }, [productosFiltrados, ordenSeleccionado]);

  const categorias = uniq(productosFiltrados.map((p: Product) => p.category));
  const marcas = uniq(productosFiltrados.map((p: Product) => p.brand).filter(Boolean));

  function toggleMarca(marca: string) {
    setMarcasSeleccionadas((prev) => ({ ...prev, [marca]: !prev[marca] }));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <div className="text-sm text-zinc-400">Cargando productos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning banner for errors */}
      {source === 'fallback' && (
        <div className="rounded-2xl border border-orange-500/50 bg-orange-500/10 p-4 text-center">
          <div className="text-sm text-orange-200">
            <div className="font-semibold">⚠️ Usando catálogo local</div>
            <div className="mt-1">{error || 'No se pudieron cargar los productos'}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Catálogo</h1>
          <p className="text-sm text-zinc-400">
            Buscá, filtrá y ordená tus productos.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-white/20 sm:w-[320px]"
          />

          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>

          <select
            value={ordenSeleccionado}
            onChange={(e) => setOrdenSeleccionado(e.target.value as any)}
            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
          >
            {ORDENES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border border-white/10 bg-zinc-900/30 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Filtros</div>
            <button
              onClick={limpiarFiltros}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              Limpiar
            </button>
          </div>

          <div className="mt-3 space-y-5 text-sm text-zinc-300">
            {/* Categoría */}
            <div>
              <div className="mb-2 text-zinc-100">Categoría</div>
              <div className="space-y-2">
                {categorias.slice(0, 10).map((c) => (
                  <label key={c} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cat"
                      checked={categoriaSeleccionada === c}
                      onChange={() => setCategoriaSeleccionada(c)}
                      className="accent-white"
                    />
                    <span>{categoryLabel(c)}</span>
                  </label>
                ))}
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cat"
                    checked={categoriaSeleccionada === ""}
                    onChange={() => setCategoriaSeleccionada("")}
                    className="accent-white"
                  />
                  <span>Todas</span>
                </label>
              </div>
            </div>

            {/* Marca */}
            <div>
              <div className="mb-2 text-zinc-100">Marca</div>
              <div className="max-h-48 space-y-2 overflow-auto pr-1">
                {marcas.length ? (
                  marcas.map((b) => (
                    <label key={b} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!marcasSeleccionadas[b]}
                        onChange={() => toggleMarca(b)}
                        className="accent-white"
                      />
                      <span>{b}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-xs text-zinc-500">
                    Todavía no hay marcas cargadas (campo opcional).
                  </div>
                )}
              </div>
            </div>

            {/* Precio */}
            <div>
              <div className="mb-2 text-zinc-100">Precio (UYU)</div>
              <div className="flex gap-2">
                <input
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  placeholder="Mín"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-white/20"
                />
                <input
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  placeholder="Máx"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-white/20"
                />
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Usa el precio contado cuando está disponible.
              </div>
            </div>
          </div>
        </aside>

        {/* Resultados */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400">
              Mostrando{" "}
              <span className="text-zinc-200 font-semibold">
                {productosFiltrados.length}
              </span>{" "}
              productos
            </div>
          </div>

          {productosFiltrados.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productosOrdenados.map((p: Product) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/30 p-6 text-sm text-zinc-300">
              No hay productos que coincidan con tus filtros.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/product/${p.id}`}
      className="group rounded-2xl border border-white/10 bg-zinc-900/30 p-4 hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-400">{categoryLabel(p.category)}</div>
          <div className="mt-1 line-clamp-2 text-base font-semibold text-white">
            {p.name}
          </div>
          {p.brand ? (
            <div className="mt-1 text-xs text-zinc-500">{p.brand}</div>
          ) : null}
        </div>

        {p.badge ? (
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-zinc-200">
            {p.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-1 text-sm">
        <div className="text-zinc-300">
          <span className="text-zinc-400">Contado: </span>
          {formatUYU(p.priceCash)}
        </div>
        <div className="text-zinc-400">
          <span className="text-zinc-500">Tarjeta: </span>
          {formatUYU(p.priceCard)}
        </div>
      </div>
    </Link>
  );
}
