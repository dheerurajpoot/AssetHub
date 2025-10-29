import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AssetHub - Buy & Sell Digital Assets",
	description:
		"Marketplace for buying and selling digital assets like websites, YouTube channels, and more",
	generator: "v0.app",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${geistSans.className} bg-slate-900`}
				suppressHydrationWarning>
				<Navbar />
				{children}
				<MobileBottomNav />
				<Footer />
			</body>
		</html>
	);
}
