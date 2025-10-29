import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
		},
		avatar: String,
		bio: String,
		whatsapp: String,
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		verified: {
			type: Boolean,
			default: false,
		},
		totalListings: {
			type: Number,
			default: 0,
		},
		totalSales: {
			type: Number,
			default: 0,
		},
		totalEarnings: {
			type: Number,
			default: 0,
		},
		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		reviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		listings: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Listing",
			},
		],
		purchases: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Transaction",
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
