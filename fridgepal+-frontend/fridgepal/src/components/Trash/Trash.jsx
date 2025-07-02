import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categoryColors = {
  Dairy: "bg-blue-100 text-blue-700",
  Meat: "bg-red-100 text-red-700",
  Fruits: "bg-pink-100 text-pink-700",
  Veggies: "bg-green-100 text-green-700",
  Other: "bg-gray-100 text-gray-700",
};

export default function Trash() {
  const API = import.meta.env.VITE_API_URL;
  const [trashItems, setTrashItems] = useState([]);

  useEffect(() => {
    fetchTrashItems();
  }, []);

  const fetchTrashItems = () => {
    axios
      .get(`${API}/trash`)
      .then((res) => {
        setTrashItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        toast.error("Failed to fetch trash items");
        console.error(err);
      });
  };

  const handleRestore = (item) => {
    const updatedItem = { ...item, deleted: false };
    axios
      .put(`${API}/items/${item.$id}`, updatedItem)
      .then(() => {
        toast.success("Item restored ✅");
        fetchTrashItems();
      })
      .catch(() => toast.error("Failed to restore item"));
  };

  const handlePermanentDelete = (id) => {
    axios
      .delete(`${API}/permanent-delete/${id}`)
      .then(() => {
        toast.warn("Item permanently deleted 🗑️");
        fetchTrashItems();
      })
      .catch(() => toast.error("Failed to permanently delete item"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 py-12 px-6">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="max-w-4xl mx-auto bg-white/90 shadow-2xl rounded-3xl p-8 border border-pink-200">
        <h1 className="text-center text-4xl md:text-5xl font-extrabold text-gray-800 mb-16 relative">
          Discarded{" "}
          <span className="text-yellow-500 font-mono relative inline-block">
            Items
            <span className="block h-1 w-full bg-yellow-500 absolute -bottom-1 left-0 rounded"></span>
          </span>
        </h1>
        <p className="text-gray-600 text-lg text-center mb-10 max-w-xl mx-auto">
          These are items you've discarded. Maybe they expired or went bad.
        </p>

        {trashItems.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {trashItems.map((item) => (
              <div
                key={item.$id}
                className="bg-white rounded-2xl border border-gray-200 shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full select-none ${
                      categoryColors[item.category] || categoryColors.Other
                    }`}
                  >
                    {item.category}
                  </span>
                  <div className="space-x-4 text-xl select-none">
                    <button
                      onClick={() => handleRestore(item)}
                      className="text-green-600 hover:text-green-800 transition"
                      title="Restore"
                    >
                      ♻️
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(item.$id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete Permanently"
                    >
                      ❌
                    </button>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Qty: {item.quantity} {item.unit}
                </p>
                <p className="text-sm text-gray-500">
                  Expired on: {item.expiry_date || item.expiry}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 italic mt-10 select-none">
            No discarded items yet 🧼
          </div>
        )}
      </div>
    </div>
  );
}
