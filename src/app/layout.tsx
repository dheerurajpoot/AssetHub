import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/userContext";

const geistSans = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AssetHub - Buy & Sell Digital Assets",
	description:
		"The trusted marketplace for buying and selling digital assets.",
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
				<AuthProvider>
					<Navbar />
					{children}
					<Toaster />
					<MobileBottomNav />
				</AuthProvider>
				<Footer />
			</body>
		</html>
	);
}
