import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { SocialProofBar } from "@/components/sections/SocialProofBar";
import { Offer } from "@/components/sections/Offer";
import { Benefits } from "@/components/sections/Benefits";
import { Program } from "@/components/sections/Program";
import { WhatsIncluded } from "@/components/sections/WhatsIncluded";
import { Author } from "@/components/sections/Author";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Guarantee } from "@/components/sections/Guarantee";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { StickyCTA } from "@/components/sections/StickyCTA";
import { CookieConsent } from "@/components/ui/CookieConsent";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="pb-20 lg:pb-0">
        <Hero />
        <SocialProofBar />
        <Offer />
        <Benefits />
        <Program />
        <WhatsIncluded />
        <Author />
        <Testimonials />
        <Pricing />
        <Guarantee />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyCTA />
      <CookieConsent />
    </>
  );
}
