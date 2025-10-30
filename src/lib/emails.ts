import nodemailer from "nodemailer";

const companyEmail = process.env.COMPANY_EMAIL;
const companyName = process.env.COMPANY_NAME;
const companyDomain = process.env.COMPANY_DOMAIN;

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || "smtp.gmail.com",
	port: Number.parseInt(process.env.SMTP_PORT || "587"),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendEmail({
	to,
	subject,
	html,
}: {
	to: string;
	subject: string;
	html: string;
}) {
	try {
		await transporter.sendMail({
			from: `"AssetHub" <${process.env.SMTP_FROM}>`,
			to,
			subject,
			html,
		});
		return { success: true };
	} catch (error) {
		console.error("Email sending error:", error);
		return { success: false, error };
	}
}

export function generateOTPEmail(otp: string): string {
	return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - AssetHub</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px; letter-spacing:2px;">AssetHub</h1>
        <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 18px;">Verify your email address</p>
      </div>
      <div style="background: #f7fafc; padding: 28px; border-radius: 0 0 12px 12px;">
        <h2 style="color: #2563eb; margin-top: 0;">Welcome to AssetHub!</h2>
        <p style="margin: 0 0 18px 0;">Thank you for signing up on AssetHub. To complete your registration, please enter the code below on the verification page:</p>
        <div style="background: white; border: 2px solid #06b6d4; border-radius: 8px; padding: 20px; text-align: center; margin: 22px 0;">
          <h3 style="margin: 0; color: #2563eb; font-size: 34px; letter-spacing: 8px;">${otp}</h3>
        </div>
        <p style="margin-bottom:0;">This code expires in 10 minutes for your security.</p>
        <p style="font-size: 14px; color: #64748b; margin-top:2.2em;">If you didn't request this verification, please ignore this message.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;">
        <p style="font-size: 15px; color: #64748b;">
          Regards,<br>
          The AssetHub Team
        </p>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetEmail(resetLink: string): string {
	return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - AssetHub</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px; letter-spacing:2px;">AssetHub</h1>
        <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 18px;">Password Reset Request</p>
      </div>
      <div style="background: #f7fafc; padding: 28px; border-radius: 0 0 12px 12px;">
        <h2 style="color: #2563eb; margin-top: 0;">Reset Your Password</h2>
        <p style="margin: 0 0 12px 0;">We received a request to reset your password for your AssetHub account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetLink}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="margin-bottom:0;">This link will expire in 1 hour for security reasons.</p>
        <p style="font-size: 14px; color: #64748b; margin-top:2.2em;">If you did not request a password reset, you can ignore this email—your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;">
        <p style="font-size: 15px; color: #64748b;">
          Regards,<br>
          The AssetHub Team
        </p>
      </div>
    </body>
    </html>
  `;
}
