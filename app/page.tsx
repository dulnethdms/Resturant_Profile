import Hero from "@/components/home/Hero";
import Story from "@/components/home/Story";
import Specials from "@/components/home/Specials";
import HoursLocation from "@/components/home/HoursLocation";
import MenuPreview from "@/components/home/MenuPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <Specials />
      <MenuPreview />
      <HoursLocation />
    </>
  );
}
