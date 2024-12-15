import "./globals.css"; // Import Tailwind CSS
import { ReactNode } from "react";

export const metadata = {
  title: "Audio Tool",
  description: "A Next.js audio processing tool with Tailwind CSS.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
