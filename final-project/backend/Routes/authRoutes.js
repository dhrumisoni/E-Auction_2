import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import upload from "../Middleware/multer.js";
import db from "../Config/db.js";
import getCitiesWithHierarchy from "../Models/Address.js";
import BidLogs from "../Models/BidsLogs.js";
import Winner from "../Admin/Models/Winner.js";
import Bid from "../Models/Bid.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Nodemailer Config
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET USER STATISTICS
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const totalBids = await BidLogs.count({ where: { user_id: userId } });
    const totalWins = await Winner.count({ where: { user_id: userId } });
    const recentBids = await BidLogs.findAll({
      where: { user_id: userId },
      order: [["id", "DESC"]],
      limit: 3,
      include: [{ model: Bid, as: "bid", attributes: ["title"] }]
    });
    const recentWins = await Winner.findAll({
      where: { user_id: userId },
      limit: 2,
      include: [{ model: Bid, as: "bid", attributes: ["title"] }]
    });

    const activities = [
      ...recentBids.map(b => ({
        title: "Bid Placed",
        detail: `Placed $${b.price} on '${b.bid?.title || 'Unknown Item'}'`,
        type: 'bid'
      })),
      ...recentWins.map(w => ({
        title: "Auction Won",
        detail: `Successfully won '${w.bid?.title || 'Unknown Item'}'`,
        type: 'win'
      }))
    ];

    res.json({
      success: true,
      stats: {
        totalBids,
        totalWins,
        winRate: totalBids > 0 ? Math.round((totalWins / totalBids) * 100) : 0,
        reputation: 9.5
      },
      activities
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ success: false, message: "Failed to load stats." });
  }
});

// REGISTER USER
router.post("/register", upload.single("document_type"), async (req, res) => {
  try {
    const { name, surname, number, email, password, city_id } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      surname,
      number,
      status: "Requested",
      email,
      password: hashedPassword,
      city_id: parseInt(city_id, 10),
      document_type: req.file?.filename || "",
    });

    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// FORGOT PASSWORD — generates a 6-digit OTP and emails it
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "No account found with this email." });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.update(
      { reset_otp: hashedOtp, otp_expires: expires },
      { where: { email } }
    );

    const mailOptions = {
      from: `"Neural eAuction Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP - Neural eAuction Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #056973; text-align: center;">Security Verification Code</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #056973; background: #f0fdfa; padding: 16px 32px; border-radius: 12px; display: inline-block;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #64748b; text-align: center;">If you did not request this, please ignore this email. Your account is safe.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent to your email. Valid for 10 minutes." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP email." });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !user.reset_otp) {
      return res.status(400).json({ success: false, message: "No OTP requested for this email." });
    }

    if (new Date() > new Date(user.otp_expires)) {
      await User.update({ reset_otp: null, otp_expires: null }, { where: { email } });
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.reset_otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect OTP. Please try again." });
    }

    res.json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ success: false, message: "OTP verification failed." });
  }
});

// RESET PASSWORD — only allowed after OTP was verified
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !user.reset_otp) {
      return res.status(400).json({ success: false, message: "Session expired. Please restart the recovery process." });
    }

    if (new Date() > new Date(user.otp_expires)) {
      await User.update({ reset_otp: null, otp_expires: null }, { where: { email } });
      return res.status(400).json({ success: false, message: "OTP has expired. Please start over." });
    }

    const isMatch = await bcrypt.compare(otp, user.reset_otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP. Password not changed." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword, reset_otp: null, otp_expires: null },
      { where: { email } }
    );
    res.json({ success: true, message: "Password reset successful. You can now login!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password." });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Sorry, server error" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// GET PROFILE
router.get("/profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const citiesWithHierarchy = await getCitiesWithHierarchy(user.city_id);
    const userProfile = {
      ...user.dataValues,
      city_id: citiesWithHierarchy || {},
    };
    res.json({ success: true, user: userProfile });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ success: false, message: "Failed to load profile." });
  }
});

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// CONTACT
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: "All fields required." });

    await db.query(`CREATE TABLE IF NOT EXISTS contact_messages (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, message TEXT NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'unread', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await db.query(`INSERT INTO contact_messages (name, email, message, status) VALUES (?, ?, ?, 'unread')`, { replacements: [name, email, message] });
    res.json({ success: true, message: "Your message has been sent to admin inbox." });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

// CITIES
router.get("/cities", async (req, res) => {
  try {
    const cities = await getCitiesWithHierarchy();
    res.json(cities);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE PROFILE
router.put("/profile/:email", upload.single("document_type"), async (req, res) => {
  try {
    const { email } = req.params;
    const { name, surname, number, city_id } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const updateData = {};
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (number) updateData.number = number;
    if (city_id) updateData.city_id = parseInt(city_id, 10);
    if (req.file) updateData.document_type = req.file.filename;
    if (user.status === "Rejected") updateData.status = "Requested";

    await User.update(updateData, { where: { email } });
    const updatedUser = await User.findOne({ where: { email }, attributes: { exclude: ["password"] } });
    const citiesWithHierarchy = await getCitiesWithHierarchy(updatedUser.city_id);
    const userProfile = { ...updatedUser.dataValues, city_id: citiesWithHierarchy || {} };
    res.json({ success: true, user: userProfile, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile." });
  }
});

export default router;
