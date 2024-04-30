import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/lib/ReactQueryProvider"
import clsx from "clsx";
import { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Rapid Marketing',
  description: 'Effective advertising in seconds.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        <html lang="en">
          <body className={clsx(inter.className, "min-h-screen")}>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <Toaster />
            {children}
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}