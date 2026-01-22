import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers"; // Ensure this wraps AuthProvider + QueryProvider etc.
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina Fashion | Elevate Your Style",
  description: "Discover the latest trends in elegance and comfort.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
            <div className="flex flex-col min-h-screen bg-white">
              <Header />
              <Sidebar />
              
              <main className="flex-grow">
                {children}
              </main>
              
              <Footer />
            </div>
        </Providers>
      </body>
    </html>
  );
}