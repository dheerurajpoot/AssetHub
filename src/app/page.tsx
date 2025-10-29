"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	TrendingUp,
	Shield,
	Zap,
	Users,
	Globe,
	Smartphone,
	ShoppingCart,
	BarChart3,
	ArrowRight,
} from "lucide-react";

export default function Home() {
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("");

	useEffect(() => {
		const fetchListings = async () => {
			try {
				const response = await fetch("/api/listings?page=1");
				const data = await response.json();
				setListings(data.listings || []);
			} catch (error) {
				console.error("Failed to fetch listings:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchListings();
	}, []);

	const categories = [
		{ name: "Website", icon: Globe },
		{ name: "YouTube Channel", icon: TrendingUp },
		{ name: "Social Media", icon: Users },
		{ name: "Mobile App", icon: Smartphone },
		{ name: "E-commerce", icon: ShoppingCart },
		{ name: "SaaS", icon: BarChart3 },
	];

	const features = [
		{
			icon: Shield,
			title: "Verified Sellers",
			description:
				"All sellers are verified and their assets are thoroughly checked",
		},
		{
			icon: Zap,
			title: "Fast Transactions",
			description: "Secure payment processing with instant confirmation",
		},
		{
			icon: TrendingUp,
			title: "Detailed Metrics",
			description:
				"Complete performance data and analytics for every asset",
		},
		{
			icon: Users,
			title: "Expert Support",
			description: "24/7 customer support to help with your transactions",
		},
	];

	return (
		<div className='min-h-screen'>
			{/* Hero Section */}
			<section className='max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
					<div>
						<h1 className='text-4xl md:text-6xl font-bold text-white mb-6 leading-tight'>
							Buy & Sell Digital Assets with Confidence
						</h1>
						<p className='text-xl text-slate-400 mb-8'>
							AssetHub is the trusted marketplace for digital
							entrepreneurs. Discover, evaluate, and acquire
							high-quality digital properties.
						</p>
						<div className='flex flex-col sm:flex-row gap-4'>
							<Link href='/marketplace'>
								<Button className='bg-linear-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg gap-2'>
									Browse Marketplace
									<ArrowRight size={20} />
								</Button>
							</Link>
							<Link href='/guide'>
								<Button
									variant='outline'
									className='border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-6 text-lg bg-transparent'>
									Learn More
								</Button>
							</Link>
						</div>
					</div>

					{/* Hero Image */}
					<div className='relative'>
						<div className='absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl blur-3xl opacity-20' />
						<div className='relative bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700'>
							<div className='space-y-4'>
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className='h-20 bg-slate-700 rounded-lg animate-pulse'
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className='max-w-7xl mx-auto px-4 md:px-8 py-16'>
				<h2 className='text-3xl font-bold text-white mb-8'>
					Browse by Category
				</h2>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
					{categories.map((cat) => {
						const Icon = cat.icon;
						return (
							<Link
								key={cat.name}
								href={`/marketplace?category=${cat.name}`}>
								<Card className='bg-slate-800 border-slate-700 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/20'>
									<CardContent className='p-6 text-center'>
										<Icon
											size={32}
											className='text-blue-500 mx-auto mb-3'
										/>
										<p className='text-white font-semibold text-sm'>
											{cat.name}
										</p>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			</section>

			{/* Featured Listings */}
			<section className='max-w-7xl mx-auto px-4 md:px-8 py-16'>
				<div className='flex justify-between items-center mb-8'>
					<h2 className='text-3xl font-bold text-white'>
						Featured Listings
					</h2>
					<Link href='/marketplace'>
						<Button
							variant='outline'
							className='border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent'>
							View All
						</Button>
					</Link>
				</div>

				{loading ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[1, 2, 3].map((i, index) => (
							<Card
								key={index}
								className='bg-slate-800 border-slate-700 animate-pulse'>
								<div className='h-48 bg-slate-700' />
								<CardContent className='p-6 space-y-3'>
									<div className='h-4 bg-slate-700 rounded w-3/4' />
									<div className='h-4 bg-slate-700 rounded w-1/2' />
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{listings.slice(0, 6).map((listing: any) => (
							<Link
								key={listing._id}
								href={`/listing/${listing._id}`}>
								<Card className='bg-slate-800 border-slate-700 hover:border-blue-500 cursor-pointer transition-all h-full hover:shadow-lg hover:shadow-blue-500/20'>
									<div className='h-48 bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center'>
										<TrendingUp
											size={48}
											className='text-blue-500'
										/>
									</div>
									<CardContent className='p-6'>
										<h3 className='font-bold text-white mb-2 line-clamp-2'>
											{listing.title}
										</h3>
										<p className='text-sm text-slate-400 mb-4'>
											{listing.category}
										</p>

										<div className='grid grid-cols-2 gap-2 mb-4'>
											{listing.metrics
												?.monthlyRevenue && (
												<div className='text-xs'>
													<p className='text-slate-500'>
														Revenue
													</p>
													<p className='font-bold text-white'>
														$
														{listing.metrics.monthlyRevenue.toLocaleString()}
													</p>
												</div>
											)}
											{listing.metrics?.followers && (
												<div className='text-xs'>
													<p className='text-slate-500'>
														Followers
													</p>
													<p className='font-bold text-white'>
														{listing.metrics.followers.toLocaleString()}
													</p>
												</div>
											)}
										</div>

										<div className='flex justify-between items-center pt-4 border-t border-slate-700'>
											<span className='text-2xl font-bold text-white'>
												$
												{listing.price.toLocaleString()}
											</span>
											<div className='flex items-center gap-1'>
												<span className='text-yellow-500'>
													★
												</span>
												<span className='text-sm text-slate-400'>
													{listing.seller?.rating ||
														0}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				)}
			</section>

			{/* Features */}
			<section className='max-w-7xl mx-auto px-4 md:px-8 py-16'>
				<h2 className='text-3xl font-bold text-white mb-12 text-center'>
					Why Choose AssetHub?
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<Card
								key={index}
								className='bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors'>
								<CardContent className='p-6'>
									<Icon
										size={32}
										className='text-blue-500 mb-4'
									/>
									<h3 className='font-bold text-white mb-2'>
										{feature.title}
									</h3>
									<p className='text-slate-400 text-sm'>
										{feature.description}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			{/* CTA Section */}
			<section className='max-w-7xl mx-auto px-4 md:px-8 py-16'>
				<div className='bg-linear-to-r from-blue-900 to-cyan-900 rounded-2xl p-12 text-center border border-blue-700'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
						Ready to Get Started?
					</h2>
					<p className='text-blue-100 mb-8 text-lg'>
						Join thousands of digital entrepreneurs buying and
						selling assets on AssetHub
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link href='/marketplace'>
							<Button className='bg-white hover:bg-slate-100 text-blue-900 px-8 py-6 text-lg font-semibold'>
								Start Browsing
							</Button>
						</Link>
						<Link href='/guide'>
							<Button
								variant='outline'
								className='border-white text-white hover:bg-white/10 px-8 py-6 text-lg bg-transparent'>
								Learn How to Sell
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
