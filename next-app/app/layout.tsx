import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reservas",
  description: "Sistema de reserva de quadras",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
