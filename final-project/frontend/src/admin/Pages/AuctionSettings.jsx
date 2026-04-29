// src/admin/Pages/AuctionSettings.jsx
import { useState, useEffect } from "react";
import { Save, Settings, RefreshCcw } from "lucide-react";

export default function AuctionSettings() {
  const [settings, setSettings] = useState({
    autoBidMinLimit: 500,
    minBidIncrement: 100,
    minAuctionDays: 1,
    maxAuctionDays: 15,
    reservePriceAllowed: true,
    autoBidNotification: true,
    defaultStartDelay: 2,
    managerEditable: false,
  });
  const [saving, setSaving] = useState(false);

  // Fetch current settings (later: replace with fetch("/api/admin/auction-settings"))
  useEffect(() => {
    const load = setTimeout(() => {
      // mock load
      console.log("Settings loaded");
    }, 300);
    return () => clearTimeout(load);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSave = () => {
    setSaving(true);
    // Replace with: fetch("/api/admin/auction-settings", { method: "PUT", body: JSON.stringify(settings) })
    setTimeout(() => {
      setSaving(false);
      alert("✅ Auction settings updated successfully!");
    }, 1000);
  };

  const handleReset = () => {
    if (confirm("Reset settings to default values?")) {
      setSettings({
        autoBidMinLimit: 500,
        minBidIncrement: 100,
        minAuctionDays: 1,
        maxAuctionDays: 15,
        reservePriceAllowed: true,
        autoBidNotification: true,
        defaultStartDelay: 2,
        managerEditable: false,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={26} className="text-[#0b3d91]" />
        <h1 className="text-3xl font-bold text-[#0b3d91]">Auction Settings</h1>
      </div>
      <p className="text-gray-600 mb-8">
        Configure auction rules that apply system-wide. Once saved, these will affect all auctions and bidding modules.
      </p>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        {/* Auto-bid Limit */}
        <div>
          <label className="font-semibold text-gray-700">Auto-bid Minimum Limit (₹)</label>
          <input
            type="number"
            name="autoBidMinLimit"
            value={settings.autoBidMinLimit}
            onChange={handleChange}
            className="block w-60 mt-1 p-2 border rounded-lg"
          />
        </div>

        {/* Minimum Increment */}
        <div>
          <label className="font-semibold text-gray-700">Minimum Bid Increment (₹)</label>
          <input
            type="number"
            name="minBidIncrement"
            value={settings.minBidIncrement}
            onChange={handleChange}
            className="block w-60 mt-1 p-2 border rounded-lg"
          />
        </div>

        {/* Auction Duration */}
        <div className="flex gap-4">
          <div>
            <label className="font-semibold text-gray-700">Min Auction Days</label>
            <input
              type="number"
              name="minAuctionDays"
              value={settings.minAuctionDays}
              onChange={handleChange}
              className="block w-40 mt-1 p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Max Auction Days</label>
            <input
              type="number"
              name="maxAuctionDays"
              value={settings.maxAuctionDays}
              onChange={handleChange}
              className="block w-40 mt-1 p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 mt-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="reservePriceAllowed"
              checked={settings.reservePriceAllowed}
              onChange={handleChange}
            />
            Allow Reserve Price
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="autoBidNotification"
              checked={settings.autoBidNotification}
              onChange={handleChange}
            />
            Enable Auto-bid Notifications
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="managerEditable"
              checked={settings.managerEditable}
              onChange={handleChange}
            />
            Allow Manager to Edit Settings
          </label>
        </div>

        {/* Default Delay */}
        <div className="mt-4">
          <label className="font-semibold text-gray-700">Default Auction Start Delay (hours)</label>
          <input
            type="number"
            name="defaultStartDelay"
            value={settings.defaultStartDelay}
            onChange={handleChange}
            className="block w-60 mt-1 p-2 border rounded-lg"
          />
        </div>

        {/* Save & Reset */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#0b3d91] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save Settings"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <RefreshCcw size={18} /> Reset Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
