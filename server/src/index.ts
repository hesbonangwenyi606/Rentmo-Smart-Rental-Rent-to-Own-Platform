import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Routes
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/properties";
import paymentRoutes from "./routes/payments";
import loanRoutes from "./routes/loans";
import insuranceRoutes from "./routes/insurance";
import creditScoreRoutes from "./routes/creditScore";
import userRoutes from "./routes/users";
import adminRoutes from "./routes/admin";
import notificationRoutes from "./routes/notifications";
import uploadRoutes from "./routes/upload";

const app = express();

// ─── Static uploads ───────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// M-Pesa callback needs raw body for Safaricom signature (in production)
app.use("/api/payments/mpesa/callback", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (config.isDev) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts, please try again in 15 minutes." },
});

app.use("/api", limiter);
app.use("/api/auth", authLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Rentmo API",
    version: "1.0.0",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/credit-score", creditScoreRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 Rentmo API running at http://localhost:${config.port}`);
  console.log(`   Environment : ${config.nodeEnv}`);
  console.log(`   Health check: http://localhost:${config.port}/health`);
  console.log(`   CORS allowed: ${config.frontendUrl}\n`);
});

export default app;
