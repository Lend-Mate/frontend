import { useEffect, useRef, useState } from 'react'
import './App.css'
import { getAllProducts, getAllCategories } from './services/product-service'

// S3 bucket base URL — kendi bucket adresinle değiştir
const S3_BASE = "https://lend-mate-bucket.s3.amazonaws.com"

function getImageUrl(key) {
  if (!key) return 'https://placehold.co/400x300?text=Görsel+Yok'
  if (key.startsWith('http')) return key
  return `${S3_BASE}/${key}`
}

function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: "#111", color: "#fff", padding: "12px 24px", borderRadius: 50,
      fontSize: 13, fontWeight: 600, zIndex: 99, display: "flex", alignItems: "center", gap: 8
    }}>
      <span style={{ color: "#4CAF50" }}>✓</span> {msg}
    </div>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [wishlist, setWishlist] = useState(new Set())
  const [cartCount, setCartCount] = useState(0)
  const [modalProduct, setModalProduct] = useState(null)
  const [isCatsDropdownOpen, setIsCatsDropdownOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const catSliderRef = useRef(null)
  const dropdownRef = useRef(null)

  // Veri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ])
        setProducts(prods)
        setCategories(cats)
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Dropdown dışı tıklama
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCatsDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [])

  // Toast otomatik kapat
  useEffect(() => {
    if (!toastMessage) return
    const timeout = window.setTimeout(() => setToastMessage(''), 2500)
    return () => window.clearTimeout(timeout)
  }, [toastMessage])

  const newProducts = products.slice(0, 4)
  const saleProducts = products.slice(4)

  const toggleWish = (id) => {
    setWishlist(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const openModal = (product) => setModalProduct(product)
  const closeModal = () => setModalProduct(null)

  const handleRent = (product) => {
    setCartCount(prev => prev + 1)
    closeModal()
    setToastMessage(`${product.productName} sepete eklendi!`)
  }

  const scrollCat = (offset) => {
    catSliderRef.current?.scrollBy({ left: offset, behavior: 'smooth' })
  }

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
          <img
            src={getImageUrl(primaryImage?.imageUrl)}
            alt={product.productName}
            loading="lazy"
          />
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
    <>
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
            <a href="/products?sale=true">İndirimli Ürünler</a>
            <a href="/how-it-works">Nasıl Çalışır?</a>
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

      {/* ── KATEGORİLER SECTION ── */}
      <section className="section">
        <div className="section-header">
          <h2>Kategoriler</h2>
          <div className="nav-arrows">
            <button type="button" className="arrow-btn" onClick={() => scrollCat(-210)}>
              <i className="fas fa-chevron-left" />
            </button>
            <button type="button" className="arrow-btn" onClick={() => scrollCat(210)}>
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>
        <div className="category-slider" ref={catSliderRef}>
          {loading ? (
            <div style={{ padding: '20px', color: '#888' }}>Kategoriler yükleniyor...</div>
          ) : (
            categories.map(cat => (
              <div
                key={cat.id}
                className="cat-card"
                onClick={() => window.location.href = `/products?categoryId=${cat.id}`}
              >
                <img
                  src={getImageUrl(cat.imageName)}
                  alt={cat.categoryName}
                />
                <p>{cat.categoryName}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── SON EKLENEN ÜRÜNLER ── */}
      <section className="section">
        <div className="section-header">
          <h2>Son Eklenen Ürünler</h2>
          <a href="/products" className="see-all-btn">Tümünü Gör</a>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: 24 }} />
            <p style={{ marginTop: 12 }}>Ürünler yükleniyor...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#e53935' }}>{error}</div>
        ) : (
          <div className="products-grid">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── DİĞER ÜRÜNLER ── */}
      {saleProducts.length > 0 && (
        <section className="section section-gray">
          <div className="section-header">
            <h2>Diğer Ürünler</h2>
            <a href="/products" className="see-all-btn">Tümünü Gör</a>
          </div>
          <div className="products-grid">
            {saleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── NASIL ÇALIŞIR ── */}
      <section className="how-section">
        <h2>Nasıl Çalışır?</h2>
        <div className="how-steps">
          <div className="how-step">
            <div className="step-icon"><i className="fas fa-search" /></div>
            <h3>Ürün Seç</h3>
            <p>Binlerce ürün arasından ihtiyacına uygun olanı bul</p>
          </div>
          <div className="how-step">
            <div className="step-icon"><i className="fas fa-calendar-alt" /></div>
            <h3>Süre Belirle</h3>
            <p>Min/maks kiralama günü aralığında süre seç</p>
          </div>
          <div className="how-step">
            <div className="step-icon"><i className="fas fa-truck" /></div>
            <h3>Kapına Gelsin</h3>
            <p>Ücretsiz kargo ile 1-5 iş günü içinde teslim</p>
          </div>
          <div className="how-step">
            <div className="step-icon"><i className="fas fa-redo" /></div>
            <h3>İade Et veya Al</h3>
            <p>Süre bitince iade et ya da satın alma opsiyonunu kullan</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">+</span>lendmate
            </div>
            <p>Türkiye'nin en büyük ürün kiralama platformu.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-instagram" /></a>
              <a href="#"><i className="fab fa-twitter" /></a>
              <a href="#"><i className="fab fa-linkedin" /></a>
              <a href="#"><i className="fab fa-youtube" /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Kategoriler</h4>
            {categories.slice(0, 6).map(cat => (
              <a key={cat.id} href={`/products?categoryId=${cat.id}`}>{cat.categoryName}</a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Şirket</h4>
            <a href="#">Hakkımızda</a>
            <a href="#">Nasıl Çalışır?</a>
            <a href="#">Kampanyalar</a>
            <a href="#">Kariyer</a>
          </div>
          <div className="footer-col">
            <h4>Destek</h4>
            <a href="#">SSS</a>
            <a href="#">İletişim</a>
            <a href="#">Gizlilik Politikası</a>
            <a href="#">KVKK</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Lendmate. Tüm hakları saklıdır.</p>
        </div>
      </footer>

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

                <button
                  type="button"
                  className="modal-rent-btn"
                  onClick={() => handleRent(modalProduct)}
                >
                  Kirala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast msg={toastMessage} />
    </>
  )
}

export default App