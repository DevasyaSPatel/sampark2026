import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s+/g, ''), // Remove spaces if present
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("Email Transporter Verification Error:", error);
    } else {
        console.log("Email Server is ready to take our messages");
    }
});

export async function sendWelcomeEmail(to: string, name: string, user_id: string, pass: string) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials missing in process.env:");
        console.warn("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Missing");
        console.warn("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Missing");
        return;
    }

    const mailOptions = {
        from: `"Sampark Team" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Welcome to Sampark 2026 - Your Login Credentials',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2563eb; text-align: center;">Welcome to Sampark 2026!</h2>
                <p>Hi ${name},</p>
                <p>Thank you for registering. Here are your login credentials:</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <p><strong>Email ID:</strong> ${user_id}</p>
                    <p><strong>Password:</strong> ${pass}</p>
                </div>
                <p>You can login at <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login">Sampark Login</a>.</p>
                <p>Start connecting with others and explore the themes!</p>
                <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">This is an automated message. Please do not reply.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}
