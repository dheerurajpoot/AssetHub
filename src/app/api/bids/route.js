import { connectDB } from "@/lib/mongodb"
import Bid from "@/models/Bid"
import Listing from "@/models/Listing"

export async function POST(request) {
  try {
    await connectDB()

    const { listingId, bidderId, amount, message } = await request.json()

    // Create bid
    const bid = await Bid.create({
      listing: listingId,
      bidder: bidderId,
      amount,
      message,
    })

    // Add bid to listing
    await Listing.findByIdAndUpdate(listingId, {
      $push: { bids: bid._id },
    })

    return Response.json(bid)
  } catch (error) {
    console.error("Bid creation error:", error)
    return Response.json({ success: false, message: "Failed to place bid" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get("listingId")

    const bids = await Bid.find({ listing: listingId }).populate("bidder", "name avatar rating").sort({ createdAt: -1 })

    return Response.json(bids)
  } catch (error) {
    console.error("Fetch bids error:", error)
    return Response.json({ success: false, message: "Failed to fetch bids" }, { status: 500 })
  }
}
