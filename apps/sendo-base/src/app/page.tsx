import { SectionHero } from "@/src/components/sections/hero-section";
import { Navbar } from "../components/navbar";
import { CourseSection } from "../components/sections/courses-section";
import { Footer } from "../components/sections/footer";
import { PillarsSection } from "../components/sections/pillars-section";
import { QuestionsSection } from "../components/sections/questions-section";
import { TeachersSection } from "../components/sections/teachers-section";
import { TestimonialSection } from "../components/sections/testimonial-section";
import { WelcomeSection } from "../components/sections/welcome-section";
import { WorldSection } from "../components/sections/world-section";

export default function Page() {
  return (
    <div className="flex flex-col overflow-hidden relative items-center justify-center min-h-svh">
      <Navbar />
      <SectionHero />
      <WelcomeSection />
      <PillarsSection />
      <WorldSection />
      <CourseSection />
      <TeachersSection />
      <TestimonialSection />
      <QuestionsSection />
      <Footer />
    </div>
  );
}
