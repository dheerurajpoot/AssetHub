import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const adminId = searchParams.get("adminId");
		const status = searchParams.get("status");

		await connectDB();

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const query = status ? { status } : {};
		const listings = await Listing.find(query)
			.populate("seller", "name email")
			.sort({ createdAt: -1 });

		return NextResponse.json(listings);
	} catch (error) {
		console.error("Admin all listings fetch error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch listings" },
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {
		const { listingId, action, adminId } = await request.json();

		await connectDB();

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (action === "delete") {
			await Listing.findByIdAndDelete(listingId);
		} else if (action === "deactivate") {
			await Listing.findByIdAndUpdate(listingId, { status: "inactive" });
		} else if (action === "activate") {
			await Listing.findByIdAndUpdate(listingId, { status: "active" });
		} else if (action === "sold") {
			await Listing.findByIdAndUpdate(listingId, { status: "sold" });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Admin listing action error:", error);
		return NextResponse.json(
			{ error: "Failed to perform action" },
			{ status: 500 }
		);
	}
}
