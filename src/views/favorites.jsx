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
  const [allProducts, setAllProducts] = useState([])
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
  const [isCatsDropdownOpen, setIsCatsDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)

  // Veri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          getAllProducts(),
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
  let products = allProducts.filter(p => wishlist.has(p.id))
  if (sortBy === "asc") products.sort((a, b) => Number(a.price) - Number(b.price))
  if (sortBy === "desc") products.sort((a, b) => Number(b.price) - Number(a.price))

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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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