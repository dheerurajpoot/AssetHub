"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, DollarSign, TrendingUp } from "lucide-react";
import axios from "axios";
import { userContext } from "@/context/userContext";
import { toast } from "sonner";

export default function Dashboard() {
	const { user } = userContext();
	const [listings, setListings] = useState<any[]>([]);
	const [bids, setBids] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				if (!user) {
					return;
				}

				const listingsRes = await axios.get(
					`/api/listings?userId=${user?._id}`
				);

				const listingsData = await listingsRes.data;

				setListings(listingsData.listings || []);
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [user]);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				Loading...
			</div>
		);
	}

	const stats = [
		{
			title: "Total Listings",
			value: user?.totalListings || 0,
			icon: Eye,
			color: "bg-blue-500",
		},
		{
			title: "Total Sales",
			value: user?.totalSales || 0,
			icon: TrendingUp,
			color: "bg-green-500",
		},
		{
			title: "Total Earnings",
			value: `$${(user?.totalEarnings || 0).toLocaleString()}`,
			icon: DollarSign,
			color: "bg-purple-500",
		},
	];

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 pb-24 md:pb-8'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
					<div>
						<h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
							Welcome back, {user?.name}
						</h1>
						<p className='text-slate-400'>
							Manage your digital assets and track your sales
						</p>
					</div>
					<Link href='/dashboard/create-listing'>
						<Button className='bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2'>
							<Plus size={20} />
							Create Listing
						</Button>
					</Link>
				</div>

				{/* Stats Grid */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
					{stats.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<Card
								key={index}
								className='bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors'>
								<CardContent className='p-6'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-slate-400 text-sm mb-1'>
												{stat.title}
											</p>
											<p className='text-2xl font-bold text-white'>
												{stat.value}
											</p>
										</div>
										<div
											className={`${stat.color} p-3 rounded-lg`}>
											<Icon
												size={24}
												className='text-white'
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Main Content */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Listings */}
					<div className='lg:col-span-2'>
						<Card className='bg-slate-800 border-slate-700'>
							<CardHeader>
								<CardTitle className='text-white'>
									Your Listings
								</CardTitle>
								<CardDescription>
									Manage and monitor your active listings
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{listings.length > 0 ? (
										listings.map((listing: any) => (
											<div
												key={listing._id}
												className='flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors'>
												<div className='flex-1'>
													<h3 className='font-semibold text-white'>
														{listing.title}
													</h3>
													<p className='text-sm text-slate-400'>
														{listing.category}
													</p>
												</div>
												<div className='text-right'>
													<p className='font-bold text-white'>
														$
														{listing.price.toLocaleString()}
													</p>
													<p className='text-xs text-slate-400'>
														{listing.views} views
													</p>
												</div>
												<Link
													href={`/dashboard/edit-listing/${listing._id}`}>
													<Button
														variant='outline'
														size='sm'
														className='ml-4 bg-transparent'>
														Edit
													</Button>
												</Link>
											</div>
										))
									) : (
										<p className='text-slate-400 text-center py-8'>
											No listings yet. Create your first
											one!
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Recent Bids */}
					<div>
						<Card className='bg-slate-800 border-slate-700'>
							<CardHeader>
								<CardTitle className='text-white'>
									Recent Bids
								</CardTitle>
								<CardDescription>
									Bids on your listings
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									{bids.length > 0 ? (
										bids.slice(0, 5).map((bid: any) => (
											<div
												key={bid._id}
												className='p-3 bg-slate-700 rounded-lg'>
												<p className='text-sm font-semibold text-white'>
													$
													{bid.amount.toLocaleString()}
												</p>
												<p className='text-xs text-slate-400'>
													{new Date(
														bid.createdAt
													).toLocaleDateString()}
												</p>
											</div>
										))
									) : (
										<p className='text-slate-400 text-center py-8'>
											No bids yet
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
