import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-orange-500 to-sky-500" />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}