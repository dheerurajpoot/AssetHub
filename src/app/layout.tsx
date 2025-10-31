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
	keywords: "assetHub",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head suppressHydrationWarning>
				<meta
					name='google-site-verification'
					content='xxxxxxxxxxxxxxxxxxxxxxxxxx'
				/>
				{/* Google Analytics Script */}
				<script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX'
				/>
				<script
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', 'G-XXXXXXXXXXXXX');
						`,
					}}
				/>
				<script
					async
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXX'
					crossOrigin='anonymous'
				/>
			</head>
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
