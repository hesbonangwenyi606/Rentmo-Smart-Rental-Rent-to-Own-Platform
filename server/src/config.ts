import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV !== "production",

  jwt: {
    secret: process.env.JWT_SECRET || "rentmo_fallback_secret_change_in_prod",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "rentmo_refresh_fallback_change_in_prod",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY || "",
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || "",
    shortCode: process.env.MPESA_SHORTCODE || "174379",
    passKey:
      process.env.MPESA_PASSKEY ||
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
    callbackUrl:
      process.env.MPESA_CALLBACK_URL ||
      "https://your-domain.com/api/payments/mpesa/callback",
    env: (process.env.MPESA_ENV || "sandbox") as "sandbox" | "production",
    baseUrl:
      process.env.MPESA_ENV === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke",
  },

  sms: {
    apiKey: process.env.AT_API_KEY || "",
    username: process.env.AT_USERNAME || "sandbox",
    senderId: process.env.AT_SENDER_ID || "RENTMO",
  },
};
