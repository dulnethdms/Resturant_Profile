import type { Metadata } from "next";
import MenuClient from "@/components/menu/MenuClient";

export const metadata: Metadata = {
  title: "Menu · Nocturne Kitchen & Bar",
  description:
    "Browse the full Nocturne menu — starters, mains, desserts and cocktails — with search, dietary filters and a personal tasting list.",
};

export default function MenuPage() {
  return <MenuClient />;
}
