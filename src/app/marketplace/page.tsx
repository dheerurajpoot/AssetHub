"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp } from "lucide-react";
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
		<div className='min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-4xl font-bold text-white mb-4'>
						Digital Assets Marketplace
					</h1>
					<p className='text-slate-400'>
						Discover and purchase high-quality digital properties
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
								className={
									selectedCategory === cat
										? "bg-linear-to-r from-blue-500 to-cyan-500 text-white whitespace-nowrap cursor-pointer"
										: "border-slate-600 text-slate-600 hover:bg-slate-700 whitespace-nowrap cursor-pointer"
								}>
								{cat}
							</Button>
						))}
					</div>
				</div>

				{/* Listings Grid */}
				{loading ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<Card
								key={i}
								className='bg-slate-800 border-slate-700 animate-pulse'>
								<div className='h-48 bg-slate-700' />
								<CardContent className='p-6 space-y-3'>
									<div className='h-4 bg-slate-700 rounded w-3/4' />
									<div className='h-4 bg-slate-700 rounded w-1/2' />
								</CardContent>
							</Card>
						))}
					</div>
				) : filteredListings.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filteredListings.map((listing: any) => (
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
												<span className='text-sm text-slate-400'>
													{listing.status ===
													"active" ? (
														<p className='text-green-400 font-bold'>
															Active
														</p>
													) : (
														<h2 className='text-red-500 text-2xl font-bold'>
															Sold
														</h2>
													)}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<p className='text-slate-400 text-lg'>
							No listings found
						</p>
					</div>
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
	);
}
