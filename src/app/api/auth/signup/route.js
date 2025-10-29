import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
	try {
		await connectDB();

		const { name, email, password } = await request.json();

		// Check if user exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return Response.json(
				{ success: false, message: "Email already registered" },
				{ status: 400 }
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		return Response.json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Signup error:", error);
		return Response.json(
			{ success: false, message: "Signup failed" },
			{ status: 500 }
		);
	}
}
