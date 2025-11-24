import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROMS INDEX",
  description: "Browse through classic gaming consoles from Nintendo, Sony, Microsoft, and Sega",
};

export default function RomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
