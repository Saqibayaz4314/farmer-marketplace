// utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 📧 Create SMTP Transporter
const smtpPort = parseInt(process.env.SMTP_PORT) || 465;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465, // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 📤 Send Email Utility
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || "FarmLink"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email sending failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// 🔍 Verify SMTP Connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP Email server is ready");
    return true;
  } catch (error) {
    console.error("❌ SMTP Email server connection failed:", error.message);
    return false;
  }
};

export default transporter;
