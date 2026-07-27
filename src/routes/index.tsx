import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Sprout, Heart, ShieldCheck, MapPin, Phone, MessageCircle, Navigation, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SUKHI — 100% Pure Cold Pressed Groundnut Oil | Cold Natural Organics" },
      { name: "description", content: "SUKHI Cold Pressed Groundnut Oil — traditionally wood-pressed, 100% pure, natural and preservative-free. Order on WhatsApp from Bengaluru." },
      { property: "og:title", content: "SUKHI — 100% Pure Cold Pressed Groundnut Oil" },
      { property: "og:description", content: "Traditionally wood-pressed groundnut oil. Pure, natural, no preservatives." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WA = "https://wa.me/919980247775";
const TEL = "tel:+919980247775";
const MAPS = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("No. 8, 19th Cross, 20th Main, SMS Layout, JP Nagar 5th Phase, Bengaluru South, Karnataka 560078");

function openSukhiChat(e?: { preventDefault: () => void }) {
  e?.preventDefault();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("sukhi:open"));
  }
}

function NavBar() {
  const link = "text-[#3B2A1A] hover:text-[#8B6A1F] transition text-[15px] font-medium";
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#FFF8E7]/85 backdrop-blur border-b border-[#EADFC2]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-2xl tracking-widest text-[#3B2A1A]">SUKHI</a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#about" className={link}>About</a>
          <a href="#why" className={link}>Why Sukhi</a>
          <a href="#product" className={link}>Product</a>
          <a href="#contact" className={link}>Contact</a>
        </nav>
        <button onClick={openSukhiChat} className="rounded-full bg-gradient-to-r from-[#E5B84A] to-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#3B2A1A] shadow-lg shadow-amber-300/40 hover:-translate-y-0.5 transition">Order Now</button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-[#3B2A1A]">
      <video src="https://sukhipure.netlify.app/hero.mp4" autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <div className="mb-4 text-xs md:text-sm uppercase tracking-[0.4em] text-[#D4AF37]">Cold Natural Organics</div>
        <h1 className="font-display font-bold leading-none tracking-wide text-[44px] md:text-[80px]">SUKHI</h1>
        <p className="mt-3 font-display italic text-[#FFF8E7] text-[22px] md:text-[30px]">Healthy &amp; Tasty</p>
        <h2 className="mt-6 max-w-3xl font-display text-[30px] md:text-[54px] leading-tight">
          100% Pure Cold Pressed <br className="hidden md:block" />Groundnut Oil
        </h2>
        <p className="mt-5 text-[16px] md:text-[22px] text-white/85 tracking-wide">Natural • Pure • No Preservatives</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button onClick={openSukhiChat} className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-[17px] md:text-[19px] font-semibold text-white shadow-2xl shadow-black/30 transition-all hover:-translate-y-0.5 hover:bg-[#1ebe57]">
            <MessageCircle className="h-5 w-5" /> Order Now
          </button>
          <a href="#about" className="inline-flex items-center rounded-full border border-white/70 px-8 py-4 text-[17px] md:text-[19px] font-semibold text-white hover:bg-white/10 transition">Explore More</a>
        </div>
      </div>
      <a href="#about" aria-label="Scroll down" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 animate-bounce">
        <ChevronDown className="h-8 w-8" />
      </a>
    </section>
  );
}

function About() {
  const tags = ["Cold Pressed", "Traditional", "Preservative-Free", "Rich Aroma"];
  return (
    <section id="about" className="bg-[#FFF8E7] py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-[#8B6A1F]">About Sukhi</div>
          <h2 className="mt-4 font-display text-[40px] md:text-[56px] leading-[1.1] text-[#3B2A1A]">Pure Goodness in<br />Every Drop</h2>
          <div className="mt-6 h-[3px] w-24 bg-[#D4AF37]" />
          <p className="mt-8 text-[17px] leading-[1.75] text-[#5A4632]">
            At Sukhi, we produce 100% Pure Cold Pressed Groundnut Oil using carefully selected premium groundnuts. Our traditional extraction process helps preserve the oil's natural nutrients, rich aroma, and authentic taste — making it a healthy choice for everyday cooking.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {tags.map((t) => (
              <span key={t} className="rounded-full border border-[#E4D3A6] bg-white px-4 py-2 text-sm font-medium text-[#3B2A1A] shadow-sm">{t}</span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#F4E3A8] to-transparent blur-2xl opacity-70" />
          <img src="https://sukhipure.netlify.app/bottle.jpg" alt="SUKHI Cold Pressed Groundnut Oil bottle" className="relative w-full rounded-2xl shadow-2xl" />
        </div>
      </div>
    </section>
  );
}

function Why() {
  const items = [
    { icon: Leaf, title: "100% Pure", desc: "No blending, no dilution. Just clean groundnut oil in its truest form." },
    { icon: Sprout, title: "Premium Groundnuts", desc: "Handpicked, carefully sourced groundnuts from trusted farms." },
    { icon: Heart, title: "Rich in Healthy Fats", desc: "Naturally rich in mono & polyunsaturated fats for a healthier heart." },
    { icon: ShieldCheck, title: "No Preservatives", desc: "Extracted the traditional way — never any chemicals or preservatives." },
  ];
  return (
    <section id="why" className="bg-[#FFF8E7] pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-[#8B6A1F]">Why Sukhi</div>
          <h2 className="mt-4 font-display text-[36px] md:text-[52px] text-[#3B2A1A]">Crafted with Care, Made to Nourish</h2>
          <div className="mx-auto mt-6 h-[3px] w-24 bg-[#D4AF37]" />
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group rounded-2xl border border-[#EADFC2] bg-white/60 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#E5B84A] to-[#C4952A] text-white shadow-md">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-[22px] text-[#3B2A1A]">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5A4632]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Product() {
  const bullets = ["100% Pure", "Premium Quality", "Rich Aroma", "Healthy Choice"];
  return (
    <section id="product" className="relative overflow-hidden bg-[#3B2A1A] py-24 md:py-32 text-[#FFF8E7]">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_50%,#8B6A1F,transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
        <img src="https://sukhipure.netlify.app/bottle.jpg" alt="SUKHI Cold Pressed Groundnut Oil" className="w-full rounded-2xl shadow-2xl" />
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-[#D4AF37]">Signature Product</div>
          <h2 className="mt-4 font-display text-[40px] md:text-[56px] leading-[1.1]">Cold Pressed<br />Groundnut Oil</h2>
          <p className="mt-6 text-[17px] leading-[1.75] text-[#FFF8E7]/80 max-w-xl">
            A golden drop of tradition — pressed slowly to keep every nutrient, aroma, and note of flavour intact.
          </p>
          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-[17px]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#D4AF37]" />{b}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={WA} target="_blank" rel="noreferrer" className="rounded-full bg-gradient-to-r from-[#E5B84A] to-[#D4AF37] px-7 py-3.5 font-semibold text-[#3B2A1A] shadow-lg shadow-amber-300/30 hover:-translate-y-0.5 transition">Order Now</a>
            <a href={WA} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 px-7 py-3.5 font-semibold text-[#FFF8E7] hover:bg-white/10 transition">
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const mapSrc = "https://www.google.com/maps?q=" + encodeURIComponent("No. 8, 19th Cross, 20th Main, SMS Layout, JP Nagar 5th Phase, Bengaluru South, Karnataka 560078") + "&output=embed";
  return (
    <section id="contact" className="bg-[#FFF8E7] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-[#8B6A1F]">Visit or Reach Us</div>
          <h2 className="mt-4 font-display text-[42px] md:text-[56px] text-[#3B2A1A]">Get in Touch</h2>
          <div className="mx-auto mt-6 h-[3px] w-24 bg-[#D4AF37]" />
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#EADFC2] bg-white p-8 shadow-sm">
            <h3 className="font-display text-[26px] text-[#3B2A1A]">SUKHI — Cold Natural Organics</h3>
            <div className="mt-6 flex gap-3 text-[#3B2A1A]">
              <MapPin className="mt-1 h-5 w-5 text-[#D4AF37]" />
              <address className="not-italic leading-relaxed">
                No. 8, 19th Cross, 20th Main,<br />
                SMS Layout, JP Nagar 5th Phase,<br />
                Bengaluru South, Karnataka – 560078
              </address>
            </div>
            <a href={TEL} className="mt-6 flex items-center gap-3 text-[17px] font-semibold text-[#3B2A1A] hover:text-[#8B6A1F]">
              <Phone className="h-5 w-5 text-[#D4AF37]" /> +91 9980247775
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={WA} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white hover:bg-[#1ebe57] transition">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={TEL} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E5B84A] to-[#D4AF37] px-5 py-3 font-semibold text-[#3B2A1A]">
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a href={MAPS} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] px-5 py-3 font-semibold text-[#3B2A1A] hover:bg-[#F5E7B8]/40 transition">
                <Navigation className="h-4 w-4" /> Directions
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#EADFC2] shadow-sm min-h-[380px]">
            <iframe title="SUKHI location" src={mapSrc} className="h-full w-full min-h-[380px]" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#EADFC2] bg-[#FFF3D6] py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl tracking-widest text-[#3B2A1A]">SUKHI</div>
          <p className="mt-2 font-display italic text-[#8B6A1F]">Healthy &amp; Tasty</p>
          <p className="mt-4 text-sm text-[#5A4632] leading-relaxed">Cold Pressed Groundnut Oil — a golden drop of tradition, straight from our press to your kitchen.</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#8B6A1F]">Quick Links</div>
          <ul className="mt-4 space-y-2 text-[#3B2A1A]">
            <li><a href="#about" className="hover:text-[#8B6A1F]">About</a></li>
            <li><a href="#why" className="hover:text-[#8B6A1F]">Why Sukhi</a></li>
            <li><a href="#product" className="hover:text-[#8B6A1F]">Product</a></li>
            <li><a href="#contact" className="hover:text-[#8B6A1F]">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#8B6A1F]">Contact</div>
          <p className="mt-4 text-[#3B2A1A]">JP Nagar 5th Phase,<br />Bengaluru — 560078</p>
          <a href={TEL} className="mt-3 inline-block font-semibold text-[#3B2A1A] hover:text-[#8B6A1F]">+91 9980247775</a>
        </div>
      </div>
      <div className="mt-10 text-center text-sm text-[#8B6A1F]">© {new Date().getFullYear()} SUKHI — Cold Natural Organics. All rights reserved.</div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] font-sans text-[#3B2A1A] antialiased">
      <NavBar />
      <Hero />
      <About />
      <Why />
      <Product />
      <Contact />
      <Footer />
    </div>
  );
}
