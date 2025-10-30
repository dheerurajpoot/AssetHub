import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const adminId = searchParams.get("adminId");

		await connectDB();

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const users = await User.find()
			.select("-password")
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
		} else if (action === "block") {
			await User.findByIdAndUpdate(userId, { isBlocked: true });
		} else if (action === "unblock") {
			await User.findByIdAndUpdate(userId, { isBlocked: false });
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

export async function DELETE(request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const adminId = searchParams.get("adminId");
		const userId = searchParams.get("userId");
		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}
		await User.findByIdAndDelete(userId);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Admin user delete error:", error);
		return NextResponse.json(
			{ error: "Failed to delete user" },
			{ status: 500 }
		);
	}
}
