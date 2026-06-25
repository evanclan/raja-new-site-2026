import { Hero } from "@/components/sections/Hero";
import { StudyAbroad } from "@/components/sections/StudyAbroad";
import { Intro } from "@/components/sections/Intro";
import { Academy } from "@/components/sections/Academy";
import { Preschool } from "@/components/sections/Preschool";
import { Clab } from "@/components/sections/Clab";
import { English } from "@/components/sections/English";
import { News } from "@/components/sections/News";
import { Inquiry } from "@/components/sections/Inquiry";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <StudyAbroad />
      <Intro />
      <Preschool />
      <Academy />
      <Clab />
      <English />
      <News />
      <Inquiry />
      <Footer />
    </>
  );
}
