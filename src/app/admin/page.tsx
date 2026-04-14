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
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState<any[]>([]);
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
    sizes: ["S", "M", "L", "XL"],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const removeImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
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
      sizes: product.sizes || ["S", "M", "L", "XL"],
    });
    setImagePreviews(product.gallery || [product.image]);
    setImageFiles([]); // Clear new uploads state
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({ name: "", slug: "", price: "", category: "TOPS", collection: "", description: "", sizes: ["S", "M", "L", "XL"] });
    setImageFiles([]);
    setImagePreviews([]);
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && imageFiles.length === 0) {
      setMessage("⚠️ Tambahkan minimal 1 foto produk");
      return;
    }

    setUploading(true);
    setMessage(isEditing ? "Memperbarui produk..." : "Mengupload foto...");

    // Upload images ONLY if new ones are selected
    const assetIds: string[] = [];
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.assetId) assetIds.push(data.assetId);
      }
    }

    setMessage(isEditing ? "Mengirim pembaruan..." : "Menyimpan produk...");

    // Create or Update product
    const res = await fetch("/api/admin/products", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        id: editingId,
        slug: form.slug || generateSlug(form.name),
        price: Number(form.price),
        imageAssetIds: assetIds.length > 0 ? assetIds : undefined,
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
        <div>
          <h1 className="text-lg font-bold tracking-tight">UPPERMOON</h1>
          <p className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase">Admin Panel</p>
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

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Status message */}
        {message && (
          <div className="mb-6 bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-neutral-500 hover:text-white">✕</button>
          </div>
        )}

        {/* Actions Bar */}
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
                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">Ukuran</label>
                <div className="flex gap-2">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => {
                        setForm({
                          ...form,
                          sizes: form.sizes.includes(size)
                            ? form.sizes.filter((s) => s !== size)
                            : [...form.sizes, size],
                        });
                      }}
                      className={`w-10 h-10 border text-xs font-bold transition-colors ${
                        form.sizes.includes(size)
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-neutral-500 border-neutral-700 hover:border-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
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
                Foto Produk {isEditing ? "(kosongkan jika tidak ingin ganti)" : "*"}
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group w-24 h-24 bg-neutral-800 border border-neutral-700">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    )}
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
      </main>
    </div>
  );
}
