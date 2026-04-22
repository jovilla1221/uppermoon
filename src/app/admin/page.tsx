"use client";

import { useState, useEffect, useRef } from "react";

interface Product {
  _id?: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  collection?: string;
  description?: string;
  image?: string;
  variants?: { size: string; stock: number }[];
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "settings" | "orders" | "users">("products");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // New product form
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    category: "TOPS",
    collection: "",
    description: "",
    variants: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
  });
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Settings tab state
  const [settings, setSettings] = useState({
    logoUrl: "", logoRef: "",
    hero1Url: "", hero1Ref: "",
    hero2Url: "", hero2Ref: "",
    hero3Url: "", hero3Ref: "",
    community1Url: "", community1Ref: "",
    community2Url: "", community2Ref: "",
    community3Url: "", community3Ref: ""
  });
  const logoRef = useRef<HTMLInputElement>(null);
  const hero1Ref = useRef<HTMLInputElement>(null);
  const hero2Ref = useRef<HTMLInputElement>(null);
  const hero3Ref = useRef<HTMLInputElement>(null);
  const community1Ref = useRef<HTMLInputElement>(null);
  const community2Ref = useRef<HTMLInputElement>(null);
  const community3Ref = useRef<HTMLInputElement>(null);

  // Auto login check
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) setIsLoggedIn(true);
  }, []);

  // Load products
  useEffect(() => {
    if (isLoggedIn) fetchProducts();
  }, [isLoggedIn]);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchSettings = async () => {
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    if (data && !data.error) {
      setSettings({
        logoUrl: data.logoUrl || "", logoRef: data.logoRef || "",
        hero1Url: data.hero1Url || "", hero1Ref: data.hero1Ref || "",
        hero2Url: data.hero2Url || "", hero2Ref: data.hero2Ref || "",
        hero3Url: data.hero3Url || "", hero3Ref: data.hero3Ref || "",
        community1Url: data.community1Url || "", community1Ref: data.community1Ref || "",
        community2Url: data.community2Url || "", community2Ref: data.community2Ref || "",
        community3Url: data.community3Url || "", community3Ref: data.community3Ref || ""
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === "settings") fetchSettings();
      if (activeTab === "orders") fetchOrders();
      if (activeTab === "users") fetchUsers();
    }
  }, [isLoggedIn, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem("admin_token", data.token);
      setIsLoggedIn(true);
    } else {
      setLoginError("Username atau password salah");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setIsLoggedIn(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions for optimization
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.8 // 80% quality
          );
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEdit = (product: any) => {
    setIsEditing(true);
    setEditingId(product._id);
    setForm({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      category: product.category,
      collection: product.collection || "",
      description: product.description || "",
      variants: product.variants?.length ? product.variants : [
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 },
      ],
    });
    setExistingImages(product.rawImages || []);
    setImageFiles([]); // Clear new uploads state
    setImagePreviews([]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({ 
      name: "", slug: "", price: "", category: "TOPS", collection: "", description: "", 
      variants: [
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 },
      ]
    });
    setExistingImages([]);
    setImageFiles([]);
    setImagePreviews([]);
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingImages.length === 0 && imageFiles.length === 0) {
      setMessage("⚠️ Tambahkan minimal 1 foto produk");
      return;
    }

    setUploading(true);
    setMessage(isEditing ? "Memperbarui produk..." : "Mengupload foto...");

    // Upload images ONLY if new ones are selected
    const newAssetIds: string[] = [];
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        let fileToUpload = file;
        // Compress if larger than 1MB
        if (file.size > 1024 * 1024) {
          setMessage(`Mengompres ${file.name}...`);
          fileToUpload = await compressImage(file);
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.assetId) newAssetIds.push(data.assetId);
      }
    }

    setMessage(isEditing ? "Mengirim pembaruan..." : "Menyimpan produk...");

    // Combine existing asset refs and newly uploaded asset IDs
    const existingAssetRefs = existingImages.map(img => img.assetRef);

    // Create or Update product
    const res = await fetch("/api/admin/products", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        id: editingId,
        slug: form.slug || generateSlug(form.name),
        price: Number(form.price),
        existingAssetRefs,
        newAssetIds,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage(isEditing ? "✅ Produk berhasil diperbarui!" : "✅ Produk berhasil ditambahkan!");
      resetForm();
      fetchProducts();
    } else {
      setMessage("❌ Gagal: " + data.error);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"?`)) return;
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("🗑️ Produk berhasil dihapus");
      fetchProducts();
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, paymentStatus: status }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("✅ Status pesanan berhasil diperbarui");
      fetchOrders();
    }
  };

  const handleUpdateWaybill = async (id: string, waybill: string) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, waybill }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("✅ Resi pengiriman berhasil diperbarui");
      fetchOrders();
    }
  };

  const handleDeleteOrder = async (id: string, orderId: string) => {
    if (!confirm(`Hapus pesanan ${orderId}? Tindakan ini tidak dapat dibatalkan.`)) return;
    const res = await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("🗑️ Pesanan berhasil dihapus");
      fetchOrders();
    } else {
      setMessage("❌ Gagal menghapus pesanan");
    }
  };

  const handleUpdateUserRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
        setMessage("✅ Role user diperbarui");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Hapus akun user ini secara permanen?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== id));
        setMessage("🗑️ Akun user berhasil dihapus");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadSingleSettingImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data;
  };

  const handleSettingChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "hero1" | "hero2" | "hero3" | "community1" | "community2" | "community3") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    let fileToUpload = file;
    
    // Compress if larger than 1MB
    if (file.size > 1024 * 1024) {
      setMessage(`Mengompres ${field}...`);
      fileToUpload = await compressImage(file);
    }

    setMessage(`Mengupload ${field}...`);
    try {
      const data = await uploadSingleSettingImage(fileToUpload);
      if (data.assetId) {
        setSettings(prev => ({
          ...prev,
          [`${field}Url`]: data.url,
          [`${field}Ref`]: data.assetId
        }));
        setMessage(`✅ ${field} berhasil diupload! Klik SIMPAN PENGATURAN untuk meresmikannya.`);
      }
    } catch (e: any) {
      setMessage(`❌ Gagal upload: ${e.message}`);
    }
    setUploading(false);
  };

  const handeSaveSettings = async () => {
    setUploading(true);
    setMessage("Menyimpan pengaturan...");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        logoRef: settings.logoRef,
        heroSlide1Ref: settings.hero1Ref,
        heroSlide2Ref: settings.hero2Ref,
        heroSlide3Ref: settings.hero3Ref,
        community1Ref: settings.community1Ref,
        community2Ref: settings.community2Ref,
        community3Ref: settings.community3Ref
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("✅ Pengaturan berhasil disimpan!");
    } else {
      setMessage("❌ Gagal menyimpan pengaturan.");
    }
    setUploading(false);
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">UPPERMOON</h1>
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500">Admin Dashboard</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                placeholder="Enter password"
              />
            </div>
            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-white text-black py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors mt-4"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md z-50">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-lg font-bold tracking-tight">UPPERMOON</h1>
            <p className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase">Admin Panel</p>
          </div>
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => setActiveTab("products")}
              className={`text-xs tracking-widest uppercase transition-colors px-3 py-2 ${activeTab === "products" ? "text-white bg-neutral-900" : "text-neutral-500 hover:text-white"}`}
            >
              PRODUK
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`text-xs tracking-widest uppercase transition-colors px-3 py-2 ${activeTab === "orders" ? "text-white bg-neutral-900" : "text-neutral-500 hover:text-white"}`}
            >
              ORDER
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`text-xs tracking-widest uppercase transition-colors px-3 py-2 ${activeTab === "settings" ? "text-white bg-neutral-900" : "text-neutral-500 hover:text-white"}`}
            >
              PENGATURAN
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`text-xs tracking-widest uppercase transition-colors px-3 py-2 ${activeTab === "users" ? "text-white bg-neutral-900" : "text-neutral-500 hover:text-white"}`}
            >
              USERS
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-[10px] tracking-widest uppercase text-neutral-400 hover:text-white transition-colors border border-neutral-700 px-3 py-2">
            VIEW SITE ↗
          </a>
          <button onClick={handleLogout} className="text-[10px] tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors">
            LOGOUT
          </button>
        </div>
      </header>

      {/* Mobile nav (visible only on small screens) */}
      <div className="md:hidden flex border-b border-neutral-800 px-6 bg-neutral-950">
        <button onClick={() => setActiveTab("products")} className={`flex-1 py-3 text-xs tracking-widest uppercase text-center ${activeTab === "products" ? "text-white border-b-2 border-white" : "text-neutral-500"}`}>PRODUK</button>
        <button onClick={() => setActiveTab("orders")} className={`flex-1 py-3 text-xs tracking-widest uppercase text-center ${activeTab === "orders" ? "text-white border-b-2 border-white" : "text-neutral-500"}`}>ORDER</button>
        <button onClick={() => setActiveTab("settings")} className={`flex-1 py-3 text-xs tracking-widest uppercase text-center ${activeTab === "settings" ? "text-white border-b-2 border-white" : "text-neutral-500"}`}>PENGATURAN</button>
        <button onClick={() => setActiveTab("users")} className={`flex-1 py-3 text-xs tracking-widest uppercase text-center ${activeTab === "users" ? "text-white border-b-2 border-white" : "text-neutral-500"}`}>USERS</button>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Status message */}
        {message && (
          <div className="mb-6 bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-neutral-500 hover:text-white">✕</button>
          </div>
        )}

        {/* Actions Bar (Products Tab) */}
        {activeTab === "products" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Produk</h2>
                <p className="text-xs text-neutral-500 mt-1">{products.length} item dalam katalog</p>
              </div>
              <button
                onClick={() => {
                  if (showForm) resetForm();
                  else setShowForm(true);
                }}
                className="bg-white text-black px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2"
              >
                <span>{showForm ? "✕ TUTUP" : "+ TAMBAH PRODUK"}</span>
              </button>
            </div>

        {/* Add Product Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-12 bg-neutral-900 border border-neutral-800 p-8">
            <h3 className="text-sm font-bold tracking-[0.15em] uppercase mb-6">{isEditing ? "Edit Produk" : "Tambah Produk Baru"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Nama Produk *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                  className="w-full bg-black border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  placeholder="Contoh: OVERSIZED BOXY HOODIE"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Slug (URL)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-black border border-neutral-700 text-neutral-400 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  placeholder="otomatis-dari-nama"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Harga (IDR) *</label>
                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-black border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  placeholder="150000"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Kategori *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-black border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                >
                  <option value="TOPS">TOPS</option>
                  <option value="BOTTOMS">BOTTOMS</option>
                  <option value="OUTERWEAR">OUTERWEAR</option>
                  <option value="FOOTWEAR">FOOTWEAR</option>
                  <option value="ACCESSORIES">ACCESSORIES</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Koleksi</label>
                <input
                  value={form.collection}
                  onChange={(e) => setForm({ ...form, collection: e.target.value })}
                  className="w-full bg-black border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  placeholder="Contoh: AUTUMN SERIES"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Manajemen Stok per Ukuran</label>
                <div className="grid grid-cols-2 gap-4">
                  {form.variants.map((v, idx) => (
                    <div key={v.size} className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-neutral-500">{v.size}</span>
                      <input 
                        type="number"
                        value={v.stock}
                        onChange={(e) => {
                          const newVariants = [...form.variants];
                          newVariants[idx].stock = Number(e.target.value);
                          setForm({ ...form, variants: newVariants });
                        }}
                        className="bg-black border border-neutral-700 text-white px-3 py-2 text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="Jumlah"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    const size = prompt("Tambah ukuran baru (contoh: XXL):");
                    if (size && !form.variants.find(v => v.size === size)) {
                      setForm({ ...form, variants: [...form.variants, { size, stock: 0 }] });
                    }
                  }}
                  className="mt-4 text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest"
                >
                  + TAMBAH UKURAN LAIN
                </button>
              </div>
            </div>
            <div className="mt-6">
              <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-black border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors resize-none"
                placeholder="Deskripsi lengkap produk..."
              />
            </div>
            <div className="mt-6">
              <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">
                Foto Produk * (Minimal 1)
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                {/* Existing Images */}
                {existingImages.map((img, idx) => (
                  <div key={img._key || idx} className="relative group w-24 h-24 bg-neutral-800 border border-neutral-700">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 text-xs flex items-center justify-center opacity-100 hover:bg-red-600 transition-colors z-10 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                {/* New Images */}
                {imagePreviews.map((src, idx) => (
                  <div key={`new-${idx}`} className="relative group w-24 h-24 bg-neutral-800 border border-neutral-700">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 text-xs flex items-center justify-center opacity-100 hover:bg-red-600 transition-colors z-10 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-neutral-700 flex items-center justify-center text-neutral-500 hover:border-white hover:text-white transition-colors text-2xl"
                >
                  +
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (isEditing ? "MEMPERBARUI..." : "MENYIMPAN...") : (isEditing ? "UPDATE PRODUK" : "SIMPAN PRODUK")}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-neutral-700 text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
                >
                  BATAL
                </button>
              )}
            </div>
          </form>
        )}

        {/* Products List */}
        {loading ? (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-sm">Memuat produk...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800">
            <p className="text-neutral-500 text-sm mb-2">Belum ada produk</p>
            <p className="text-neutral-600 text-xs">Klik "TAMBAH PRODUK" untuk memulai</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id || p.slug} className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 hover:border-neutral-600 transition-colors group">
                <div className="w-16 h-16 bg-neutral-800 shrink-0 overflow-hidden">
                  {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold tracking-tight truncate">{p.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-neutral-400">Rp {p.price?.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] text-neutral-600 uppercase tracking-widest">{p.category}</span>
                  </div>
                </div>
                <a
                  href={`/products/${p.slug}`}
                  target="_blank"
                  className="text-[10px] tracking-widest uppercase text-neutral-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  VIEW
                </a>
                <button
                  onClick={() => handleEdit(p)}
                  className="text-[10px] tracking-widest uppercase text-neutral-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  EDIT
                </button>
                <button
                  onClick={() => p._id && handleDelete(p._id, p.name)}
                  className="text-[10px] tracking-widest uppercase text-red-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  HAPUS
                </button>
              </div>
            ))}
          </div>
        )}
        </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Pengaturan Tampilan</h2>
              <p className="text-xs text-neutral-500 mt-1">Ubah Logo Utama dan Gambar Hero Slider</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase border-b border-neutral-800 pb-4 mb-4">Logo Website</h3>
                <div className="w-full h-32 bg-black flex items-center justify-center mb-4 border border-neutral-800">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo Preview" className="h-10 w-auto object-contain" />
                  ) : (
                    <span className="text-neutral-600 text-xs">Belum ada logo (pakai teks default)</span>
                  )}
                </div>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleSettingChange(e, "logo")} />
                <button 
                  onClick={() => logoRef.current?.click()}
                  className="w-full border border-neutral-700 text-white py-3 text-xs tracking-widest uppercase hover:bg-neutral-800"
                >
                  GANTI LOGO
                </button>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase border-b border-neutral-800 pb-4 mb-4">Hero Slide 1</h3>
                <div className="w-full h-32 bg-black flex items-center justify-center mb-4 border border-neutral-800 relative">
                  {settings.hero1Url ? (
                    <img src={settings.hero1Url} alt="Hero 1 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-neutral-600 text-xs">Belum ada gambar (pakai statis lokal)</span>
                  )}
                </div>
                <input ref={hero1Ref} type="file" accept="image/*" className="hidden" onChange={(e) => handleSettingChange(e, "hero1")} />
                <button 
                  onClick={() => hero1Ref.current?.click()}
                  className="w-full border border-neutral-700 text-white py-3 text-xs tracking-widest uppercase hover:bg-neutral-800"
                >
                  GANTI SLIDE 1
                </button>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase border-b border-neutral-800 pb-4 mb-4">Hero Slide 2</h3>
                <div className="w-full h-32 bg-black flex items-center justify-center mb-4 border border-neutral-800 relative">
                  {settings.hero2Url ? (
                    <img src={settings.hero2Url} alt="Hero 2 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-neutral-600 text-xs">Belum ada gambar (pakai Unsplash default)</span>
                  )}
                </div>
                <input ref={hero2Ref} type="file" accept="image/*" className="hidden" onChange={(e) => handleSettingChange(e, "hero2")} />
                <button 
                  onClick={() => hero2Ref.current?.click()}
                  className="w-full border border-neutral-700 text-white py-3 text-xs tracking-widest uppercase hover:bg-neutral-800"
                >
                  GANTI SLIDE 2
                </button>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase border-b border-neutral-800 pb-4 mb-4">Hero Slide 3</h3>
                <div className="w-full h-32 bg-black flex items-center justify-center mb-4 border border-neutral-800 relative">
                  {settings.hero3Url ? (
                    <img src={settings.hero3Url} alt="Hero 3 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-neutral-600 text-xs">Belum ada gambar (pakai Unsplash default)</span>
                  )}
                </div>
                <input ref={hero3Ref} type="file" accept="image/*" className="hidden" onChange={(e) => handleSettingChange(e, "hero3")} />
                <button 
                  onClick={() => hero3Ref.current?.click()}
                  className="w-full border border-neutral-700 text-white py-3 text-xs tracking-widest uppercase hover:bg-neutral-800"
                >
                  GANTI SLIDE 3
                </button>
              </div>

              {/* Community Images */}
              <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase border-b border-neutral-800 pb-4 mb-4">Community 1 (Lifestyle)</h3>
                <div className="w-full h-32 bg-black flex items-center justify-center mb-4 border border-neutral-800 relative">
                  {settings.community1Url ? (
                    <img src={settings.community1Url} alt="Community 1 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-neutral-600 text-xs">Belum ada gambar (pakai stok template)</span>
                  )}
                </div>
                <input ref={community1Ref} type="file" accept="image/*" className="hidden" onChange={(e) => handleSettingChange(e, "community1")} />
                <button 
                  onClick={() => community1Ref.current?.click()}
                  className="w-full border border-neutral-700 text-white py-3 text-xs tracking-widest uppercase hover:bg-neutral-800"
                >
                  UPLOAD FOTO 1
                </button>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase border-b border-neutral-800 pb-4 mb-4">Community 2 (Editorial)</h3>
                <div className="w-full h-32 bg-black flex items-center justify-center mb-4 border border-neutral-800 relative">
                  {settings.community2Url ? (
                    <img src={settings.community2Url} alt="Community 2 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-neutral-600 text-xs">Belum ada gambar (pakai stok template)</span>
                  )}
                </div>
                <input ref={community2Ref} type="file" accept="image/*" className="hidden" onChange={(e) => handleSettingChange(e, "community2")} />
                <button 
                  onClick={() => community2Ref.current?.click()}
                  className="w-full border border-neutral-700 text-white py-3 text-xs tracking-widest uppercase hover:bg-neutral-800"
                >
                  UPLOAD FOTO 2
                </button>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase border-b border-neutral-800 pb-4 mb-4">Community 3 (Street Style)</h3>
                <div className="w-full h-32 bg-black flex items-center justify-center mb-4 border border-neutral-800 relative">
                  {settings.community3Url ? (
                    <img src={settings.community3Url} alt="Community 3 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-neutral-600 text-xs">Belum ada gambar (pakai stok template)</span>
                  )}
                </div>
                <input ref={community3Ref} type="file" accept="image/*" className="hidden" onChange={(e) => handleSettingChange(e, "community3")} />
                <button 
                  onClick={() => community3Ref.current?.click()}
                  className="w-full border border-neutral-700 text-white py-3 text-xs tracking-widest uppercase hover:bg-neutral-800"
                >
                  UPLOAD FOTO 3
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleSaveSettings}
                disabled={uploading}
                className="bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                {uploading ? "MENYIMPAN..." : "SIMPAN SEMUA PENGATURAN"}
              </button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Manajemen Pesanan</h2>
                <p className="text-xs text-neutral-500 mt-1">Total {orders.length} pesanan masuk</p>
              </div>
              <button 
                onClick={fetchOrders}
                className="text-[10px] tracking-widest uppercase text-neutral-400 hover:text-white transition-colors border border-neutral-800 px-4 py-2"
              >
                REFRESH
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-neutral-500">Memuat pesanan...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-neutral-800 text-neutral-500">
                Belum ada pesanan masuk.
              </div>
            ) : (
              <div className="space-y-6 pb-20">
                {orders.map((order) => (
                  <div key={order._id} className="bg-neutral-900 border border-neutral-800 p-6 hover:border-neutral-700 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-black text-white">{order.orderId}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${
                            order.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                            order.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                            'bg-orange-500/10 text-orange-500 border-orange-500/20'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Total Transaksi</p>
                        <p className="text-lg font-black text-white">Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">Detail Pengiriman</h4>
                        <div className="space-y-1 text-xs text-neutral-300 uppercase tracking-wide">
                          <p><span className="text-neutral-500">NAMA:</span> {order.customerName}</p>
                          <p><span className="text-neutral-500">EMAIL:</span> {order.customerEmail}</p>
                          <p><span className="text-neutral-500">TELP:</span> {order.customerPhone}</p>
                          {order.shippingAddress && (
                            <>
                              <p><span className="text-neutral-500">ALAMAT:</span> {order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
                            </>
                          )}
                          <div className="mt-3 pt-3 border-t border-neutral-800">
                            <p><span className="text-neutral-500">KURIR:</span> {order.courierName || '-'} ({order.courierService || '-'})</p>
                            <div className="mt-2">
                              <label className="text-[10px] text-neutral-500 uppercase block mb-1">No. Resi (Waybill)</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Input No. Resi..."
                                  defaultValue={order.waybill || ''}
                                  onBlur={(e) => {
                                    if (e.target.value !== (order.waybill || '')) {
                                      handleUpdateWaybill(order._id, e.target.value);
                                    }
                                  }}
                                  className="bg-black border border-neutral-800 focus:border-white px-2 py-1 text-[10px] w-full transition-colors uppercase outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">Item Pesanan</h4>
                        <div className="space-y-3">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-3 items-center text-xs">
                              <div className="w-10 h-12 bg-neutral-800 shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-cover grayscale" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-white truncate">{item.productName}</p>
                                <p className="text-neutral-500">{item.size} × {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-800 flex flex-wrap gap-3">
                      <select 
                        defaultValue={order.paymentStatus}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="bg-black border border-neutral-700 text-[10px] font-bold tracking-widest uppercase px-4 py-2 focus:outline-none focus:border-white transition-colors"
                      >
                        <option value="pending">PENDING</option>
                        <option value="paid">PAID / SETTLED</option>
                        <option value="failed">FAILED</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                      <button className="text-[10px] tracking-widest uppercase text-neutral-500 hover:text-white transition-colors border border-neutral-800 px-4 py-2 ml-auto">
                        PRINT INVOICE
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order._id, order.orderId)}
                        className="text-[10px] tracking-widest uppercase text-red-500 hover:text-red-400 border border-neutral-800 hover:border-red-900 hover:bg-neutral-900 transition-colors px-4 py-2"
                      >
                        HAPUS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Manajemen User</h2>
                <p className="text-xs text-neutral-500 mt-1">Total {users.length} pengguna terdaftar</p>
              </div>
              <button 
                onClick={fetchUsers}
                className="text-[10px] tracking-widest uppercase text-neutral-400 hover:text-white transition-colors border border-neutral-800 px-4 py-2"
              >
                REFRESH
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-neutral-500">Memuat data user...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-neutral-800 text-neutral-500">
                Belum ada user yang terdaftar.
              </div>
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
                <table className="w-full text-left text-xs uppercase tracking-wider">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950">
                      <th className="px-6 py-4 font-bold text-neutral-500">Nama & Email</th>
                      <th className="px-6 py-4 font-bold text-neutral-500 text-center">Status</th>
                      <th className="px-6 py-4 font-bold text-neutral-500 text-center">Role</th>
                      <th className="px-6 py-4 font-bold text-neutral-500 text-center">Terakhir Login</th>
                      <th className="px-6 py-4 font-bold text-neutral-500 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-white">{user.fullName}</div>
                          <div className="text-[10px] text-neutral-500 normal-case mt-0.5">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            user.isVerified ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <select 
                            value={user.role || 'user'}
                            onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                            className="bg-black border border-neutral-700 text-[10px] px-2 py-1 outline-none focus:border-white transition-colors"
                          >
                            <option value="user">USER</option>
                            <option value="member">MEMBER</option>
                            <option value="admin">ADMIN</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-neutral-300">
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Belum pernah'}
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-1">
                            REGISTERED: {new Date(user._createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            HAPUS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
