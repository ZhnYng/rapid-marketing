"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/lib/ReactQueryProvider"
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body className={clsx(inter.className, "min-h-screen")}>
          <Toaster />
          {children}
        </body>
      </html>
    </ReactQueryProvider>
  );
}