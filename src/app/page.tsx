import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Author } from "@/components/sections/Author";
import { Program } from "@/components/sections/Program";
import { Deliverables } from "@/components/sections/Deliverables";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { StickyMobileCTA } from "@/components/ui/StickyMobileCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="pb-20 sm:pb-0">
        <Hero />
        <Problem />
        <Author />
        <Program />
        <Deliverables />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <CookieConsent />
      <StickyMobileCTA />
    </>
  );
}
