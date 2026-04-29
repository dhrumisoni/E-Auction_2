import bcrypt from "bcryptjs";
import AdminUser from "../Models/AdminUser.js";

// ✅ Add New Admin
export const addAdmin = async (req, res) => {
  try {
    const { name, surname, email, password, role } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingAdmin = await AdminUser.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await AdminUser.create({
      name,
      surname,
      email,
      password: hashedPassword,
      role: role || "Admin",
    });

    return res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.error("Error adding admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminUser.findAll({
      attributes: ["id", "name", "surname", "email", "role"],
    });
    res.status(200).json(admins);
  } catch (error) {
    console.error("❌ Error fetching admins:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Admin Profile by ID
export const getAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await AdminUser.findByPk(id, {
      attributes: ["id", "name", "surname", "email", "role"],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update Admin Profile (only email and password)
export const updateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const admin = await AdminUser.findByPk(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (email) admin.email = email;
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    res.status(200).json({
      message: "Profile updated successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        surname: admin.surname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Update Admin Details (for Admin Management - can edit name, surname, email, role)
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, email, role } = req.body;

    const admin = await AdminUser.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update only if fields provided
    if (name) admin.name = name;
    if (surname) admin.surname = surname;
    if (email) admin.email = email;
    if (role) admin.role = role;

    await admin.save();

    res.status(200).json({
      message: "Admin details updated successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        surname: admin.surname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Single Admin by ID (for edit form)
export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await AdminUser.findByPk(id, {
      attributes: ["id", "name", "surname", "email", "role"],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await AdminUser.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await admin.destroy();

    return res.status(200).json({ message: "Admin deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
