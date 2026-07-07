import { useEffect, useRef, useState } from 'react'
import './App.css'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductDetailModal'
import { getAllProducts, getAllCategories } from './services/product-service'
import Toast from './components/Toast'

// S3 bucket base URL — kendi bucket adresinle değiştir
const S3_BASE = "https://lend-mate-bucket.s3.amazonaws.com"

function getImageUrl(key) {
  if (!key) return 'https://placehold.co/400x300?text=Görsel+Yok'
  if (key.startsWith('http')) return key
  return `${S3_BASE}/${key}`
}

function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [wishlist, setWishlist] = useState(new Set())
  const [cartCount, setCartCount] = useState(0)
  const [modalProduct, setModalProduct] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  const catSliderRef = useRef(null)

  // Veri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          getAllProducts({
            page: 0,
            size: 8, // homepage limiti
          }),
          getAllCategories(),
        ]);

        setProducts(prods.content); // 👈 KRİTİK
        setCategories(cats);
      } catch (err) {
        setError("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData()
  }, [])

  // Toast otomatik kapat
  useEffect(() => {
    if (!toastMessage) return
    const timeout = window.setTimeout(() => setToastMessage(''), 2500)
    return () => window.clearTimeout(timeout)
  }, [toastMessage])

  const newProducts = products.slice(0, 4);
  const saleProducts = products.slice(0);

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

  return (
    <>
      <Header categories={categories} wishlistCount={wishlist.size} cartCount={cartCount} />

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
        <ProductModal
          product={modalProduct}
          getImageUrl={getImageUrl}
          closeModal={closeModal}
          handleRent={handleRent}
        />
      )}

      <Toast msg={toastMessage} />
    </>
  )
}

export default App