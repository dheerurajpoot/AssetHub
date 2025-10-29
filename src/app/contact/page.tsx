"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// In a real app, this would send to an API
		console.log("Form submitted:", formData);
		setSubmitted(true);
		setTimeout(() => {
			setFormData({ name: "", email: "", subject: "", message: "" });
			setSubmitted(false);
		}, 3000);
	};

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
			{/* Header */}
			<div className='border-b border-slate-700'>
				<div className='max-w-7xl mx-auto px-4 md:px-8 py-6'>
					<Link href='/'>
						<Button
							variant='ghost'
							className='text-slate-300 hover:text-white'>
							← Back to Home
						</Button>
					</Link>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-4xl mx-auto px-4 md:px-8 py-16'>
				<h1 className='text-4xl md:text-5xl font-bold text-white mb-6'>
					Contact Us
				</h1>
				<p className='text-slate-400 mb-12'>
					Have questions? We'd love to hear from you.
				</p>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					{/* Contact Form */}
					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<form onSubmit={handleSubmit} className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-slate-300 mb-2'>
										Name
									</label>
									<Input
										name='name'
										value={formData.name}
										onChange={handleChange}
										placeholder='Your name'
										className='bg-slate-700 border-slate-600 text-white'
										required
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-slate-300 mb-2'>
										Email
									</label>
									<Input
										name='email'
										type='email'
										value={formData.email}
										onChange={handleChange}
										placeholder='your@email.com'
										className='bg-slate-700 border-slate-600 text-white'
										required
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-slate-300 mb-2'>
										Subject
									</label>
									<Input
										name='subject'
										value={formData.subject}
										onChange={handleChange}
										placeholder='How can we help?'
										className='bg-slate-700 border-slate-600 text-white'
										required
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-slate-300 mb-2'>
										Message
									</label>
									<textarea
										name='message'
										value={formData.message}
										onChange={(
											e: React.ChangeEvent<HTMLTextAreaElement>
										) => handleChange(e)}
										placeholder='Your message...'
										className='w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500'
										rows={5}
										required
									/>
								</div>

								<Button
									type='submit'
									className='w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'>
									{submitted
										? "Message Sent!"
										: "Send Message"}
								</Button>
							</form>
						</CardContent>
					</Card>

					{/* Contact Info */}
					<div className='space-y-6'>
						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-6'>
								<h3 className='text-lg font-bold text-white mb-2'>
									Email
								</h3>
								<p className='text-slate-400'>
									drexpress90@gmail.com
								</p>
							</CardContent>
						</Card>

						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-6'>
								<h3 className='text-lg font-bold text-white mb-2'>
									Response Time
								</h3>
								<p className='text-slate-400'>
									We typically respond within 24 hours
								</p>
							</CardContent>
						</Card>

						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-6'>
								<h3 className='text-lg font-bold text-white mb-2'>
									Support Hours
								</h3>
								<p className='text-slate-400'>
									Monday - Friday: 9 AM - 6 PM EST
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
