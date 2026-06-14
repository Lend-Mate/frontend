import { useState, useEffect } from "react";
import Header from "../components/Header";
import "./shopping_cart_css.css";
import { deleteCart, getCartsByUser } from "../services/order-service";
import { getOwnerIdFromToken } from "../services/auth-service";
import { IMAGE_PREFIX } from "../constants";

// ── İkonlar (Aynı Kalıyor) ────────────────────────────────
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

const PERIODS = ["3", "6", "12", "24"];
const COLORS = ["Siyah", "Beyaz", "Mavi", "Kırmızı", "Yeşil"];
const COLOR_MAP = {
  Siyah: "#1a1a1a",
  Beyaz: "#e5e7eb",
  Mavi: "#3b82f6",
  Kırmızı: "#ef4444",
  Yeşil: "#22c55e",
};

// Resim URL'ini güvenli şekilde çözen yardımcı fonksiyon
const getImageUrl = (images) => {
  if (!images || images.length === 0) return "https://via.placeholder.com/150";
  const primaryImg = images.find((img) => img.isPrimary);
  return primaryImg ? primaryImg.imageUrl : images[0].imageUrl;
};

// ── Alt Bileşen: CartItem ──────────────────────────────────
function CartItem({ item, onUpdate, onDelete }) {
  const { product } = item; // Backend'den gelen CartResponse içindeki ProductResponse

  if (!product) return null;

  return (
    <div className="cart-item">
      <div className="cart-item-top">
        {/* Emoji yerine ürüne ait gerçek resmi gösteriyoruz */}
        <div className="cart-item-img-container">
          <img 
            src={IMAGE_PREFIX + getImageUrl(product.images)} 
            alt={product.productName} 
            style={{ width: "120px", height: "120px", objectFit: "contain" }}
          />
        </div>

        <div className="cart-item-details">
          <div className="cart-item-name">{product.productName}</div>
          <div className="cart-item-desc">{product.description}</div>
          <span className="delivery-badge">
            <IconTruck />
            1-5 İş Günü
          </span>
        </div>

        <div className="cart-item-price">
          <div className="price-amount">
            {Number(product.price).toLocaleString("tr-TR")} {product.currency || "TL"}
          </div>
          <div className="price-label">Günlük Tutar</div>
        </div>
      </div>

      <div className="cart-item-controls">
        {/* Süre seçici */}
        <div className="select-wrapper">
          <span className="select-icon">
            <IconClock />
          </span>
          <select
            className="cart-select"
            value={item.period || "3"}
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
            value={item.color || "Siyah"}
            onChange={(e) => onUpdate(item.id, "color", e.target.value)}
            style={{ paddingLeft: "36px" }}
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span
            className="color-dot"
            style={{
              background: COLOR_MAP[item.color || "Siyah"],
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <IconChevron />
        </div>

        {/* Sil butonu (Backend Sepet ID'sini gönderir) */}
        <button className="delete-btn" onClick={() => onDelete(item.id)} title="Kaldır">
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

// ── Alt Bileşen: CartSummary ────────────────────────────────
function CartSummary({ items }) {
  // Fiyat hesaplamaları backend'den gelen güncellenmiş nesne yapısına göre uyarlandı
  const totalMonthly = items.reduce((s, i) => s + (Number(i.product?.price) || 0), 0);
  const firstMonth = Math.round(items.reduce((s, i) => s + (Number(i.product?.price) || 0) * 0.18, 0));
  const nextMonth = totalMonthly;

  return (
    <>
      <div className="campaign-box">
        <div className="campaign-icon">
          <IconGift />
        </div>
        <span className="campaign-label">Kampanya Seç</span>
        <span className="campaign-arrow">›</span>
      </div>

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

// ── Ana Bileşen: ShoppingCart ──────────────────────────────
export default function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist] = useState(new Set());

  // Component mount edildiğinde API'den sepet verisini çekiyoruz
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const userId = getOwnerIdFromToken();
        const data = await getCartsByUser(userId);
        
        // Gelen veriye arayüzün ihtiyaç duyduğu default period ve color değerlerini iliştiriyoruz
        const formattedData = data.map(cartItem => ({
          ...cartItem,
          period: "3",  // Default UI değeri
          color: "Siyah" // Default UI değeri
        }));

        setItems(formattedData);
      } catch (err) {
        console.error("Sepet yüklenirken hata oluştu:", err);
        setError("Sepetiniz yüklenemedi. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // UI üzerindeki geçici renk ve süre güncellemeleri için
  const handleUpdate = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Backend entegrasyonlu silme fonksiyonu
  const handleDelete = async (id) => {
    try {
      await deleteCart(id); // Backend'den sil
      setItems((prev) => prev.filter((item) => item.id !== id)); // UI state'inden sil
    } catch (err) {
      console.error("Ürün sepetten silinemedi:", err);
      alert("Ürün silinirken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="cart-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Sepetiniz Yükleniyor...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header categories={[]} wishlistCount={wishlist.size} cartCount={items.length} />

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
            {/* Sol: Dinamik Ürünler */}
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

            {/* Sağ: Özet ve Onay */}
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