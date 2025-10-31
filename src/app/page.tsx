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

			{/* Featured Listings (List View) */}
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
					<div className='space-y-4'>
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<Card
								key={i}
								className='bg-slate-800 border-slate-700'>
								<CardContent className='p-4'>
									<div className='flex gap-4 items-center'>
										<div className='w-40 h-28 bg-slate-700 rounded animate-pulse' />
										<div className='flex-1 space-y-3'>
											<div className='h-4 w-1/2 bg-slate-700 rounded animate-pulse' />
											<div className='h-3 w-1/3 bg-slate-700 rounded animate-pulse' />
											<div className='h-3 w-2/3 bg-slate-700 rounded animate-pulse' />
										</div>
										<div className='w-28 h-6 bg-slate-700 rounded animate-pulse' />
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<div className='space-y-4'>
						{listings.slice(0, 6).map((listing: any) => (
							<Link
								key={listing._id}
								href={`/listing/${listing._id}`}
								className='mx-1'>
								<Card className='bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer'>
									<CardContent className='p-4'>
										<div className='flex flex-col sm:flex-row gap-4'>
											{/* Thumbnail */}
											<div className='w-full sm:w-40 h-56 sm:h-28 overflow-hidden rounded-lg border border-slate-700 bg-slate-900/40'>
												{listing.thumbnail ||
												(listing.images &&
													listing.images[0]) ? (
													<img
														src={
															listing.thumbnail ||
															listing.images[0]
														}
														alt={listing.title}
														className='w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300'
													/>
												) : (
													<div className='w-full h-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center'>
														<TrendingUp
															size={32}
															className='text-blue-500'
														/>
													</div>
												)}
											</div>

											{/* Main */}
											<div className='flex-1 min-w-0'>
												<div className='flex items-start justify-between gap-3'>
													<div className='min-w-0'>
														<h3 className='text-white font-semibold text-lg truncate'>
															{listing.title}
														</h3>
														<p className='text-slate-400 text-sm mt-0.5'>
															{listing.category}
														</p>
													</div>
													{/* Price and Status */}
													<div className='text-right shrink-0'>
														<p className='text-2xl font-bold text-white'>
															$
															{Number(
																listing.price
															).toLocaleString()}
														</p>
														<span
															className={`${
																listing.status ===
																"sold"
																	? "text-red-400 bg-red-400/10 border-red-400/30"
																	: "text-green-400 bg-green-400/10 border-green-400/30"
															} text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 border`}>
															{listing.status ===
															"sold"
																? "Sold"
																: "Active"}
														</span>
													</div>
												</div>

												{/* Metrics */}
												<div className='grid grid-cols-4 md:grid-cols-6 gap-3 mt-3'>
													{listing.metrics
														?.monthlyRevenue && (
														<div className='p-3 bg-slate-700/60 rounded border border-slate-600'>
															<p className='text-xs text-slate-400'>
																Monthly Revenue
															</p>
															<p className='text-white font-semibold'>
																$
																{Number(
																	listing
																		.metrics
																		.monthlyRevenue
																).toLocaleString()}
															</p>
														</div>
													)}
													{listing.metrics
														?.monthlyTraffic && (
														<div className='p-3 bg-slate-700/60 rounded border border-slate-600'>
															<p className='text-xs text-slate-400'>
																Monthly Traffic
															</p>
															<p className='text-white font-semibold'>
																{Number(
																	listing
																		.metrics
																		.monthlyTraffic
																).toLocaleString()}
															</p>
														</div>
													)}
													{listing.metrics
														?.followers && (
														<div className='p-3 bg-slate-700/60 rounded border border-slate-600'>
															<p className='text-xs text-slate-400'>
																Followers
															</p>
															<p className='text-white font-semibold'>
																{Number(
																	listing
																		.metrics
																		.followers
																).toLocaleString()}
															</p>
														</div>
													)}
													{listing.metrics?.age && (
														<div className='p-3 bg-slate-700/60 rounded border border-slate-600'>
															<p className='text-xs text-slate-400'>
																Age
															</p>
															<p className='text-white font-semibold'>
																{Number(
																	listing
																		.metrics
																		.age
																)}{" "}
																months
															</p>
														</div>
													)}
													{listing.metrics
														?.country && (
														<div className='p-3 bg-slate-700/60 rounded border border-slate-600'>
															<p className='text-xs text-slate-400'>
																Country
															</p>
															<p className='text-white font-semibold'>
																{
																	listing
																		.metrics
																		.country
																}
															</p>
														</div>
													)}
												</div>

												{/* Description (optional) */}
												{listing.description && (
													<p className='text-slate-300 text-sm mt-4 line-clamp-2'>
														{listing.description}
													</p>
												)}
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
