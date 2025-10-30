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
import { userContext } from "@/context/userContext";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";

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

type ListingFormState = {
	title: string;
	description: string;
	category: string;
	price: string;
	thumbnail: string;
	images: string[];
	metrics: {
		monthlyRevenue: string;
		monthlyTraffic: string;
		followers: string;
		subscribers: string;
		engagement: string;
		age: string;
	};
	details: {
		niche: string;
		monetization: string;
		trafficSource: string;
		growthPotential: string;
	};
};

export default function CreateListing() {
	const router = useRouter();
	const { user } = userContext();
	const [loading, setLoading] = useState(false);
	const [uploadingImages, setUploadingImages] = useState(false);
	const [formData, setFormData] = useState<ListingFormState>({
		title: "",
		description: "",
		category: "",
		price: "",
		thumbnail: "",
		images: [],
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

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		isThumbnail = false
	) => {
		const files = Array.from((e.target.files as FileList) || []);
		if (files.length === 0) return;

		if (!isThumbnail && formData.images.length + files.length > 6) {
			alert("Maximum 6 images allowed");
			return;
		}

		setUploadingImages(true);

		try {
			const authRes = await fetch("/api/imagekit/auth");
			if (!authRes.ok) throw new Error("Failed to get ImageKit auth");
			const { token, expire, signature, publicKey } =
				await authRes.json();

			const uploadedUrls: string[] = [];

			for (const file of files) {
				const form = new FormData();
				form.append("file", file);
				form.append("fileName", file.name);
				form.append("publicKey", publicKey);
				form.append("signature", signature);
				form.append("expire", String(expire));
				form.append("token", token);
				form.append("useUniqueFileName", "true");

				const uploadRes = await fetch(
					"https://upload.imagekit.io/api/v1/files/upload",
					{ method: "POST", body: form }
				);

				if (!uploadRes.ok) throw new Error("Image upload failed");
				const data = await uploadRes.json();
				if (data && data.url) uploadedUrls.push(data.url);
			}

			if (isThumbnail && uploadedUrls.length > 0) {
				setFormData((prev) => ({
					...prev,
					thumbnail: uploadedUrls[0],
				}));
			} else if (uploadedUrls.length > 0) {
				setFormData((prev) => ({
					...prev,
					images: [...prev.images, ...uploadedUrls],
				}));
			}
		} catch (error) {
			console.error("Upload failed:", error);
			alert("Failed to upload images");
		} finally {
			setUploadingImages(false);
		}
	};

	const removeImage = (index: any) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const removeThumbnail = () => {
		setFormData((prev) => ({
			...prev,
			thumbnail: "",
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		if (!user) {
			toast.error("User not found!");
		}

		try {
			const response = await axios.post("/api/listings", {
				...formData,
				price: Number.parseFloat(formData.price),
				userId: user?._id,
			});

			if (response.data.success) {
				setLoading(false);
				toast.success(response.data.message || "Listing successfull!");
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

							{/* Images */}
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold text-white'>
									Images
								</h3>

								{/* Thumbnail Upload */}
								<div>
									<label className='block text-sm font-medium text-slate-300 mb-2'>
										Thumbnail Image
									</label>
									<div className='flex items-center gap-4'>
										<label className='flex-1 flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition'>
											<div className='text-center'>
												<Upload className='w-6 h-6 text-slate-400 mx-auto mb-2' />
												<span className='text-sm text-slate-400'>
													Click to upload thumbnail
												</span>
											</div>
											<input
												type='file'
												accept='image/*'
												onChange={(e) =>
													handleImageUpload(e, true)
												}
												disabled={uploadingImages}
												className='hidden'
											/>
										</label>
										{formData.thumbnail && (
											<div className='relative w-24 h-24'>
												<img
													src={
														formData.thumbnail ||
														"/placeholder.svg"
													}
													alt='Thumbnail'
													className='w-full h-full object-cover rounded-lg'
												/>
												<button
													type='button'
													onClick={removeThumbnail}
													className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600'>
													<X className='w-4 h-4 text-white' />
												</button>
											</div>
										)}
									</div>
								</div>

								{/* Additional Images Upload */}
								<div>
									<label className='block text-sm font-medium text-slate-300 mb-2'>
										Additional Images (up to 6)
									</label>
									<label className='flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition'>
										<div className='text-center'>
											<Upload className='w-6 h-6 text-slate-400 mx-auto mb-2' />
											<span className='text-sm text-slate-400'>
												Click to upload images (
												{formData.images.length}/6)
											</span>
										</div>
										<input
											type='file'
											accept='image/*'
											multiple
											onChange={(e) =>
												handleImageUpload(e, false)
											}
											disabled={
												uploadingImages ||
												formData.images.length >= 6
											}
											className='hidden'
										/>
									</label>

									{/* Image Preview Grid */}
									{formData.images.length > 0 && (
										<div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
											{formData.images.map(
												(image, index) => (
													<div
														key={index}
														className='relative group'>
														<img
															src={
																image ||
																"/placeholder.svg"
															}
															alt={`Image ${
																index + 1
															}`}
															className='w-full h-32 object-cover rounded-lg'
														/>
														<button
															type='button'
															onClick={() =>
																removeImage(
																	index
																)
															}
															className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition'>
															<X className='w-4 h-4 text-white' />
														</button>
													</div>
												)
											)}
										</div>
									)}
								</div>
							</div>

							{/* Submit */}
							<div className='flex gap-4'>
								<Button
									type='submit'
									disabled={loading || uploadingImages}
									className='bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'>
									{loading
										? "Creating..."
										: uploadingImages
										? "Uploading..."
										: "Create Listing"}
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
