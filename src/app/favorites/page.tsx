import type { Metadata } from "next";

import { FavoritesView } from "@/components/views/favorites-view";

export const metadata: Metadata = {
  title: "Favorite Locations",
  description:
    "Save and quickly access live weather for your favorite cities around the world.",
};

export default function FavoritesPage() {
  return <FavoritesView />;
}
