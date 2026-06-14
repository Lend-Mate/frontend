import { useState, useEffect } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductDetailModal";
import { getAllProducts, getAllCategories } from "../services/product-service";
import { addToCart } from "../services/order-service";
import { getOwnerIdFromToken } from "../services/auth-service";

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
  sidebar: { width: 220, flexShrink: 0, padding: "20px 16px 20px 0" },
  filterBox: { background: "#fff", borderRadius: 10, border: "1px solid #eee", padding: 16, marginBottom: 12 },
  filterTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#111" },
  filterItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#444", marginBottom: 8, cursor: "pointer" },
  moreBtn: { border: "1px solid #ddd", background: "none", padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", color: "#555", marginTop: 4, fontFamily: "inherit" },
  main: { flex: 1, padding: "20px 0" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  viewBtns: { display: "flex", gap: 4 },
  viewBtn: (active) => ({ background: "#fff", border: active ? "1.5px solid #4CAF50" : "1px solid #ddd", borderRadius: 6, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: active ? "#4CAF50" : "#555" }),
  sortSelect: { border: "1px solid #ddd", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#fff" },
  productsGrid: (list) => ({ display: "grid", gridTemplateColumns: list ? "1fr" : "repeat(3, 1fr)", gap: 14 }),
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

// ── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ brands, checkedBrands, onBrandToggle }) {
  return (
    <aside style={s.sidebar}>
      <div style={s.filterBox}>
        <div style={s.filterTitle}>Markalar</div>
        {brands.map((brand) => (
          <label key={brand} style={s.filterItem}>
            <input
              type="checkbox"
              checked={checkedBrands.has(brand)}
              onChange={() => onBrandToggle(brand)}
              style={{ accentColor: "#4CAF50", width: 15, height: 15, cursor: "pointer" }}
            />
            {brand}
          </label>
        ))}
      </div>

      <div style={s.filterBox}>
        <div style={s.filterTitle}>Fiyat Aralığı</div>
        {["500 Altı", "500 - 1000", "1000 - 2000", "2000 - 5000", "5000 Üzeri"].map((range) => (
          <label key={range} style={s.filterItem}>
            <input type="checkbox" style={{ accentColor: "#4CAF50", width: 15, height: 15, cursor: "pointer" }} />
            {range} TL
          </label>
        ))}
      </div>

      <div style={s.filterBox}>
        <div style={s.filterTitle}>Kiralama Süresi</div>
        {["1-7 Gün", "7-14 Gün", "14-30 Gün", "30+ Gün"].map((dur) => (
          <label key={dur} style={s.filterItem}>
            <input type="checkbox" style={{ accentColor: "#4CAF50", width: 15, height: 15, cursor: "pointer" }} />
            {dur}
          </label>
        ))}
      </div>
    </aside>
  )
}

// ── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function Products() {
  const [apiProducts, setApiProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cartCount, setCartCount] = useState(0)
  const [wishlist, setWishlist] = useState(new Set())
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("default")
  const [checkedBrands, setCheckedBrands] = useState(new Set())
  const [toast, setToast] = useState("")
  const [modalProduct, setModalProduct] = useState(null)

  // URL'den categoryId parametresini oku
  const urlParams = new URLSearchParams(window.location.search)
  const categoryIdFilter = urlParams.get('categoryId')

  // Veri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ])
        setApiProducts(prods)
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


  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  // Marka listesini ürünlerden dinamik üret
  const brands = [...new Set(apiProducts.map(p => p.brand).filter(Boolean))]

  // Filtre + sıralama
  let products = [...apiProducts]
  if (categoryIdFilter) products = products.filter(p => String(p.categoryId) === categoryIdFilter)
  if (checkedBrands.size > 0) products = products.filter(p => checkedBrands.has(p.brand))
  if (sortBy === "asc") products.sort((a, b) => Number(a.price) - Number(b.price))
  if (sortBy === "desc") products.sort((a, b) => Number(b.price) - Number(a.price))

  const toggleWish = (id) => {
    setWishlist(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleBrandToggle(brand) {
    setCheckedBrands(prev => {
      const next = new Set(prev)
      next.has(brand) ? next.delete(brand) : next.add(brand)
      return next
    })
  }

  const openModal = (product) => setModalProduct(product)
  const closeModal = () => setModalProduct(null)

  const handleRent = (product) => {
    setCartCount(prev => prev + 1)
    closeModal()
    showToast(`${product.productName} sepete eklendi!`)
    const userId = getOwnerIdFromToken();
    addToCart({ productId: product.id, userId }).catch(err => {
      console.error("Sepete ürün eklenirken bir hata oluştu:", err)
      showToast("Ürün sepette eklenirken bir hata oluştu.")
    })
  }

  // Aktif kategori adı
  const activeCategoryName = categoryIdFilter
    ? categories.find(c => String(c.id) === categoryIdFilter)?.categoryName
    : null

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <Header categories={categories} wishlistCount={wishlist.size} cartCount={cartCount} />

      {/* ── ANA IÇERIK ── */}
      <div style={s.page}>
        <Sidebar
          brands={brands}
          checkedBrands={checkedBrands}
          onBrandToggle={handleBrandToggle}
        />

        <main style={s.main}>
          {/* Başlık */}
          <h1 style={{ marginTop: 0, fontSize: "1.9rem", fontWeight: 600, color: "#111827", marginBottom: 18, letterSpacing: "-0.01em" }}>
            {activeCategoryName ? activeCategoryName : 'Tüm Ürünler'}
          </h1>

          {/* Toolbar */}
          <div style={s.toolbar}>
            <div style={s.viewBtns}>
              <button style={s.viewBtn(viewMode === "grid")} onClick={() => setViewMode("grid")}>⊞</button>
              <button style={s.viewBtn(viewMode === "list")} onClick={() => setViewMode("list")}>☰</button>
            </div>
            <div style={{ fontSize: 13, color: "#888" }}>
              {loading ? 'Yükleniyor...' : `${products.length} ürün bulundu`}
            </div>
            <select style={s.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Sırala</option>
              <option value="asc">Fiyat: Düşükten Yükseğe</option>
              <option value="desc">Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>

          {/* Ürün Grid */}
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: 28 }} />
              <p style={{ marginTop: 12, fontSize: 14 }}>Ürünler yükleniyor...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#e53935', fontSize: 14 }}>{error}</div>
          ) : (
            <>
              <div style={s.productsGrid(viewMode === "list")}> 
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    openModal={openModal}
                    toggleWish={toggleWish}
                    getImageUrl={getImageUrl}
                    isWished={wishlist.has(product.id)}
                  />
                ))}
              </div>
              {products.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: "#888", fontSize: 14 }}>
                  Seçilen filtrelere göre ürün bulunamadı.
                </div>
              )}
            </>
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