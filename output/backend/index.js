import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";
import bidRoutes from "./Routes/bidRoutes.js";
import userPayment from "./Routes/userPaymentsRoutes.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./Admin/Routes/adminRoutes.js";
import aiRoutes from "./Routes/aiRoutes.js";

dotenv.config({ override: true });

const app = express();

// CORS — allow your deployed frontend URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// CSP headers for PayPal
app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' data: blob:; " +
    "script-src 'self' https://www.paypal.com 'unsafe-inline' 'unsafe-eval'; " +
    "connect-src 'self' https://www.paypal.com https://api-m.sandbox.paypal.com https://api-m.paypal.com; " +
    "frame-src https://www.paypal.com https://www.sandbox.paypal.com; " +
    "img-src 'self' data: blob: https:; " +
    "style-src 'self' 'unsafe-inline' https:;"
  );
  next();
});

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/bid", bidRoutes);
app.use("/admin", adminRoutes);
app.use("/userPaymentsForBid", userPayment);
app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel serverless
export default app;
