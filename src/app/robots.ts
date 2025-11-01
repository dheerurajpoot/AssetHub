import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/admin/",
					"/dashboard/",
					"/signup",
					"/forgot-password",
					"/reset-password",
					"/verify-otp",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
