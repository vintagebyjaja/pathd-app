import type { MetadataRoute } from "next";

/** Lets people add PATHD to their home screen as an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PATHD — Find your path",
    short_name: "PATHD",
    description: "Jobs with pay up front, your commute on a map, and a community to grow with.",
    start_url: "/explore",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F7F0E3",
    theme_color: "#49355F",
    categories: ["business", "productivity", "social"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
