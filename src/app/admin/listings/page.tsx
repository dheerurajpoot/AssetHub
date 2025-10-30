"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Trash2,
	Eye,
	EyeOff,
	DollarSign,
	User,
	CheckCircle,
	XCircle,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import { toast } from "sonner";
import { userContext } from "@/context/userContext";
import axios from "axios";

export default function AdminListingsPage() {
	const { user } = userContext();
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchListings = async () => {
			try {
				if (!user) {
					return;
				}
				const statusParam = filter !== "all" ? `&status=${filter}` : "";
				const response = await fetch(
					`/api/admin/all-listings?adminId=${user?._id}${statusParam}`
				);
				const data = await response.json();
				setListings(data);
			} catch (error) {
				console.error("Failed to fetch listings:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchListings();
	}, [filter, user]);

	const handleDelete = async (listingId: string) => {
		if (!confirm("Are you sure you want to delete this listing?")) return;

		try {
			if (!user) {
				return;
			}
			const response = await fetch("/api/admin/all-listings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					listingId,
					action: "delete",
					adminId: user?._id,
				}),
			});

			if (response.ok) {
				toast.success("Status Deleted Successfully!");
			}
		} catch (error) {
			console.error("Failed to delete listing:", error);
		}
	};

	const handleDeactivate = async (listingId: string) => {
		try {
			if (!user) {
				return;
			}
			const response = await fetch("/api/admin/all-listings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					listingId,
					action: "deactivate",
					adminId: user?._id,
				}),
			});

			if (response.ok) {
				toast.success("Status Updated Successfully!");
			}
		} catch (error) {
			console.error("Failed to deactivate listing:", error);
		}
	};

	const handleSold = async (listingId: string) => {
		try {
			if (!user) {
				return;
			}
			const response = await fetch("/api/admin/all-listings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					listingId,
					action: "sold",
					adminId: user?._id,
				}),
			});

			if (response.ok) {
				toast.success("Status Updated Successfully!");
			}
		} catch (error) {
			console.error("Failed to activate listing:", error);
		}
	};

	const handleApprove = async (listingId: string) => {
		try {
			if (!user) {
				return;
			}
			const response = await axios.put("/api/admin/listings", {
				listingId,
				status: "verified",
				adminId: user?._id,
			});

			if (response.status === 200) {
				setListings(listings.filter((l: any) => l._id !== listingId));
			}
		} catch (error) {
			console.error("Failed to approve listing:", error);
		}
	};

	const handleReject = async (listingId: string) => {
		try {
			if (!user) {
				return;
			}
			const response = await axios.put("/api/admin/listings", {
				listingId,
				status: "rejected",
				adminId: user?._id,
			});

			if (response.status === 200) {
				setListings(listings.filter((l: any) => l._id !== listingId));
			}
		} catch (error) {
			console.error("Failed to reject listing:", error);
		}
	};

	const filteredListings = listings.filter(
		(listing: any) =>
			listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			listing.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className='flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
			<AdminSidebar />

			{/* Main Content */}
			<main className='flex-1 md:ml-64 p-4 md:p-8'>
				{/* Header */}
				<div className='mb-8 mt-12 md:mt-0'>
					<h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
						Manage Listings
					</h1>
					<p className='text-slate-400'>
						View and manage all marketplace listings
					</p>
				</div>

				{/* Filter and Search */}
				<div className='flex flex-col md:flex-row gap-4 mb-6'>
					<input
						type='text'
						placeholder='Search by title or category...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500'
					/>
					<div className='flex gap-2'>
						{["all", "active", "inactive", "pending"].map(
							(status) => (
								<Button
									key={status}
									onClick={() => setFilter(status)}
									variant={
										filter === status
											? "default"
											: "outline"
									}
									className={
										filter === status
											? "bg-linear-to-br from-blue-500 to-cyan-500"
											: "border-slate-600 text-slate-300 hover:bg-slate-700"
									}>
									{status.charAt(0).toUpperCase() +
										status.slice(1)}
								</Button>
							)
						)}
					</div>
				</div>

				{/* Listings Grid */}
				<div className='grid grid-cols-1 gap-6'>
					{loading ? (
						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-12 text-center'>
								<p className='text-slate-400'>
									Loading listings...
								</p>
							</CardContent>
						</Card>
					) : filteredListings.length > 0 ? (
						filteredListings.map((listing: any) => (
							<Card
								key={listing._id}
								className='bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors'>
								<CardContent className='p-6'>
									<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
										<div className='flex-1'>
											<h3 className='text-xl font-bold text-white mb-2'>
												{listing.title}
											</h3>
											<p className='text-slate-400 mb-3 line-clamp-2'>
												{listing.description}
											</p>

											<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
												<div>
													<p className='text-xs text-slate-500'>
														Category
													</p>
													<p className='text-sm font-semibold text-white'>
														{listing.category}
													</p>
												</div>
												<div>
													<p className='text-xs text-slate-500 flex items-center gap-1'>
														<DollarSign size={12} />
														Price
													</p>
													<p className='text-sm font-semibold text-white'>
														$
														{listing.price.toLocaleString()}
													</p>
												</div>
												<div>
													<p className='text-xs text-slate-500 flex items-center gap-1'>
														<User size={12} />
														Seller
													</p>
													<p className='text-sm font-semibold text-white'>
														{listing.seller?.name}
													</p>
												</div>
												<div>
													<p className='text-xs text-slate-500'>
														Status
													</p>
													<span
														className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold mt-1 ${
															listing.status ===
															"active"
																? "bg-green-500/20 text-green-400"
																: listing.status ===
																  "inactive"
																? "bg-red-500/20 text-red-400"
																: "bg-yellow-500/20 text-yellow-400"
														}`}>
														{listing.status
															.charAt(0)
															.toUpperCase() +
															listing.status.slice(
																1
															)}
													</span>
												</div>
											</div>
										</div>

										{/* Action Buttons */}
										<div className='flex gap-2 w-full md:w-auto flex-wrap md:flex-nowrap'>
											{listing.status === "pending" && (
												<div className='flex gap-2 flex-col'>
													<Button
														onClick={() =>
															handleApprove(
																listing._id
															)
														}
														className='flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white gap-2'>
														<CheckCircle
															size={18}
														/>
														Approve
													</Button>
													<Button
														onClick={() =>
															handleReject(
																listing._id
															)
														}
														className='flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white gap-2'>
														<XCircle size={18} />
														Reject
													</Button>
												</div>
											)}

											{listing.status === "active" && (
												<div className='flex flex-col gap-2'>
													<Button
														onClick={() =>
															handleDeactivate(
																listing._id
															)
														}
														className='flex-1 md:flex-none bg-yellow-600 hover:bg-yellow-700 text-white gap-2 text-sm cursor-pointer'>
														<EyeOff size={16} />
														Deactivate
													</Button>
													<Button
														onClick={() =>
															handleSold(
																listing._id
															)
														}
														className='flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white gap-2 text-sm cursor-pointer'>
														<Eye size={16} />
														Sold
													</Button>
													<Button
														onClick={() =>
															handleDelete(
																listing._id
															)
														}
														className='flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white gap-2 text-sm cursor-pointer'>
														<Trash2 size={16} />
														Delete
													</Button>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-12 text-center'>
								<p className='text-slate-400'>
									No listings found
								</p>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8'>
					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<p className='text-slate-400 text-sm'>
								Total Listings
							</p>
							<p className='text-3xl font-bold text-white mt-2'>
								{listings.length}
							</p>
						</CardContent>
					</Card>
					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<p className='text-slate-400 text-sm'>
								Active Listings
							</p>
							<p className='text-3xl font-bold text-green-500 mt-2'>
								{
									listings.filter(
										(l: any) => l.status === "active"
									).length
								}
							</p>
						</CardContent>
					</Card>
					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<p className='text-slate-400 text-sm'>
								Sold Listings
							</p>
							<p className='text-3xl font-bold text-red-500 mt-2'>
								{
									listings.filter(
										(l: any) => l.status === "sold"
									).length
								}
							</p>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
