import { Link } from "react-router-dom";
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

const categoryOptions = ["Dairy", "Meat", "Fruits", "Veggies", "Other"];

const getDaysLeft = (expiry) => {
  const today = new Date();
  const exp = new Date(expiry);
  return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
};

export default function Items() {
  const API = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    quantity: "",
    unit: "",
    expiry: "",
    category: "Other",
    threshold: "",
  });

  useEffect(() => {
    fetchItems();
    fetchLowStock();
  }, []);

  const fetchItems = () => {
    const params = searchTerm ? { search: searchTerm } : {};
    axios
      .get(`${API}/items`, { params })
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Failed to fetch items"));
  };

  const fetchLowStock = () => {
    axios
      .get(`${API}/alerts/low-stock`)
      .then((res) => setLowStockItems(res.data))
      .catch(() => toast.warn("Couldn't fetch low stock alerts"));
  };

  const handleEdit = (item) => {
    setForm({
      id: item.$id || "",
      name: item.name || "",
      quantity: item.quantity?.toString() || "",
      unit: item.unit || "",
      expiry: item.expiry_date || item.expiry || "",
      category: item.category || "Other",
      threshold: item.threshold?.toString() || "",
    });
  };

  const handleSubmit = () => {
    if (
      !form.name.trim() ||
      !form.quantity.trim() ||
      !form.unit.trim() ||
      !form.expiry ||
      !form.threshold.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      name: form.name.trim(),
      quantity: parseFloat(form.quantity),
      unit: form.unit.trim(),
      expiry_date: form.expiry,
      category: form.category,
      threshold: parseFloat(form.threshold),
      deleted: false,
    };

    const action = form.id
      ? axios.put(`${API}/items/${form.id}`, payload)
      : axios.post(`${API}/items`, payload);

    action
      .then(() => {
        fetchItems();
        fetchLowStock();
        toast.success(form.id ? "Item updated ✏️" : "Item added ✅");
        resetForm();
      })
      .catch(() => toast.error("Failed to save item"));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API}/items/${id}`)
      .then(() => {
        fetchItems();
        fetchLowStock();
        toast.warn("Item moved to Trash 🗑");
        if (form.id === id) resetForm();
      })
      .catch(() => toast.error("Failed to delete item"));
  };

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      quantity: "",
      unit: "",
      expiry: "",
      category: "Other",
      threshold: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 p-6">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="max-w-5xl mx-auto bg-white/90 shadow-2xl rounded-3xl p-10 border border-purple-200">
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg mb-8 shadow-md">
            <h2 className="font-bold mb-3 text-lg">⚠️ Low Stock Alerts</h2>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              {lowStockItems.map((item) => (
                <li key={item.$id}>
                  <span className="font-semibold">{item.name}</span> – only{" "}
                  {item.quantity} {item.unit} left
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-8 flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchItems()}
          />
          <button
            onClick={() => fetchItems()}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
          >
            Search
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          <input
            className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            placeholder="Item Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            type="number"
            min="0"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            placeholder="Unit (e.g., kg)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
          <input
            className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            type="date"
            value={form.expiry}
            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
          />
          <select
            className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option disabled>Category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            type="number"
            min="0"
            placeholder="Threshold"
            value={form.threshold}
            onChange={(e) => setForm({ ...form, threshold: e.target.value })}
          />
          <button
            onClick={handleSubmit}
            className="col-span-2 w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition"
          >
            {form.id ? "Update Item" : "Add Item"}
          </button>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 select-none">
          📦 Stored Items
        </h2>
        {items.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No items found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((item) => {
              const badge =
                categoryColors[item.category] || categoryColors.Other;
              const daysLeft = getDaysLeft(item.expiry_date || item.expiry);
              const freshness =
                daysLeft < 0
                  ? "text-red-600"
                  : daysLeft <= 3
                  ? "text-yellow-500"
                  : "text-green-600";

              return (
                <div
                  key={item.$id}
                  className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition cursor-default"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${badge}`}
                    >
                      {item.category}
                    </span>
                    <div className="space-x-3 text-xl select-none">
                      <button
                        onClick={() => handleEdit(item)}
                        title="Edit"
                        className="hover:text-purple-600 transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item.$id)}
                        title="Delete"
                        className="hover:text-red-600 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="text-xl font-semibold capitalize">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Qty: {item.quantity} {item.unit}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expiry: {item.expiry_date}{" "}
                    <span className={`font-semibold ${freshness}`}>
                      (
                      {daysLeft < 0
                        ? "Expired"
                        : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
                      )
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12 space-x-6">
          <Link
            to="/trash"
            className="inline-block px-8 py-3 bg-orange-600  text-white font-semibold rounded-full shadow hover:bg-orange-800 transition"
          >
            🗑 View Trash
          </Link>
          <Link
            to="/recipes"
            className="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-800 transition"
          >
            🍳 Recipe Suggestions
          </Link>
        </div>
      </div>
    </div>
  );
}
