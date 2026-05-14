import { useState, useRef } from "react";
import "./shopping_cart_css.css";

// ── İkonlar ──────────────────────────────────────────────
const IconClock = () => (
  <img
    src="https://static.vecteezy.com/system/resources/previews/019/923/749/non_2x/clock-face-icon-black-and-white-transparent-background-free-png.png"
    alt="Saat İkonu"
    style={{position: "fixed", marginLeft: "10px", marginTop: "12px"}}
    width="18"
    height="18"
  />
);

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chevron-icon">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 5v4h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconGift = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" rx="1" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

// ── Başlangıç verisi ──────────────────────────────────────
const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Logitech Driving Force 6 Konumlu H Modeli Vites",
    desc: "PS5, PS4 ve Bilgisayar uyumlu",
    emoji: "🕹️",
    price: 255,
    period: "12",
    color: "Siyah",
  },
  {
    id: 2,
    name: "Jbl Wave 200TWS Kulaklık",
    desc: "Kulak içi kulaklık, Mikrofonlu, 5.0 Bluetooth, IPX2 Suya Dayanıklı",
    emoji: "🎧",
    price: 140,
    period: "3",
    color: "Siyah",
  },
  {
    id: 3,
    name: "Apple iPhone 13 128GB",
    desc: "6.1 inç, A15 Bionic, 5G, Çift Kamera, 4 GB Ram",
    emoji: "📱",
    price: 1818,
    period: "12",
    color: "Siyah",
  },
];

const PERIODS = ["3", "6", "12", "24"];
const COLORS = ["Siyah", "Beyaz", "Mavi", "Kırmızı", "Yeşil"];
const COLOR_MAP = {
  Siyah: "#1a1a1a",
  Beyaz: "#e5e7eb",
  Mavi: "#3b82f6",
  Kırmızı: "#ef4444",
  Yeşil: "#22c55e",
};

// ── Alt bileşenler ────────────────────────────────────────
function CartItem({ item, onUpdate, onDelete }) {
  return (
    <div className="cart-item">
      {/* Üst satır: ürün bilgisi + fiyat */}
      <div className="cart-item-top">
        <div className="cart-item-img-placeholder">{item.emoji}</div>

        <div className="cart-item-details">
          <div className="cart-item-name">{item.name}</div>
          <div className="cart-item-desc">{item.desc}</div>
          <span className="delivery-badge">
            <IconTruck />
            1-5 İş Günü
          </span>
        </div>

        <div className="cart-item-price">
          <div className="price-amount">{item.price.toLocaleString("tr-TR")} TL</div>
          <div className="price-label">Aylık Tutar</div>
        </div>
      </div>

      {/* Alt satır: süre, renk, sil */}
      <div className="cart-item-controls">
        {/* Süre seçici */}
        <div className="select-wrapper">
          <span className="select-icon">
            <IconClock />
          </span>
          <select
            className="cart-select"
            value={item.period}
            onChange={(e) => onUpdate(item.id, "period", e.target.value)}
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p} Ay
              </option>
            ))}
          </select>
          <IconChevron />
        </div>

        {/* Renk seçici */}
        <div className="select-wrapper">
          <select
            className="cart-select"
            value={item.color}
            onChange={(e) => onUpdate(item.id, "color", e.target.value)}
            style={{ paddingLeft: "36px" }}
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {/* Renk noktası */}
          <span
            className="color-dot"
            style={{
              background: COLOR_MAP[item.color] || "#1a1a1a",
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <IconChevron />
        </div>

        {/* Sil butonu */}
        <button className="delete-btn" onClick={() => onDelete(item.id)} title="Kaldır">
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

function CartSummary({ items }) {
  const totalMonthly = items.reduce((s, i) => s + i.price, 0);
  // İlk ay ücreti: en pahalı ürünün 1 aylık fiyatının %22'si eklenmiş simülasyonu
  const firstMonth = Math.round(items.reduce((s, i) => s + i.price * 0.18, 0));
  const nextMonth = totalMonthly;

  return (
    <>
      {/* Kampanya kutusu */}
      <div className="campaign-box">
        <div className="campaign-icon">
          <IconGift />
        </div>
        <span className="campaign-label">Kampanya Seç</span>
        <span className="campaign-arrow">›</span>
      </div>

      {/* Özet kutusu */}
      <div className="summary-box">
        <div className="summary-title">Aylık Kira ({items.length})</div>

        <div className="summary-row">
          <span className="summary-row-label">İlk Ay Kiralama Ücreti</span>
          <span className="summary-row-value">{firstMonth.toLocaleString("tr-TR")} TL</span>
        </div>

        <div className="summary-row">
          <span className="summary-row-label">Aylık Kiralama Ücreti</span>
          <span className="summary-row-value">
            {nextMonth.toLocaleString("tr-TR")} TL / Ay
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-row-label">Kargo</span>
          <span className="summary-row-value" style={{ color: "var(--green)" }}>
            Ücretsiz
          </span>
        </div>

        <div className="summary-divider" />

        <div className="summary-total-label">Vergiler Dahil Toplam:</div>
        <div className="summary-total-amount">
          {firstMonth.toLocaleString("tr-TR")}.00 TL
          <sup>/ Ay</sup>
        </div>

        <div className="summary-next-label">Gelecek Ay Ödenecek Tutar:</div>
        <div className="summary-next-amount">
          {nextMonth.toLocaleString("tr-TR")}.00 TL
          <sup>/ Ay</sup>
        </div>
      </div>
    </>
  );
}

// ── Ana bileşen ───────────────────────────────────────────
export default function ShoppingCart() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [wishlist, setWishlist] = useState(new Set())
  const [cartCount, setCartCount] = useState(0)
  const [isCatsDropdownOpen, setIsCatsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const catSliderRef = useRef(null)

  const handleUpdate = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="cart-page">

      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            <span className="logo-icon">+</span>lendmate
          </a>
          <div className="search-bar">
            <i className="fas fa-search" />
            <input type="text" placeholder="Marka, ürün veya kategori ara" />
          </div>
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

      
      <main className="cart-content">
        <h1 className="cart-title">
          Sepetim ({items.length} ürün)
        </h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Sepetiniz boş</h2>
          <p>Ürün ekleyerek kiralamaya başlayın.</p>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Sol: ürünler */}
          <div className="cart-items">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Sağ: özet + ödeme */}
          <div className="cart-sidebar">
            <CartSummary items={items} />
            <button className="checkout-btn">Sepeti Onayla</button>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}