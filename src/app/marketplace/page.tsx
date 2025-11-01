"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Search,
	TrendingUp,
	Eye,
	MapPin,
	DollarSign,
	Star,
} from "lucide-react";
import axios from "axios";

const categories = [
	"All",
	"Website",
	"YouTube Channel",
	"Facebook Page",
	"Instagram Page",
	"TikTok Account",
	"Twitter Account",
	"Play Console",
	"AdSense Dashboard",
	"Shopify Store",
	"Dropshipping Store",
	"SaaS",
	"Mobile App",
	"Other",
];

export default function Marketplace() {
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);

	useEffect(() => {
		const fetchListings = async () => {
			setLoading(true);
			try {
				const query = new URLSearchParams();
				if (selectedCategory !== "All")
					query.append("category", selectedCategory);
				query.append("page", page.toString());

				const response = await axios.get(`/api/listings?${query}`);
				const data = await response.data;
				setListings(data.listings || []);
			} catch (error) {
				console.error("Failed to fetch listings:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchListings();
	}, [selectedCategory, page]);

	const filteredListings = listings.filter((listing: any) =>
		listing.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<>
			<div className='min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8'>
				<div className='max-w-7xl mx-auto'>
					{/* Header */}
					<div className='mb-8'>
						<h1 className='text-4xl font-bold text-white mb-4'>
							Digital Assets Marketplace
						</h1>
						<p className='text-slate-400'>
							Discover and purchase high-quality digital
							properties
						</p>
					</div>

					{/* Search */}
					<div className='mb-8'>
						<div className='relative'>
							<Search
								className='absolute left-3 top-3 text-slate-400'
								size={20}
							/>
							<Input
								placeholder='Search listings...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500'
							/>
						</div>
					</div>

					{/* Categories */}
					<div className='market-category mb-8 overflow-x-auto pb-2'>
						<div className='flex gap-2'>
							{categories.map((cat) => (
								<Button
									key={cat}
									onClick={() => {
										setSelectedCategory(cat);
										setPage(1);
									}}
									variant={
										selectedCategory === cat
											? "default"
											: "outline"
									}
									className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
										selectedCategory === cat
											? "bg-linear-to-r from-blue-500 to-cyan-500 text-white whitespace-nowrap cursor-pointer"
											: "border-slate-600 text-slate-600 hover:bg-slate-700 whitespace-nowrap cursor-pointer"
									}`}>
									{cat}
								</Button>
							))}
						</div>
					</div>

					{/* Listings Grid */}
					{loading ? (
						<div className='grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6'>
							{[...Array(12)].map((_, i) => (
								<Card
									key={i}
									className='bg-slate-800 border-slate-700 overflow-hidden'>
									<CardContent className='p-0'>
										<div className='w-full h-48 bg-slate-700 animate-pulse' />
										<div className='p-4 space-y-3'>
											<div className='h-4 w-3/4 bg-slate-700 rounded animate-pulse' />
											<div className='h-3 w-1/2 bg-slate-700 rounded animate-pulse' />
											<div className='h-6 w-1/3 bg-slate-700 rounded animate-pulse' />
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : filteredListings.length > 0 ? (
						<div className='grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6'>
							{filteredListings.map((listing: any) => (
								<Link
									key={listing._id}
									href={`/listing/${listing._id}`}
									className='group'>
									<Card className='bg-slate-800 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 overflow-hidden h-full flex flex-col cursor-pointer'>
										{/* Image */}
										<div className='relative w-full h-48 overflow-hidden bg-linear-to-br from-slate-700 to-slate-900'>
											{listing.thumbnail ||
											(listing.images &&
												listing.images[0]) ? (
												<img
													src={
														listing.thumbnail ||
														listing.images[0]
													}
													alt={listing.title}
													className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center'>
													<TrendingUp
														size={40}
														className='text-blue-500'
													/>
												</div>
											)}
											{/* Status Badge */}
											<div className='absolute top-2 right-2'>
												<span
													className={`${
														listing.status ===
														"sold"
															? "bg-red-500/90 text-white"
															: "bg-green-500/90 text-white"
													} text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-lg`}>
													{listing.status === "sold"
														? "Sold"
														: "Active"}
												</span>
											</div>
											{/* Featured Badge */}
											{listing.featured && (
												<div className='absolute top-2 left-2'>
													<span className='bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-lg flex items-center gap-1'>
														<Star
															size={12}
															fill='currentColor'
														/>
														Featured
													</span>
												</div>
											)}
										</div>

										{/* Content */}
										<CardContent className='p-4 flex-1 flex flex-col'>
											{/* Title & Category */}
											<div className='mb-3'>
												<h3 className='text-white font-bold text-base mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors'>
													{listing.title}
												</h3>
												<div className='flex items-center gap-2 text-xs text-slate-400'>
													<span className='px-2 py-0.5 bg-slate-700/50 rounded'>
														{listing.category}
													</span>
												</div>
											</div>

											{/* Price */}
											<div className='mb-3'>
												<div className='flex items-baseline gap-1'>
													<DollarSign
														size={16}
														className='text-blue-400'
													/>
													<span className='text-2xl font-bold text-white'>
														{Number(
															listing.price
														).toLocaleString()}
													</span>
												</div>
											</div>

											{/* Metrics Grid */}
											<div className='grid grid-cols-2 gap-2 mb-3 flex-1'>
												{listing.metrics
													?.monthlyRevenue && (
													<div className='bg-slate-700/30 rounded-lg p-2 border border-slate-600/50'>
														<p className='text-[10px] text-slate-400 mb-0.5'>
															Revenue
														</p>
														<p className='text-xs font-semibold text-green-400'>
															$
															{Number(
																listing.metrics
																	.monthlyRevenue
															).toLocaleString()}
														</p>
													</div>
												)}
												{listing.metrics
													?.monthlyTraffic && (
													<div className='bg-slate-700/30 rounded-lg p-2 border border-slate-600/50'>
														<p className='text-[10px] text-slate-400 mb-0.5'>
															Traffic
														</p>
														<p className='text-xs font-semibold text-blue-400'>
															{Number(
																listing.metrics
																	.monthlyTraffic
															).toLocaleString()}
														</p>
													</div>
												)}
												{listing.metrics?.followers && (
													<div className='bg-slate-700/30 rounded-lg p-2 border border-slate-600/50'>
														<p className='text-[10px] text-slate-400 mb-0.5'>
															Followers
														</p>
														<p className='text-xs font-semibold text-purple-400'>
															{Number(
																listing.metrics
																	.followers
															).toLocaleString()}
														</p>
													</div>
												)}
												{listing.metrics?.age && (
													<div className='bg-slate-700/30 rounded-lg p-2 border border-slate-600/50'>
														<p className='text-[10px] text-slate-400 mb-0.5'>
															Age
														</p>
														<p className='text-xs font-semibold text-orange-400'>
															{Number(
																listing.metrics
																	.age
															)}{" "}
															mo
														</p>
													</div>
												)}
												{listing.details
													?.monetization && (
													<div className='bg-slate-700/30 rounded-lg p-2 border border-slate-600/50'>
														<p className='text-[10px] text-slate-400 mb-0.5'>
															Monetization
														</p>
														<p className='text-xs font-semibold text-orange-400'>
															{
																listing.details
																	.monetization
															}
														</p>
													</div>
												)}
											</div>

											{/* Bottom Info */}
											<div className='flex items-center justify-between pt-3 border-t border-slate-700/50'>
												{listing.metrics?.country && (
													<div className='flex items-center gap-1 text-xs text-slate-400'>
														<MapPin size={12} />
														<span>
															{
																listing.metrics
																	.country
															}
														</span>
													</div>
												)}
												<div className='flex items-center gap-1 text-xs text-slate-400'>
													<Eye size={12} />
													<span>
														{listing.views || 0}{" "}
														views
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					) : (
						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-12 text-center'>
								<TrendingUp
									size={48}
									className='mx-auto text-slate-600 mb-4'
								/>
								<h3 className='text-xl font-semibold text-white mb-2'>
									No Listings Found
								</h3>
								<p className='text-slate-400'>
									{searchTerm
										? "Try adjusting your search terms."
										: "No listings are available at the moment."}
								</p>
							</CardContent>
						</Card>
					)}

					{/* Pagination */}
					{filteredListings.length > 0 && (
						<div className='flex justify-center gap-4 mt-12'>
							<Button
								onClick={() => setPage(Math.max(1, page - 1))}
								disabled={page === 1}
								className='bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50'
								variant='outline'>
								Previous
							</Button>
							<span className='text-white flex items-center'>
								Page {page}
							</span>
							<Button
								onClick={() => setPage(page + 1)}
								className='bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'>
								Next
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
