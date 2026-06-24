import { Hero } from "@/components/sections/Hero";
import { StudyAbroad } from "@/components/sections/StudyAbroad";
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
      <Academy />
      <Preschool />
      <Clab />
      <English />
      <News />
      <Inquiry />
      <Footer />
    </>
  );
}
