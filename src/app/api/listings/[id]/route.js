import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Listing from "@/models/Listing"
import User from "@/models/User" // Import User model

export async function GET(request, { params }) {
  try {
    await connectDB()

    const listing = await Listing.findByIdAndUpdate(params.id, { $inc: { views: 1 } }, { new: true })
      .populate("seller", "name avatar rating bio")
      .populate("reviews")

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error("Listing fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { userId, ...updateData } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const listing = await Listing.findById(params.id)
    if (!listing || listing.seller.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updated = await Listing.findByIdAndUpdate(params.id, updateData, { new: true })

    return NextResponse.json({ success: true, listing: updated })
  } catch (error) {
    console.error("Listing update error:", error)
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const listing = await Listing.findById(params.id)
    if (!listing || listing.seller.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await Listing.findByIdAndDelete(params.id)
    await User.findByIdAndUpdate(userId, { $pull: { listings: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Listing deletion error:", error)
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
  }
}
