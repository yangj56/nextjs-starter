import type { ReactNode } from "react";

import { Inter as FontSans } from "next/font/google";
import React from "react";
import "./globals.css";
import { cn } from "@/utilities/utils";

type LayoutProps = {
  children: ReactNode;
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        {children}
      </body>
    </html>
  );
};

export default Layout;
