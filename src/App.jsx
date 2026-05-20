import { useEffect, useRef, useState } from 'react'
import './App.css'

const products = [
  {
    id: 1,
    brand: 'Xiaomi',
    name: 'Xiaomi 15T Pro 12GB 1TB',
    specs: '12 GB Ram, 1 TB',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format',
    prices: { '1 Ay': 4200, '3 Ay': 3800, '6 Ay': 3600, '12 Ay': 3500, '24 Ay': 3385 },
    defaultDuration: '24 Ay',
    badge: 'Yeni',
    sale: false,
    stars: 4
  },
  {
    id: 2,
    brand: 'Apple',
    name: 'Apple iPad Pro 13" M5 256GB Wi‑Fi + Cellular',
    specs: 'M5, 13", 12 MP, 256 GB, 5G',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format',
    prices: { '3 Ay': 6200, '6 Ay': 5900, '12 Ay': 5700, '24 Ay': 5575 },
    defaultDuration: '24 Ay',
    badge: 'Yeni',
    sale: false,
    stars: 5
  },
  {
    id: 3,
    brand: 'Samsung',
    name: 'Samsung Galaxy Watch 8 Classic 46mm',
    specs: 'Bluetooth, Galaxy AI, 64 GB Bellek Kapasitesi',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format',
    prices: { '3 Ay': 1500, '6 Ay': 1400, '12 Ay': 1250 },
    defaultDuration: '12 Ay',
    badge: 'Yeni',
    sale: false,
    stars: 4
  },
  {
    id: 4,
    brand: 'Samsung',
    name: 'Samsung Galaxy Tab S11 Ultra 5G 512GB',
    specs: '14.6 inç, 12 GB RAM, Hafıza Kartı Desteği, 512 GB Depolama',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&auto=format',
    prices: { '3 Ay': 4800, '6 Ay': 4600, '12 Ay': 4450, '24 Ay': 4310 },
    defaultDuration: '24 Ay',
    badge: 'Yeni',
    sale: false,
    stars: 5
  },
  {
    id: 5,
    brand: 'Apple',
    name: 'Apple iPhone 15 128GB',
    specs: '6.1 inç, A16 Bionic, 5G, 2 Kamera, 6 GB Ram',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&auto=format',
    prices: { '3 Ay': 3100, '6 Ay': 2950, '12 Ay': 2880, '24 Ay': 2810 },
    defaultDuration: '24 Ay',
    badge: 'Yeni',
    sale: false,
    stars: 5
  },
  {
    id: 6,
    brand: 'Apple',
    name: 'Apple iPhone 16 Pro Max 256GB',
    specs: '6.9 inç, A18 Pro çip, Pro kamera',
    image: 'https://images.unsplash.com/photo-1632661674596-618d8b64a6e2?w=400&auto=format',
    prices: { '3 Ay': 7500, '6 Ay': 7100, '12 Ay': 6950, '24 Ay': 6740 },
    defaultDuration: '24 Ay',
    badge: 'Yeni',
    sale: false,
    stars: 5
  },
  {
    id: 7,
    brand: 'Apple',
    name: 'Apple iPhone 15 Pro Max 256GB',
    specs: '6.7 inç, A17 Bionic, 5G, 3 Kamera, 8 GB Ram',
    image: 'https://images.unsplash.com/photo-1698527264261-dc58db8e8a7c?w=400&auto=format',
    prices: { '3 Ay': 5200, '6 Ay': 5000, '12 Ay': 4900, '24 Ay': 4805 },
    defaultDuration: '24 Ay',
    badge: 'Yeni',
    sale: false,
    stars: 4
  },
  {
    id: 8,
    brand: 'Dyson',
    name: 'Dyson V15 Detect Absolute',
    specs: 'Kablosuz, 60 dk pil ömrü, HEPA filtreli',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format',
    prices: { '3 Ay': 1800, '6 Ay': 1600, '12 Ay': 1450 },
    defaultDuration: '12 Ay',
    badge: '%20 İndirim',
    sale: true,
    stars: 4
  },
  {
    id: 9,
    brand: 'Sony',
    name: 'Sony WH-1000XM5 Kulaklık',
    specs: 'Gürültü Engelleyici, 30 saat pil, Bluetooth 5.2',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format',
    prices: { '3 Ay': 900, '6 Ay': 800, '12 Ay': 720 },
    defaultDuration: '12 Ay',
    badge: '%15 İndirim',
    sale: true,
    stars: 5
  },
  {
    id: 10,
    brand: 'Dyson',
    name: 'Dyson Airwrap Multi-Styler',
    specs: 'Çok fonksiyonlu saç şekillendirici, 6 ek parça',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&auto=format',
    prices: { '3 Ay': 1100, '6 Ay': 1000, '12 Ay': 880 },
    defaultDuration: '12 Ay',
    badge: '%10 İndirim',
    sale: true,
    stars: 5
  },
  {
    id: 11,
    brand: 'Xiaomi',
    name: 'Xiaomi Air Purifier 4 Pro',
    specs: '500 m³/h CADR, HEPA H13, Akıllı Kontrol',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&auto=format',
    prices: { '3 Ay': 650, '6 Ay': 580, '12 Ay': 520 },
    defaultDuration: '12 Ay',
    badge: '%25 İndirim',
    sale: true,
    stars: 4
  }
]

const initialSelectedDurations = products.reduce((acc, product) => {
  acc[product.id] = product.defaultDuration
  return acc
}, {})


function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "12px 24px", borderRadius: 50, fontSize: 13, fontWeight: 600, zIndex: 99, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#4CAF50" }}>✓</span> {msg}
    </div>
  );
}

function App() {
  const [wishlist, setWishlist] = useState(new Set())
  const [selectedDurations, setSelectedDurations] = useState(initialSelectedDurations)
  const [cartCount, setCartCount] = useState(2)
  const [modalProduct, setModalProduct] = useState(null)
  const [isCatsDropdownOpen, setIsCatsDropdownOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const catSliderRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleDocumentClick = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCatsDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])
  console.log({toastMessage})
  useEffect(() => {
    if (!toastMessage) return undefined
    const timeout = window.setTimeout(() => setToastMessage(''), 2500)
    return () => window.clearTimeout(timeout)
  }, [toastMessage])

  const newProducts = products.filter(product => !product.sale).slice(0, 4)
  const saleProducts = products.filter(product => product.sale)

  const toggleWish = id => {
    setWishlist(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectDuration = (id, duration) => {
    setSelectedDurations(prev => ({
      ...prev,
      [id]: duration
    }))
  }

  const openModal = product => {
    setModalProduct(product)
  }

  const closeModal = () => {
    setModalProduct(null)
  }

  const handleRent = product => {
    setCartCount(prev => prev + 1)
    closeModal()
    setToastMessage(`${product.name} sepete eklendi!`)
  }

  const scrollCat = offset => {
    catSliderRef.current?.scrollBy({ left: offset, behavior: 'smooth' })
  }

  const renderStars = stars =>
    Array.from({ length: 5 }, (_, index) => (
      <span key={index}>{index < stars ? '★' : '☆'}</span>
    ))

  const ProductCard = ({ product }) => {

    const selectedDuration = selectedDurations[product.id] || product.defaultDuration
    const price = product.prices[selectedDuration]
    const isWished = wishlist.has(product.id)

    return (
      <div className="product-card" onClick={() => openModal(product)}>
        <span className={`product-badge ${product.sale ? 'sale' : ''}`}>{product.badge}</span>
        <button
          type="button"
          className={`product-wish ${isWished ? 'active' : ''}`}
          onClick={event => {
            event.stopPropagation()
            toggleWish(product.id)
          }}
        >
          <i className={`fa${isWished ? 's' : 'r'} fa-heart`} />
        </button>

        <div className="product-img-wrap">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>

        <div className="product-info">
          <div className="product-brand">{product.brand}</div>
          <div className="product-name">{product.name}</div>
          <div className="product-specs">{product.specs}</div>

          <div className="duration-pills">
            {Object.keys(product.prices).map(duration => (
              <button
                key={duration}
                type="button"
                className={`pill ${duration === selectedDuration ? 'active' : ''}`}
                onClick={event => {
                  event.stopPropagation()
                  selectDuration(product.id, duration)
                }}
              >
                {duration}
              </button>
            ))}
          </div>

          <div className="product-price">
            {price.toLocaleString('tr-TR')} TL <span>/ Aylık ödenecek tutar</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
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
            <button type="button" className="icon-btn">
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

      <nav className="main-nav" style={{fontFamily: "'Outfit', sans-serif"}}>
        <div className="nav-inner">
          <div>
            <button
              type="button"
              className="all-cats-btn"
              onClick={event => {
                event.stopPropagation()
                setIsCatsDropdownOpen(prev => !prev)
              }}
            >
              <i className="fas fa-th-large" /> TÜM KATEGORİLER
            </button>
          </div>
          <div>
            <a href="/products?category=telefon-aksesuarlari">Telefon &amp; Aksesuarları</a>
            <a href="/products?category=bilgisayar-tablet">Bilgisayar &amp; Tablet</a>
            <a href="/products?category=ev-ofis">Ev &amp; Ofis</a>
            <a href="/products?category=oyun-konsolu-vr">Oyun Konsolu &amp; VR</a>
            <span className="nav-sep">|</span>
            <a href="/products?category=indirimli-urunler">İndirimli Ürünler</a>
            <a href="/how-it-works">Nasıl Çalışır?</a>
          </div>
        </div>
      </nav>

      <div className={`cats-dropdown ${isCatsDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
        <div className="cats-grid">
          <a href="/products" className="all-cats-link">
            <i className="fas fa-th" /> Tüm Ürünler
          </a>
          <a href="/products?category=telefon-aksesuarlari">
            <i className="fas fa-mobile-alt" /> Telefon &amp; Aksesuarları
          </a>
          <a href="/products?category=bilgisayar-tablet">
            <i className="fas fa-laptop" /> Bilgisayar &amp; Tablet
          </a>
          <a href="/products?category=sağlık-spors">
            <i className="fas fa-dumbbell" /> Sağlık &amp; Spor
          </a>
          <a href="/products?category=akıllı-ev-ofis">
            <i className="fas fa-home" /> Akıllı Ev &amp; Ofis
          </a>
          <a href="/products?category=kiralamobil">
            <i className="fas fa-car" /> Kiralamobil
          </a>
          <a href="/products?category=ses-müzik">
            <i className="fas fa-headphones" /> Ses &amp; Müzik
          </a>
          <a href="/products?category=kameralar">
            <i className="fas fa-camera" /> Kameralar
          </a>
          <a href="/products?category=saat">
            <i className="fas fa-clock" /> Saat
          </a>
          <a href="/products?category=oyun-konsolu-vr">
            <i className="fas fa-gamepad" /> Oyun Konsolu &amp; VR
          </a>
          <a href="/products?category=anne-bebek">
            <i className="fas fa-baby" /> Anne &amp; Bebek
          </a>
          <a href="/products?category=motosiklet">
            <i className="fas fa-motorcycle" /> Motosiklet
          </a>
          <a href="/products?category=kişisel-bakım">
            <i className="fas fa-spa" /> Kişisel Bakım
          </a>
        </div>
      </div>

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
          <div className="cat-card" onClick={() => {
            window.location.href = '/products?category=telefon-aksesuarlari'
          }}>
            <img src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&auto=format" alt="Telefon" />
            <p>Telefon</p>
          </div>
          <div className="cat-card" onClick={() => {
            window.location.href = '/products?category=bilgisayar-tablet'
          }}>
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format" alt="Bilgisayar & Tablet" />
            <p>Bilgisayar &amp; Tablet</p>
          </div>
          <div className="cat-card" onClick={() => {
            window.location.href = '/products?category=kameralar'
          }}>
            <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format" alt="Kameralar" />
            <p>Kameralar</p>
          </div>
          <div className="cat-card" onClick={() => {
            window.location.href = '/products?category=oyun-konsolu-vr'
          }}>
            <img src="https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?w=200&auto=format" alt="Oyun Konsolu & VR" />
            <p>Oyun Konsolu &amp; VR</p>
          </div>
          <div className="cat-card" onClick={() => {
            window.location.href = '/products?category=ses-müzik'
          }}>
            <img src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&auto=format" alt="Ses & Müzik" />
            <p>Ses &amp; Müzik</p>
          </div>
          <div className="cat-card" onClick={() => {
            window.location.href = '/products?category=saat'
          }}>
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format" alt="Saat" />
            <p>Saat</p>
          </div>
          <div className="cat-card" onClick={() => {
            window.location.href = '/products?category=saat'
          }}>
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format" alt="Saat" />
            <p>Saat</p>
          </div>
          <div className="cat-card" onClick={() => {
            window.location.href = '/products?category=saat'
          }}>
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format" alt="Saat" />
            <p>Saat</p>
          </div>
          <div className="cat-card" onClick={() => {
            window.location.href = '/products?category=saat'
          }}>
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format" alt="Saat" />
            <p>Saat</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Son Eklenen Ürünler</h2>
          <a href="#" className="see-all-btn">
            Tümünü Gör
          </a>
        </div>
        <div className="products-grid">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section section-gray">
        <div className="section-header">
          <h2>İndirimli Ürünler</h2>
          <a href="#" className="see-all-btn">
            Tümünü Gör
          </a>
        </div>
        <div className="products-grid">
          {saleProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="how-section">
        <h2>Nasıl Çalışır?</h2>
        <div className="how-steps">
          <div className="how-step">
            <div className="step-icon">
              <i className="fas fa-search" />
            </div>
            <h3>Ürün Seç</h3>
            <p>Binlerce ürün arasından ihtiyacına uygun olanı bul</p>
          </div>
          <div className="how-step">
            <div className="step-icon">
              <i className="fas fa-calendar-alt" />
            </div>
            <h3>Süre Belirle</h3>
            <p>3, 6, 12 veya 24 aylık kira süresi seç</p>
          </div>
          <div className="how-step">
            <div className="step-icon">
              <i className="fas fa-truck" />
            </div>
            <h3>Kapına Gelsin</h3>
            <p>Ücretsiz kargo ile 1-5 iş günü içinde teslim</p>
          </div>
          <div className="how-step">
            <div className="step-icon">
              <i className="fas fa-redo" />
            </div>
            <h3>İade Et veya Al</h3>
            <p>Süre bitince iade et ya da satın alma opsiyonunu kullan</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">+</span>lendmate
            </div>
            <p>
              Türkiye'nin en büyük ürün kiralama platformu. Teknoloji, mobilya,
              araç ve daha fazlası için doğru adres.
            </p>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-instagram" />
              </a>
              <a href="#">
                <i className="fab fa-twitter" />
              </a>
              <a href="#">
                <i className="fab fa-linkedin" />
              </a>
              <a href="#">
                <i className="fab fa-youtube" />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Kategoriler</h4>
            <a href="#">Telefon &amp; Aksesuarları</a>
            <a href="#">Bilgisayar &amp; Tablet</a>
            <a href="#">Kameralar</a>
            <a href="#">Oyun Konsolu &amp; VR</a>
            <a href="#">Ses &amp; Müzik</a>
            <a href="#">Saat</a>
          </div>
          <div className="footer-col">
            <h4>Şirket</h4>
            <a href="#">Hakkımızda</a>
            <a href="#">Nasıl Çalışır?</a>
            <a href="#">Kampanyalar</a>
            <a href="#">Kurumsal</a>
            <a href="#">Blog</a>
            <a href="#">Kariyer</a>
          </div>
          <div className="footer-col">
            <h4>Destek</h4>
            <a href="#">SSS</a>
            <a href="#">İletişim</a>
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Kullanım Koşulları</a>
            <a href="#">KVKK</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Lendmate. Tüm hakları saklıdır.</p>
        </div>
      </footer>

      {modalProduct && (
        <div className="modal-overlay open" onClick={event => event.target === event.currentTarget && closeModal()}>
          <div className="modal" id="productModal">
            <button type="button" className="modal-close" onClick={closeModal}>
              <i className="fas fa-times" />
            </button>
            <div className="modal-content">
              <div className="modal-images">
                <img className="modal-main-img" src={modalProduct.image} alt={modalProduct.name} />
                <div className="modal-thumbs">
                  <img className="modal-thumb active" src={modalProduct.image} alt="thumb" />
                </div>
              </div>
              <div className="modal-details">
                <div className="modal-stars">{renderStars(modalProduct.stars)}</div>
                <div className="modal-brand">{modalProduct.brand}</div>
                <h2 className="modal-title">{modalProduct.name}</h2>
                <div className="modal-specs">{modalProduct.specs}</div>
                <div className="modal-price-row">
                  <span className="modal-price">
                    {modalProduct.prices[selectedDurations[modalProduct.id]].toLocaleString('tr-TR')} TL
                  </span>
                  <span className="modal-price-label">/ Aylık ödenecek tutar</span>
                </div>
                <div className="modal-duration-pills">
                  {Object.keys(modalProduct.prices).map(duration => (
                    <button
                      key={duration}
                      type="button"
                      className={`pill ${duration === selectedDurations[modalProduct.id] ? 'active' : ''}`}
                      onClick={() => selectDuration(modalProduct.id, duration)}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
                <div className="modal-badges">
                  <div className="modal-badge-row">
                    <i className="fas fa-shield-alt" /> Hasar Onarım Garantisi
                  </div>
                  <div className="modal-badge-row">
                    <i className="fas fa-shopping-bag" /> Satın Alma Opsiyonu
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

      <Toast msg={toastMessage} />
    </>
  )
}

export default App
