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

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
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
    </>
  );
}
