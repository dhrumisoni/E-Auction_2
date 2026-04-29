import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminUser from "../Models/AdminUser.js";

const JWT_SECRET = "auctionSecret"; // move to .env in production

// ✅ Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ where: { email } });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(401).json({ message: "Invalid password" });

    // ✅ Create token with role
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin.id, name: admin.name, role: admin.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
