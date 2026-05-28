import { useState, useEffect, useRef } from "react";
import { getAllProducts, getAllCategories } from "../services/product-service";

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
  const [isCatsDropdownOpen, setIsCatsDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)

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

  // Dropdown dışı tıklama
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCatsDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
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
  }

  // Aktif kategori adı
  const activeCategoryName = categoryIdFilter
    ? categories.find(c => String(c.id) === categoryIdFilter)?.categoryName
    : null

  // ── PRODUCT CARD ──
  const ProductCard = ({ product }) => {
    const isWished = wishlist.has(product.id)
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

    return (
      <div className="product-card" onClick={() => openModal(product)}>
        <span className="product-badge">Yeni</span>
        <button
          type="button"
          className={`product-wish ${isWished ? 'active' : ''}`}
          onClick={e => {
            e.stopPropagation()
            toggleWish(product.id)
          }}
        >
          <i className={`fa${isWished ? 's' : 'r'} fa-heart`} />
        </button>

        <div className="product-img-wrap">
          <img src={getImageUrl(primaryImage?.imageUrl)} alt={product.productName} loading="lazy" />
        </div>

        <div className="product-info">
          <div className="product-brand">{product.brand || 'Lendmate'}</div>
          <div className="product-name">{product.productName}</div>
          <div className="product-specs">{product.description}</div>

          <div className="duration-pills">
            <span className="pill active">
              {product.minRentalDays}–{product.maxRentalDays} Gün
            </span>
          </div>

          <div className="product-price">
            {Number(product.price).toLocaleString('tr-TR')} {product.currency}
            <span> / Günlük</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            <span className="logo-icon">+</span>lendmate
          </a>
          <div className="search-bar">
            <i className="fas fa-search" />
            <input type="text" placeholder="Marka, ürün veya kategori ara" />
          </div>
          <button type="button" className="create-listing-btn" onClick={() => {
            window.location.href = '/advert'
          }}>
            <i className="fas fa-plus" /> Ücretsiz İlan Oluştur
          </button>
          <div className="header-actions">
            <button type="button" className="icon-btn" onClick={() => {
              localStorage.removeItem("token")
              window.location.href = "/auth"
            }}>
              <i className="fas fa-user" />
            </button>
            <button type="button" className="icon-btn wishlist-btn" onClick={() => {
              window.location.href = '/favorites'
            }}>
              <i className="fas fa-heart" />
              <span className="badge">{wishlist.size}</span>
            </button>
            <button type="button" className="icon-btn cart-btn" onClick={() => {
              window.location.href = '/shopping-cart'
            }}>
              <i className="fas fa-shopping-cart" />
              <span className="badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── NAV ── */}
      <nav className="main-nav" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="nav-inner">
          <div>
            <button
              type="button"
              className="all-cats-btn"
              onClick={e => {
                e.stopPropagation()
                setIsCatsDropdownOpen(prev => !prev)
              }}
            >
              <i className="fas fa-th-large" /> TÜM KATEGORİLER
            </button>
          </div>
          <div>
            <a href="/products">Tüm Ürünler</a>
            {categories.slice(0, 4).map(cat => (
              <a key={cat.id} href={`/products?categoryId=${cat.id}`}>{cat.categoryName}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── KATEGORİ DROPDOWN ── */}
      <div className={`cats-dropdown ${isCatsDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
        <div className="cats-grid">
          <a href="/products" className="all-cats-link">
            <i className="fas fa-th" /> Tüm Ürünler
          </a>
          {categories.map(cat => (
            <a key={cat.id} href={`/products?categoryId=${cat.id}`}>
              <i className="fas fa-tag" /> {cat.categoryName}
            </a>
          ))}
        </div>
      </div>

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
                  <ProductCard key={product.id} product={product} />
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
        <div
          className="modal-overlay open"
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal" id="productModal">
            <button type="button" className="modal-close" onClick={closeModal}>
              <i className="fas fa-times" />
            </button>
            <div className="modal-content">
              <div className="modal-images">
                <img
                  className="modal-main-img"
                  src={getImageUrl(
                    (modalProduct.images?.find(img => img.isPrimary) || modalProduct.images?.[0])?.imageUrl
                  )}
                  alt={modalProduct.productName}
                />
                {modalProduct.images?.length > 1 && (
                  <div className="modal-thumbs">
                    {modalProduct.images.map(img => (
                      <img
                        key={img.id}
                        className={`modal-thumb ${img.isPrimary ? 'active' : ''}`}
                        src={getImageUrl(img.imageUrl)}
                        alt="thumb"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-details">
                <div className="modal-brand">{modalProduct.brand || 'Lendmate'}</div>
                <h2 className="modal-title">{modalProduct.productName}</h2>
                <div className="modal-specs">{modalProduct.description}</div>

                <div className="modal-price-row">
                  <span className="modal-price">
                    {Number(modalProduct.price).toLocaleString('tr-TR')} {modalProduct.currency}
                  </span>
                  <span className="modal-price-label">/ Günlük</span>
                </div>

                <div className="modal-badges">
                  <div className="modal-badge-row">
                    <i className="fas fa-calendar-alt" /> {modalProduct.minRentalDays}–{modalProduct.maxRentalDays} gün arası kiralama
                  </div>
                  <div className="modal-badge-row">
                    <i className="fas fa-shield-alt" /> Depozito: {Number(modalProduct.depositAmount).toLocaleString('tr-TR')} {modalProduct.currency}
                  </div>
                  <div className="modal-badge-row">
                    <i className="fas fa-box" /> Stok: {modalProduct.stockQuantity} adet
                  </div>
                  <div className="modal-badge-row">
                    <i className="fas fa-truck" /> 1-5 İş Günü Arasında Teslimat
                  </div>
                </div>

                <button type="button" className="modal-rent-btn" onClick={() => handleRent(modalProduct)}>
                  Kirala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast msg={toast} />
    </div>
  )
}