"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
	const params = useSearchParams();
	const email = params.get("email") || "";
	const token = params.get("token") || "";
	const [pw1, setPw1] = useState("");
	const [pw2, setPw2] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		if (!pw1 || pw1.length < 6) {
			setError("Password must be at least 6 characters.");
			setLoading(false);
			return;
		}
		if (pw1 !== pw2) {
			setError("Passwords do not match.");
			setLoading(false);
			return;
		}
		try {
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, token, password: pw1 }),
			});
			const data = await res.json();
			if (data.success) {
				setSuccess(true);
			} else {
				setError(data.message || "Reset failed.");
			}
		} catch {
			setError("Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-950 via-blue-900 to-cyan-900'>
			<Card className='w-full max-w-md border-blue-700 bg-slate-900/90'>
				<CardContent className='p-8'>
					<h2 className='text-2xl font-bold mb-4 text-white text-center'>
						Set A New Password
					</h2>
					<form className='space-y-6' onSubmit={handleSubmit}>
						<input
							type='password'
							required
							minLength={6}
							placeholder='New password'
							className='w-full p-3 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none text-lg'
							disabled={success || loading}
							value={pw1}
							onChange={(e) => setPw1(e.target.value)}
						/>
						<input
							type='password'
							required
							minLength={6}
							placeholder='Repeat new password'
							className='w-full p-3 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none text-lg'
							disabled={success || loading}
							value={pw2}
							onChange={(e) => setPw2(e.target.value)}
						/>
						<Button
							disabled={loading || success || !pw1 || !pw2}
							className='w-full bg-linear-to-r from-blue-600 to-cyan-500 text-white'
							type='submit'>
							{loading
								? "Resetting..."
								: success
								? "Password Reset!"
								: "Set New Password"}
						</Button>
					</form>
					{error && (
						<p className='mt-4 text-red-400 text-center text-sm'>
							{error}
						</p>
					)}
					{success && (
						<>
							<p className='mt-4 text-green-400 text-center text-sm'>
								Your password has been updated.
							</p>
							<Button
								size='sm'
								className='mt-4 w-full bg-blue-900/80'
								onClick={() => router.push("/login")}>
								Go to Login
							</Button>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
