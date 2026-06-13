import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/lib/cart/context";
import { WishlistProvider } from "@/lib/wishlist/context";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { RevealInit } from "@/components/RevealInit";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Camp Creek Market — Camp Creek Area Shopify-like marketplace",
  description:
    "A modern headless WooCommerce storefront. Browse our curated collection of quality products.",
};

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", href: "/" },
    { label: "Bags", href: "/?category=bags" },
    { label: "Kitchen", href: "/?category=kitchen" },
    { label: "Home Office", href: "/?category=home-office" },
    { label: "Clothing", href: "/?category=clothing" },
    { label: "Home", href: "/?category=home" },
  ],
  Help: [
    { label: "FAQs", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns & Refunds", href: "#" },
    { label: "Track Your Order", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
    { label: "Careers", href: "#" },
  ],
};

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Trust strip */}
      <div className="border-b border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-6">
          {[
            { icon: "💬", title: "Fast Communication", desc: "Tribe Social" },
            { icon: "📦", title: "Same Day Delivery", desc: "Order before 3pm" },
            { icon: "🔒", title: "Secure Checkout", desc: "256-bit SSL" },
            { icon: "⭐", title: "4.8★ Rated", desc: "2,000+ happy customers" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Camp Creek<span className="text-primary">Market</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The Amazon prime + DoorDash + Shopify of the Camp Creek area.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.tiktok.com/@campcreekmarket"
                aria-label="TikTok"
                className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary text-xs font-bold"
              >
                T
              </a>
            </div>
          </div>

          {/* Help & Company columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => {
            // Skip Shop column – replaced by TikTok embed
            if (heading === "Shop") return null;
            return (
              <div key={heading}>
                <h3 className="mb-3 text-sm font-semibold">{heading}</h3>
                <ul className="flex flex-col gap-2">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* TikTok embed replaces the Shop column */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">TikTok</h3>
            <blockquote
              className="tiktok-embed"
              cite="https://www.tiktok.com/@campcreekmarket"
              data-unique-id="campcreekmarket"
              data-embed-type="creator"
              style={{ maxWidth: "100%", minWidth: "288px" }}
            >
              <section>
                <a
                  target="_blank"
                  href="https://www.tiktok.com/@campcreekmarket?refer=creator_embed"
                >
                  @campcreekmarket
                </a>
              </section>
            </blockquote>
            <Script async src="https://www.tiktok.com/embed.js" />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Camp Creek Market. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ✅ This must remain the default export
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
        <SmoothScrollProvider>
          <WishlistProvider>
            <CartProvider>
              <AnnouncementBar />
              <Navbar />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </WishlistProvider>
          <RevealInit />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}