import User from "../Models/User.js";
import City from "../Models/City.js";
import State from "../Models/State.js";
import Country from "../Models/Country.js";
import Subregion from "../Models/Subregion.js";
import Region from "../Models/Region.js";
import { sendEmail } from "../../Config/sendEmail.js";

// ✅ Proper include chain matching the relationships
const locationInclude = [
  {
    model: City,
    as: "city",
    attributes: ["name"],
    include: [
      {
        model: State,
        as: "state",
        attributes: ["name"],
        include: [
          {
            model: Country,
            as: "country",
            attributes: ["name"],
            include: [
              {
                model: Subregion,
                as: "subregion",
                attributes: ["name"],
                include: [
                  {
                    model: Region,
                    as: "region",
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// ✅ Common formatter
const formatUsers = (users) =>
  users.map((u) => {
    const user = u.toJSON();
    if (user.document_type && !user.document_type.startsWith("http")) {
      user.document_type = `http://localhost:5000/photos/${user.document_type}`;
    }
    return user;
  });

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "surname", "number", "email", "document_type", "status"],
      include: locationInclude,
    });
    res.status(200).json(formatUsers(users));
  } catch (error) {
    console.error("❌ Error fetching all users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get requested users
export const getRequestedUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { status: "Requested" },
      attributes: ["id", "name", "surname", "number", "email", "document_type", "status"],
      include: locationInclude,
    });
    res.status(200).json(formatUsers(users));
  } catch (error) {
    console.error("❌ Error fetching requested users:", error);
    res.status(500).json({ message: "Error fetching requested users" });
  }
};

// ✅ Get approved users
export const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { status: "Approved" },
      attributes: ["id", "name", "surname", "number", "email", "document_type", "status"],
      include: locationInclude,
    });
    res.status(200).json(formatUsers(users));
  } catch (error) {
    console.error("❌ Error fetching approved users:", error);
    res.status(500).json({ message: "Error fetching approved users" });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: locationInclude });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(formatUsers([user])[0]);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// ✅ Update status
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();

    // ------------------------------
    // 📧 SEND EMAIL ON APPROVAL
    // ------------------------------
    if (status === "Approved") {
      const subject = "🎉 Your E-Auction Account is Approved!";
      const html = `
        <h2>Hello ${user.name},</h2>
        <p style="font-size:16px;">
          Congratulations! Your account has been <b style="color:green">Approved</b>.
        </p>
        
        <p>You can now login and start participating in auctions.</p>

        <br>
        <p>Regards,<br><b>E-Auction Team</b></p>
      `;

      await sendEmail(user.email, subject, html);
    }

    // ------------------------------
    // 📧 EMAIL IF REJECTED
    // ------------------------------
    if (status === "Rejected") {
      const subject = "❌ E-Auction Account Rejected";
      const html = `
        <h2>Hello ${user.name},</h2>
        <p style="font-size:16px;">
          We are sorry to inform you that your account request is 
          <b style="color:red">Rejected</b>.
        </p>

        <p>If this is a mistake, please contact support.</p>

        <br>
        <p>Regards,<br><b>E-Auction Team</b></p>
      `;

      await sendEmail(user.email, subject, html);
    }

    res.status(200).json({
      message: `User ${user.name} ${user.surname} ${status} successfully.`,
    });

  } catch (error) {
    console.error("❌ Error updating user status:", error);
    res.status(500).json({ message: "Error updating user status" });
  }
};

// ✅ Block user (new feature)
export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "Block";
    await user.save();

    res.status(200).json({ message: `🚫 User ${user.name} ${user.surname} blocked successfully.` });
  } catch (error) {
    console.error("❌ Error blocking user:", error);
    res.status(500).json({ message: "Error blocking user" });
  }
};


