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
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
	title: {
		default: "WebDeelers - Buy & Sell Digital Assets | Trusted Marketplace",
		template: "%s | WebDeelers",
	},
	description:
		"WebDeelers is the trusted marketplace for buying and selling digital assets. Discover websites, YouTube channels, social media accounts, mobile apps, SaaS products, and more. Buy verified digital properties with complete metrics and analytics.",
	keywords: [
		"buy digital assets",
		"sell digital assets",
		"digital marketplace",
		"buy website",
		"sell website",
		"YouTube channel for sale",
		"buy Instagram account",
		"buy TikTok account",
		"mobile app marketplace",
		"SaaS marketplace",
		"ecommerce store for sale",
		"digital assets marketplace",
		"verified digital properties",
		"buy social media account",
		"digital business for sale",
		"WebDeelers",
	],
	authors: [{ name: "WebDeelers" }],
	creator: "WebDeelers",
	publisher: "WebDeelers",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		title: "WebDeelers - Buy & Sell Digital Assets | Trusted Marketplace",
		description:
			"WebDeelers is the trusted marketplace for buying and selling digital assets. Discover websites, YouTube channels, social media accounts, mobile apps, SaaS products, and more.",
		siteName: "WebDeelers",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "WebDeelers - Digital Assets Marketplace",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "WebDeelers - Buy & Sell Digital Assets",
		description:
			"The trusted marketplace for buying and selling digital assets. Discover verified digital properties with complete metrics.",
		images: ["/og-image.jpg"],
		creator: "@webdeelers",
		site: "@webdeelers",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
	},
	alternates: {
		canonical: "/",
	},
	category: "Digital Assets Marketplace",
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
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<meta name='theme-color' content='#0f172a' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta
					name='apple-mobile-web-app-status-bar-style'
					content='black-translucent'
				/>
				{/* Structured Data - Organization */}
				<script
					type='application/ld+json'
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "WebDeelers",
							url: process.env.NEXT_PUBLIC_APP_URL!,
							logo: `${process.env
								.NEXT_PUBLIC_APP_URL!}/logo.png`,
							description:
								"Trusted marketplace for buying and selling digital assets",
							sameAs: [
								"https://twitter.com/webdeelers",
								"https://facebook.com/webdeelers",
								"https://linkedin.com/company/webdeelers",
							],
							contactPoint: {
								"@type": "ContactPoint",
								contactType: "Customer Service",
								email: "support@webdeelers.com",
							},
						}),
					}}
				/>
				{/* Structured Data - WebSite */}
				<script
					type='application/ld+json'
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							name: "WebDeelers",
							url: process.env.NEXT_PUBLIC_APP_URL!,
							potentialAction: {
								"@type": "SearchAction",
								target: {
									"@type": "EntryPoint",
									urlTemplate: `${process.env
										.NEXT_PUBLIC_APP_URL!}/marketplace?search={search_term_string}`,
								},
								"query-input":
									"required name=search_term_string",
							},
						}),
					}}
				/>
				{/* Structured Data - Marketplace */}
				<script
					type='application/ld+json'
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "OnlineStore",
							name: "WebDeelers",
							description:
								"Buy and sell digital assets including websites, YouTube channels, social media accounts, mobile apps, and SaaS products",
							url: process.env.NEXT_PUBLIC_APP_URL!,
							priceRange: "$$",
						}),
					}}
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
