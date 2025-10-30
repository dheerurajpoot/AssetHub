"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			setSubmitted(true);
		} catch {
			setError("Something went wrong, try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-950 via-blue-900 to-cyan-900'>
			<Card className='w-full max-w-md border-blue-700 bg-slate-900/90'>
				<CardContent className='p-8'>
					<h2 className='text-2xl font-bold mb-5 text-white text-center'>
						Reset Password
					</h2>
					{submitted ? (
						<>
							<p className='text-blue-300 text-center mb-4'>
								If an account exists for <b>{email}</b>, you'll
								soon receive an email with password reset
								instructions.
							</p>
							<Button
								className='mt-4 w-full'
								onClick={() => router.push("/login")}>
								Back to Login
							</Button>
						</>
					) : (
						<form className='space-y-6' onSubmit={handleSubmit}>
							<input
								type='email'
								placeholder='Email address'
								className='w-full p-3 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-lg'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={loading}
								required
								autoFocus
							/>
							<Button
								type='submit'
								className='w-full bg-linear-to-r from-blue-600 to-cyan-500 text-white'
								disabled={loading || !email}>
								{loading ? "Sending..." : "Send Reset Link"}
							</Button>
							{error && (
								<div className='text-red-400 text-center text-sm mt-2'>
									{error}
								</div>
							)}
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
