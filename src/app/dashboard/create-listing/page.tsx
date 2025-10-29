"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

const categories = [
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

export default function CreateListing() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		price: "",
		metrics: {
			monthlyRevenue: "",
			monthlyTraffic: "",
			followers: "",
			subscribers: "",
			engagement: "",
			age: "",
		},
		details: {
			niche: "",
			monetization: "",
			trafficSource: "",
			growthPotential: "",
		},
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleMetricsChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			metrics: {
				...prev.metrics,
				[name]: value,
			},
		}));
	};

	const handleDetailsChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			details: {
				...prev.details,
				[name]: value,
			},
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const userId = localStorage.getItem("userId");
			const response = await axios.post("/api/listings", {
				...formData,
				price: Number.parseFloat(formData.price),
				userId,
				images: [],
			});

			if (response.status === 201) {
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("Failed to create listing:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8'>
			<div className='max-w-4xl mx-auto'>
				<Card className='bg-slate-800 border-slate-700'>
					<CardHeader>
						<CardTitle className='text-white text-2xl'>
							Create New Listing
						</CardTitle>
						<CardDescription>
							List your digital asset for sale
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-6'>
							{/* Basic Info */}
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold text-white'>
									Basic Information
								</h3>

								<div>
									<label className='block text-sm font-medium text-slate-300 mb-2'>
										Title
									</label>
									<Input
										name='title'
										value={formData.title}
										onChange={handleChange}
										placeholder='e.g., High-Traffic Tech Blog'
										className='bg-slate-700 border-slate-600 text-white'
										required
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-slate-300 mb-2'>
										Description
									</label>
									<textarea
										name='description'
										value={formData.description}
										onChange={(
											e: React.ChangeEvent<HTMLTextAreaElement>
										) => handleChange(e)}
										placeholder='Describe your asset in detail...'
										className='w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500'
										rows={4}
										required
									/>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Category
										</label>
										<select
											name='category'
											value={formData.category}
											onChange={(
												e: React.ChangeEvent<HTMLSelectElement>
											) => handleChange(e)}
											className='w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500'
											required>
											<option value=''>
												Select a category
											</option>
											{categories.map((cat) => (
												<option key={cat} value={cat}>
													{cat}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Price ($)
										</label>
										<Input
											name='price'
											type='number'
											value={formData.price}
											onChange={handleChange}
											placeholder='0.00'
											className='bg-slate-700 border-slate-600 text-white'
											required
										/>
									</div>
								</div>
							</div>

							{/* Metrics */}
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold text-white'>
									Performance Metrics
								</h3>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Monthly Revenue ($)
										</label>
										<Input
											name='monthlyRevenue'
											type='number'
											value={
												formData.metrics.monthlyRevenue
											}
											onChange={handleMetricsChange}
											placeholder='0'
											className='bg-slate-700 border-slate-600 text-white'
										/>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Monthly Traffic
										</label>
										<Input
											name='monthlyTraffic'
											type='number'
											value={
												formData.metrics.monthlyTraffic
											}
											onChange={handleMetricsChange}
											placeholder='0'
											className='bg-slate-700 border-slate-600 text-white'
										/>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Followers/Subscribers
										</label>
										<Input
											name='followers'
											type='number'
											value={formData.metrics.followers}
											onChange={handleMetricsChange}
											placeholder='0'
											className='bg-slate-700 border-slate-600 text-white'
										/>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Age (months)
										</label>
										<Input
											name='age'
											type='number'
											value={formData.metrics.age}
											onChange={handleMetricsChange}
											placeholder='0'
											className='bg-slate-700 border-slate-600 text-white'
										/>
									</div>
								</div>
							</div>

							{/* Details */}
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold text-white'>
									Additional Details
								</h3>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Niche
										</label>
										<Input
											name='niche'
											value={formData.details.niche}
											onChange={handleDetailsChange}
											placeholder='e.g., Technology, Finance'
											className='bg-slate-700 border-slate-600 text-white'
										/>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Monetization
										</label>
										<Input
											name='monetization'
											value={
												formData.details.monetization
											}
											onChange={handleDetailsChange}
											placeholder='e.g., AdSense, Sponsorships'
											className='bg-slate-700 border-slate-600 text-white'
										/>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Traffic Source
										</label>
										<Input
											name='trafficSource'
											value={
												formData.details.trafficSource
											}
											onChange={handleDetailsChange}
											placeholder='e.g., Organic, Paid'
											className='bg-slate-700 border-slate-600 text-white'
										/>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-300 mb-2'>
											Growth Potential
										</label>
										<Input
											name='growthPotential'
											value={
												formData.details.growthPotential
											}
											onChange={handleDetailsChange}
											placeholder='e.g., High, Medium, Low'
											className='bg-slate-700 border-slate-600 text-white'
										/>
									</div>
								</div>
							</div>

							{/* Submit */}
							<div className='flex gap-4'>
								<Button
									type='submit'
									disabled={loading}
									className='bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'>
									{loading ? "Creating..." : "Create Listing"}
								</Button>
								<Button
									type='button'
									variant='outline'
									onClick={() => router.back()}
									className='border-slate-600 text-slate-300 hover:bg-slate-700'>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
