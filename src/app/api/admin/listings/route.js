import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Listing from "@/models/Listing";
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

		const listings = await Listing.find()
			.populate("seller", "name email")
			.sort({ createdAt: -1 });

		return NextResponse.json(listings);
	} catch (error) {
		console.error("Admin listings fetch error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch listings" },
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {
		const { listingId, status, adminId } = await request.json();

		await connectDB();

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const listing = await Listing.findByIdAndUpdate(
			listingId,
			{
				verificationStatus: status,
				status: status === "verified" ? "active" : "rejected",
			},
			{ new: true }
		);

		return NextResponse.json({ success: true, listing });
	} catch (error) {
		console.error("Admin listing update error:", error);
		return NextResponse.json(
			{ message: "Failed to update listing" },
			{ status: 500 }
		);
	}
}
