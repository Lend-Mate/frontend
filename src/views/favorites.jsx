import { useState, useEffect, useRef } from "react";

// ============================
// DATA
// ============================

const BRANDS = ["Apple", "DJI", "General Mobile", "Oppo", "Reeder", "Samsung", "Xiaomi"];


const PRODUCTS = [
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
];

// ============================
// STYLES (inline — no external CSS needed)
// ============================
const s = {
  page: { display: "flex", gap: 0, minHeight: "100vh", maxWidth: 1100, margin: "0 auto", padding: "0 16px", fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", color: "#111" },
  sidebar: { width: 220, flexShrink: 0, padding: "20px 16px 20px 0" },
  sidebarMenu: { background: "#fff", borderRadius: 10, border: "1px solid #eee", overflow: "hidden", marginBottom: 16 },
  sidebarItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", borderLeft: active ? "3px solid #4CAF50" : "3px solid transparent", color: active ? "#4CAF50" : "#111", background: active ? "#f0faf0" : "transparent" }),
  sidebarIcon: { width: 28, height: 28, background: "#f5f5f5", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 },
  filterBox: { background: "#fff", borderRadius: 10, border: "1px solid #eee", padding: 16, marginBottom: 12 },
  filterTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#111" },
  filterItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#444", marginBottom: 8, cursor: "pointer" },
  moreBtn: { border: "1px solid #ddd", background: "none", padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", color: "#555", marginTop: 4, fontFamily: "inherit" },
  main: { flex: 1, padding: "20px 0" },
  subCats: { display: "flex", gap: 12, marginBottom: 20, overflowX: "auto", paddingBottom: 4 },
  subCat: { flexShrink: 0, background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "12px 16px", textAlign: "center", cursor: "pointer", minWidth: 130, transition: "all .15s" },
  subCatImg: { width: 80, height: 60, objectFit: "contain", margin: "0 auto 8px", display: "block" },
  subCatLabel: { fontSize: 12, fontWeight: 600, color: "#111" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  viewBtns: { display: "flex", gap: 4 },
  viewBtn: (active) => ({ background: "#fff", border: active ? "1.5px solid #4CAF50" : "1px solid #ddd", borderRadius: 6, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: active ? "#4CAF50" : "#555" }),
  sortSelect: { border: "1px solid #ddd", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#fff" },
  productsGrid: (list) => ({ display: "grid", gridTemplateColumns: list ? "1fr" : "repeat(3, 1fr)", gap: 14 }),
  productCard: { background: "#fff", borderRadius: 12, border: "1.5px solid #eee", overflow: "hidden", cursor: "pointer", transition: "all .18s", position: "relative" },
  wishBtn: (on) => ({ position: "absolute", top: 10, right: 10, background: "#fff", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,.12)", fontSize: 14, color: on ? "#e53935" : "#aaa" }),
  prodImg: { height: 160, background: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  prodImgEl: { width: "100%", height: "100%", objectFit: "contain" },
  prodInfo: { padding: 14 },
  prodBrand: { fontSize: 11, fontWeight: 700, color: "#4CAF50", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 3 },
  prodName: { fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.3, marginBottom: 4 },
  prodSpecs: { fontSize: 11, color: "#888", marginBottom: 12, minHeight: 28 },
  durPills: { display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 },
  durPill: (active) => ({ fontSize: 10, fontWeight: 600, padding: "4px 9px", borderRadius: 20, border: active ? "1.5px solid #4CAF50" : "1.5px solid #ddd", cursor: "pointer", color: active ? "#4CAF50" : "#777", background: active ? "#f0faf0" : "#fff", fontFamily: "inherit" }),
  prodPrice: { fontSize: 16, fontWeight: 800, color: "#111" },
  prodPriceSmall: { fontSize: 10, fontWeight: 400, color: "#888" },
  rentBtn: { display: "block", width: "100%", background: "#4CAF50", color: "#fff", fontWeight: 700, fontSize: 13, padding: 10, border: "none", borderRadius: 8, cursor: "pointer", marginTop: 10, fontFamily: "inherit" }
};

// ============================
// COMPONENTS
// ============================

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "12px 24px", borderRadius: 50, fontSize: 13, fontWeight: 600, zIndex: 99, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#4CAF50" }}>✓</span> {msg}
    </div>
  );
}

function Sidebar({ checkedBrands, onBrandToggle }) {
  const sidebarItems = [
    { label: "Telefon & Aksesuarları", icon: "📱", active: true },
    { label: "Telefonlar", icon: "📞", active: false },
    { label: "Telefon Aksesuarları", icon: "🔌", active: false },
  ];

  return (
    <aside style={s.sidebar}>

      <div style={s.filterBox}>
        <div style={s.filterTitle}>Markalar</div>
        {BRANDS.map((brand) => (
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
        <button style={s.moreBtn}>Daha Fazla</button>
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
        {["1 Ay", "3 Ay", "6 Ay", "12 Ay", "24 Ay"].map((dur) => (
          <label key={dur} style={s.filterItem}>
            <input type="checkbox" style={{ accentColor: "#4CAF50", width: 15, height: 15, cursor: "pointer" }} />
            {dur}
          </label>
        ))}
      </div>
    </aside>
  );
}

// ============================
// MAIN PAGE COMPONENT
// ============================

const initialSelectedDurations = PRODUCTS.reduce((acc, product) => {
  acc[product.id] = product.defaultDuration
  return acc
}, {})

export default function Favorites() {
  const [cartCount, setCartCount] = useState(2)
  const [selectedDurations, setSelectedDurations] = useState(initialSelectedDurations)
  const [wishlist, setWishlist] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [checkedBrands, setCheckedBrands] = useState(new Set());
  const [toast, setToast] = useState("");
  const [modalProduct, setModalProduct] = useState(null)
  const [isCatsDropdownOpen, setIsCatsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectDuration = (id, duration) => {
    setSelectedDurations(prev => ({
      ...prev,
      [id]: duration
    }))
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

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

  const openModal = product => {
    setModalProduct(product)
  }

  const closeModal = () => {
    setModalProduct(null)
  }

  const renderStars = stars =>
    Array.from({ length: 5 }, (_, index) => (
      <span key={index}>{index < stars ? '★' : '☆'}</span>
  ))

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

  function handleWish(id) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleDurChange(id, dur) {
    setSelectedDurations((prev) => ({ ...prev, [id]: dur }));
  }

  function handleBrandToggle(brand) {
    setCheckedBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  }

  const handleRent = product => {
    setCartCount(prev => prev + 1)
    closeModal()
    showToast(`${product.name} sepete eklendi!`)
  }

  let products = [...PRODUCTS];
  if (checkedBrands.size > 0) products = products.filter((p) => checkedBrands.has(p.brand));
  if (sortBy === "asc") products.sort((a, b) => (a.prices[selectedDurations[a.id]] ?? 0) - (b.prices[selectedDurations[b.id]] ?? 0));
  if (sortBy === "desc") products.sort((a, b) => (b.prices[selectedDurations[b.id]] ?? 0) - (a.prices[selectedDurations[a.id]] ?? 0));

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", minHeight: "100vh" }}>

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

      <div style={s.page}>
        
        <main style={s.main}>

          <div>
            <h1 style={{ marginTop: "0px", fontSize: "1.9rem", fontWeight: 600, color: "#111827", marginBottom: "18px", letterSpacing: "-0.01em "}}>
              Favorilerim
            </h1>
          </div>

          {/* Product Grid */}
          <div style={s.productsGrid(viewMode === "list")}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#888", fontSize: 14 }}>
              Seçilen filtrelere göre ürün bulunamadı.
            </div>
          )}
        </main>
      </div>

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

      <Toast msg={toast} />
    </div>
  );
}