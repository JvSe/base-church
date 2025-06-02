import { SectionHero } from "@/src/components/sections/hero-section";
import { Navbar } from "../components/navbar";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <Navbar />
      <SectionHero />
    </div>
  );
}
