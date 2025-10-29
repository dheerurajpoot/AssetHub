import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const adminId = searchParams.get("adminId");
		console.log(adminId);

		await connectDB();

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const users = await User.find()
			.select(
				"name email verified totalListings totalSales rating createdAt"
			)
			.sort({ createdAt: -1 });

		return NextResponse.json(users);
	} catch (error) {
		console.error("Admin users fetch error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch users" },
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {
		const { userId, action, adminId } = await request.json();

		await connectDB();

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (action === "verify") {
			await User.findByIdAndUpdate(userId, { verified: true });
		} else if (action === "unverify") {
			await User.findByIdAndUpdate(userId, { verified: false });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Admin user update error:", error);
		return NextResponse.json(
			{ error: "Failed to update user" },
			{ status: 500 }
		);
	}
}
