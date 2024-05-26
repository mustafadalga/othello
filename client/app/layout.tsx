import type { Metadata } from "next";
import "./globals.css";
import RootProvider from "@/_providers/RootProvider";

export const metadata: Metadata = {
  title: "Othello",
  description: "Othello",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full h-full min-h-screen max-w-screen-2xl mx-auto p-4 font-sans bg-gray-100 text-gray-800">
      <RootProvider>
        {children}
      </RootProvider>
      </body>
    </html>
  );
}
