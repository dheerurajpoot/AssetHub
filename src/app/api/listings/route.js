import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { sendEmail } from "@/lib/emails";
import {
	generateNewListingNotification,
	generateListingStatusUpdate,
} from "@/lib/emails";

export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category");
		const page = Number.parseInt(searchParams.get("page")) || 1;
		const limit = 12;

		const query = {};
		if (category) query.category = category;

		const userId = searchParams.get("userId");

		let listings;
		if (userId) {
			listings = await Listing.find({ seller: userId })
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit);
		} else {
			const publicQuery = {
				...query,
				status: { $in: ["active", "sold"] },
			};
			listings = await Listing.find(publicQuery)
				.populate("seller", "name avatar rating")
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit);
		}

		const total = await Listing.countDocuments(
			userId
				? { seller: userId }
				: { ...query, status: { $ne: "pending" } }
		);

		return NextResponse.json({
			listings,
			pagination: {
				total,
				pages: Math.ceil(total / limit),
				current: page,
			},
		});
	} catch (error) {
		console.error("Listings fetch error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch listings" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const {
			title,
			description,
			category,
			price,
			metrics,
			details,
			images,
			thumbnail,
			userId,
		} = await request.json();

		if (!userId) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		await connectDB();

		const listing = await Listing.create({
			title,
			description,
			category,
			price,
			metrics,
			details,
			images,
			thumbnail: thumbnail || images?.[0],
			seller: userId,
		});

		// Add listing to user's listings
		const user = await User.findByIdAndUpdate(userId, {
			$push: { listings: listing._id },
		}).select("name");

		// Send email notification to admin
		try {
			// Find admin users
			const admins = await User.find({ role: "admin" }).select("email");

			if (admins.length > 0) {
				const listingLink = `${process.env.NEXT_PUBLIC_APP_URL}/listing/${listing._id}`;
				const emailContent = generateNewListingNotification(
					listing.title,
					user.name,
					listingLink
				);

				// Send email to all admins
				await Promise.all(
					admins.map((admin) =>
						sendEmail({
							to: admin.email,
							subject: `New Listing Requires Review: ${listing.title}`,
							html: emailContent,
						})
					)
				);
			}
		} catch (emailError) {
			console.error(
				"Failed to send new listing notification:",
				emailError
			);
			// Don't fail the request if email sending fails
		}

		return NextResponse.json({ success: true, listing }, { status: 201 });
	} catch (error) {
		console.error("Listing creation error:", error);
		return NextResponse.json(
			{ error: "Failed to create listing" },
			{ status: 500 }
		);
	}
}
