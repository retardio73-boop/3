"use client";

import * as Accordion from "@radix-ui/react-accordion";
import type { Product } from "@/data/products";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-white/5 py-2 text-sm">
      <div className="text-zinc-400">{k}</div>
      <div className="text-right text-zinc-200">{v}</div>
    </div>
  );
}

export default function ProductAccordions({ product }: { product: Product }) {
  return (
    <Accordion.Root
      type="multiple"
      defaultValue={["specs"]}
      className="space-y-3"
    >
      <Accordion.Item
        value="specs"
        className="rounded-2xl border border-white/10 bg-zinc-950"
      >
        <Accordion.Header className="flex">
          <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white hover:bg-white/5">
            Especificaciones
            <span className="text-zinc-400">+</span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="px-5 pb-5">
          {product.specs && Object.keys(product.specs).length ? (
            <div className="mt-1">
              {Object.entries(product.specs).map(([k, v]) => (
                <Row key={k} k={k} v={v} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-zinc-400">
              No hay especificaciones disponibles para este producto.
            </div>
          )}
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item
        value="shipping"
        className="rounded-2xl border border-white/10 bg-zinc-950"
      >
        <Accordion.Header className="flex">
          <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white hover:bg-white/5">
            Envíos
            <span className="text-zinc-400">+</span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="px-5 pb-5 text-sm text-zinc-300">
          <ul className="space-y-2">
            <li>• Envíos a todo el país mediante correo o transporte privado.</li>
            <li>• Retiro por local sin costo adicional.</li>
            <li>• Tiempos de entrega: 2-5 días hábiles según ubicación.</li>
            <li>• Envío express disponible en algunas áreas.</li>
          </ul>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item
        value="returns"
        className="rounded-2xl border border-white/10 bg-zinc-950"
      >
        <Accordion.Header className="flex">
          <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white hover:bg-white/5">
            Cambios y garantía
            <span className="text-zinc-400">+</span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="px-5 pb-5 text-sm text-zinc-300">
          <ul className="space-y-2">
            <li>• Garantía según fabricante (típicamente 1 año).</li>
            <li>• Aceptamos cambios por defectos de fábrica.</li>
            <li>• Contactanos por WhatsApp para ayuda técnica.</li>
            <li>• Soporte post-venta incluido.</li>
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
