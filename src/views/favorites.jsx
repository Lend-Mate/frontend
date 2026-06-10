import { useState, useEffect } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductDetailModal";
import { getAllProducts, getAllCategories } from "../services/product-service";
import { getOwnerIdFromToken } from "../services/auth-service";
import { getFavourites } from "../services/favourite-service";

// S3 bucket base URL — kendi bucket adresinle değiştir
const S3_BASE = "https://lend-mate-bucket.s3.amazonaws.com"

function getImageUrl(key) {
  if (!key) return 'https://placehold.co/400x300?text=Görsel+Yok'
  if (key.startsWith('http')) return key
  return `${S3_BASE}/${key}`
}

// ── STYLES ──────────────────────────────────────────────────────────────────
const s = {
  page: { display: "flex", gap: 0, minHeight: "100vh", maxWidth: 1100, margin: "0 auto", padding: "0 16px", fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", color: "#111" },
  main: { flex: 1, padding: "20px 0" },
  productsGrid: (list) => ({ display: "grid", gridTemplateColumns: list ? "1fr" : "repeat(3, 1fr)", gap: 14 }),
  emptyState: { textAlign: "center", padding: "80px 20px", color: "#888" },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 600, color: "#333", marginBottom: 8 },
  emptyDesc: { fontSize: 14, marginBottom: 24 },
  emptyBtn: { background: "#4CAF50", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
}

// ── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "12px 24px", borderRadius: 50, fontSize: 13, fontWeight: 600, zIndex: 99, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#4CAF50" }}>✓</span> {msg}
    </div>
  )
}

// ── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function Favorites() {
  const [products, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cartCount, setCartCount] = useState(0)
  // Favoriler localStorage'dan yüklenir — wishlist'e eklenen ürün id'leri
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('lendmate_wishlist')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("default")
  const [toast, setToast] = useState("")
  const [modalProduct, setModalProduct] = useState(null)

  // Veri çekme
  useEffect(() => {
    const userId = getOwnerIdFromToken();
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          getFavourites(userId),
          getAllCategories(),
        ])
        setAllProducts(prods)
        setCategories(cats)
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Wishlist değişince localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('lendmate_wishlist', JSON.stringify([...wishlist]))
  }, [wishlist])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const toggleWish = (id) => {
    setWishlist(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        showToast("Favorilerden kaldırıldı.")
      } else {
        next.add(id)
      }
      return next
    })
  }

  const openModal = (product) => setModalProduct(product)
  const closeModal = () => setModalProduct(null)

  const handleRent = (product) => {
    setCartCount(prev => prev + 1)
    closeModal()
    showToast(`${product.productName} sepete eklendi!`)
  }

  // Sadece wishlist'teki ürünleri göster
  
  if (sortBy === "asc") products.sort((a, b) => Number(a.price) - Number(b.price))
  if (sortBy === "desc") products.sort((a, b) => Number(b.price) - Number(a.price))

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <Header categories={categories} wishlistCount={wishlist.size} cartCount={cartCount} />

      {/* ── ANA IÇERIK ── */}
      <div style={s.page}>
        <main style={s.main}>

          {/* Başlık + toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h1 style={{ margin: 0, fontSize: "1.9rem", fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>
              Favorilerim
              {!loading && (
                <span style={{ fontSize: 16, fontWeight: 400, color: '#888', marginLeft: 10 }}>
                  ({products.length} ürün)
                </span>
              )}
            </h1>

            {products.length > 0 && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  style={{ background: "#fff", border: viewMode === "grid" ? "1.5px solid #4CAF50" : "1px solid #ddd", borderRadius: 6, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: viewMode === "grid" ? "#4CAF50" : "#555" }}
                  onClick={() => setViewMode("grid")}
                >⊞</button>
                <button
                  style={{ background: "#fff", border: viewMode === "list" ? "1.5px solid #4CAF50" : "1px solid #ddd", borderRadius: 6, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: viewMode === "list" ? "#4CAF50" : "#555" }}
                  onClick={() => setViewMode("list")}
                >☰</button>
                <select
                  style={{ border: "1px solid #ddd", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#fff" }}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="default">Sırala</option>
                  <option value="asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="desc">Fiyat: Yüksekten Düşüğe</option>
                </select>
              </div>
            )}
          </div>

          {/* İçerik */}
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: 28 }} />
              <p style={{ marginTop: 12, fontSize: 14 }}>Yükleniyor...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#e53935', fontSize: 14 }}>{error}</div>
          ) : products.length === 0 ? (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>🤍</div>
              <div style={s.emptyTitle}>Henüz favori ürünün yok</div>
              <div style={s.emptyDesc}>
                Beğendiğin ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsin.
              </div>
              <button style={s.emptyBtn} onClick={() => window.location.href = '/products'}>
                Ürünleri Keşfet
              </button>
            </div>
          ) : (
            <div style={s.productsGrid(viewMode === "list")}> 
              {products.map(product => (
                <ProductCard
                  key={product.product.id}
                  product={product.product}
                  openModal={openModal}
                  toggleWish={toggleWish}
                  getImageUrl={getImageUrl}
                  isWished={wishlist.has(product.product.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL ── */}
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          getImageUrl={getImageUrl}
          closeModal={closeModal}
          handleRent={handleRent}
        />
      )}

      <Toast msg={toast} />
    </div>
  )
}