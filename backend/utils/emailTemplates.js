// utils/emailTemplates.js

// 🎨 Common email styles matching the FarmLink green theme
const baseStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f0fdf4;
      color: #1a1a1a;
    }
  </style>
`;

const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${baseStyles}
</head>
<body style="margin: 0; padding: 0; background-color: #f0fdf4; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%); border-radius: 24px 24px 0 0; padding: 40px 40px 30px 40px; text-align: center;">
              <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 16px; padding: 12px 16px; margin-bottom: 16px;">
                <span style="font-size: 32px;">🌾</span>
              </div>
              <h1 style="color: white; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">
                Farm<span style="color: #bbf7d0;">Link</span>
              </h1>
              <p style="color: #bbf7d0; font-size: 13px; margin-top: 6px; font-weight: 500;">
                Farm to Table • Fresh & Direct
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; border-radius: 0 0 24px 24px; padding: 30px 40px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} FarmLink. All rights reserved.
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin-top: 8px;">
                Connecting farmers directly with buyers 🌱
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ✅ Welcome Email Template
export const getWelcomeEmailTemplate = (name, role) => {
  const isFarmer = role === "farmer";
  const roleEmoji = isFarmer ? "🌾" : "🛒";
  const roleTitle = isFarmer ? "Farmer" : "Buyer";
  const roleColor = isFarmer ? "#f59e0b" : "#3b82f6";
  const roleBg = isFarmer ? "#fef3c7" : "#dbeafe";

  const features = isFarmer
    ? [
      { icon: "🚜", title: "Add Products", desc: "List your fresh produce with images and prices" },
      { icon: "📊", title: "Dashboard", desc: "Track your sales and manage listings" },
      { icon: "💬", title: "Chat with Buyers", desc: "Negotiate and build relationships" },
    ]
    : [
      { icon: "🥬", title: "Browse Products", desc: "Discover fresh produce from local farmers" },
      { icon: "💬", title: "Chat with Farmers", desc: "Ask questions and negotiate prices" },
      { icon: "✅", title: "Easy Checkout", desc: "Multiple payment options available" },
    ];

  const featuresHtml = features
    .map(
      (f) => `
      <tr>
        <td style="padding: 12px 0;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="48" style="vertical-align: top;">
                <div style="width: 44px; height: 44px; background: #f0fdf4; border-radius: 12px; text-align: center; line-height: 44px; font-size: 20px;">
                  ${f.icon}
                </div>
              </td>
              <td style="padding-left: 14px; vertical-align: top;">
                <p style="font-weight: 700; color: #1f2937; font-size: 14px; margin: 0;">${f.title}</p>
                <p style="color: #6b7280; font-size: 13px; margin-top: 2px;">${f.desc}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    )
    .join("");

  const content = `
    <!-- Welcome Badge -->
    <div style="text-align: center; margin-bottom: 28px;">
      <span style="display: inline-block; background: ${roleBg}; color: ${roleColor}; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px;">
        ${roleEmoji} ${roleTitle} Account
      </span>
    </div>

    <!-- Greeting -->
    <h2 style="font-size: 24px; font-weight: 800; color: #111827; text-align: center; margin-bottom: 8px;">
      Welcome aboard, ${name}! 🎉
    </h2>
    <p style="text-align: center; color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
      Your ${roleTitle.toLowerCase()} account has been created successfully. 
      ${isFarmer ? "Start listing your fresh produce and reach thousands of buyers!" : "Discover the freshest farm products directly from farmers!"}
    </p>

    <!-- Divider -->
    <div style="height: 1px; background: linear-gradient(to right, transparent, #d1d5db, transparent); margin-bottom: 28px;"></div>

    <!-- What you can do -->
    <h3 style="font-size: 16px; font-weight: 700; color: #374151; margin-bottom: 16px;">
      Here's what you can do:
    </h3>
    <table cellpadding="0" cellspacing="0" width="100%">
      ${featuresHtml}
    </table>

    <!-- CTA Button -->
    <div style="text-align: center; margin-top: 32px;">
      <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/${isFarmer ? "dashboard" : "marketplace"}" 
         style="display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: white; text-decoration: none; padding: 14px 36px; border-radius: 14px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3);">
        ${isFarmer ? "🚀 Go to Dashboard" : "🛒 Explore Marketplace"}
      </a>
    </div>

    <!-- Help Note -->
    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
      Need help? Just reply to this email and we'll assist you.
    </p>
  `;

  return emailWrapper(content);
};

// 🔑 Forgot Password Email Template
export const getForgotPasswordTemplate = (name, resetUrl) => {
  const content = `
    <!-- Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 16px; line-height: 64px; font-size: 28px;">
        🔐
      </div>
    </div>

    <!-- Title -->
    <h2 style="font-size: 24px; font-weight: 800; color: #111827; text-align: center; margin-bottom: 8px;">
      Password Reset Request
    </h2>
    <p style="text-align: center; color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
      Hi <strong>${name}</strong>, we received a request to reset your FarmLink password. 
      Click the button below to create a new password.
    </p>

    <!-- CTA Button -->
    <div style="text-align: center; margin-bottom: 28px;">
      <a href="${resetUrl}" 
         style="display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: white; text-decoration: none; padding: 16px 40px; border-radius: 14px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3);">
        🔑 Reset My Password
      </a>
    </div>

    <!-- Divider -->
    <div style="height: 1px; background: linear-gradient(to right, transparent, #d1d5db, transparent); margin: 28px 0;"></div>

    <!-- Link fallback -->
    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-bottom: 8px;">
      Or copy and paste this link into your browser:
    </p>
    <p style="background: #f3f4f6; border-radius: 10px; padding: 12px 16px; word-break: break-all; font-size: 12px; color: #6b7280; text-align: center;">
      ${resetUrl}
    </p>

    <!-- Warning -->
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-top: 24px;">
      <p style="color: #92400e; font-size: 13px; margin: 0;">
        ⚠️ <strong>This link expires in 15 minutes.</strong> If you didn't request a password reset, please ignore this email. Your account is safe.
      </p>
    </div>
  `;

  return emailWrapper(content);
};
