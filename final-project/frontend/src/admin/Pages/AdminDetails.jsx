// src/admin/Pages/AdminDetails.jsx
import { useParams, Link } from "react-router-dom";

const dummyAdmins = {
  1: { name: "Ravi Sharma", role: "Manager", email: "ravi@example.com" },
  2: { name: "Priya Patel", role: "Staff", email: "priya@example.com" },
  3: { name: "Amit Verma", role: "Admin", email: "amit@example.com" },
};

export default function AdminDetails() {
  const { id } = useParams();
  const admin = dummyAdmins[id];

  if (!admin) return <p>Admin not found</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Details</h2>
      <div className="space-y-4">
        <p><span className="font-semibold">Name:</span> {admin.name}</p>
        <p><span className="font-semibold">Role:</span> {admin.role}</p>
        <p><span className="font-semibold">Email:</span> {admin.email}</p>
      </div>
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
          Edit
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          Delete
        </button>
        <Link
          to="/admin-management"
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
