import jwt from "jsonwebtoken";
const JWT_SECRET = "auctionSecret";

// ✅ Verify Token + Role
export const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

// ✅ Allow only Admins and Managers
export const adminAuth = (req, res, next) => {
  if (req.admin.role !== "admin" && req.admin.role !== "manager") {
    return res.status(403).json({ message: "Access denied: Not authorized" });
  }
  next();
};
