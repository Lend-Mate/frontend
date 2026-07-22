import { useState, useEffect } from "react";
import Header from "../components/Header";
import "./shopping_cart_css.css";
import { deleteCart, getCartsByUser, createOrder } from "../services/order-service";
import { getOwnerIdFromToken } from "../services/auth-service";
import { IMAGE_PREFIX } from "../constants";
import Toast from "../components/Toast";

// ── İkonlar ───────────────────────────────────────────────
const IconClock = () => (
  <img
    src="https://static.vecteezy.com/system/resources/previews/019/923/749/non_2x/clock-face-icon-black-and-white-transparent-background-free-png.png"
    alt="Saat İkonu"
    style={{ position: "fixed", marginLeft: "10px", marginTop: "12px" }}
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

const PERIOD_MAP = {
  THREE_MONTH: { label: "3 Ay", months: 3 },
  SIX_MONTH: { label: "6 Ay", months: 6 },
  NINE_MONTH: { label: "9 Ay", months: 9 },
  TWELVE_MONTH: { label: "12 Ay", months: 12 },
};

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
  const { product, quantity = 1 } = item;

  if (!product) return null;

  const availablePeriods = product.rentalPeriodPrices
    ? Object.keys(product.rentalPeriodPrices)
    : [];

  const currentPrice = item.period && product.rentalPeriodPrices?.[item.period]
    ? product.rentalPeriodPrices[item.period]
    : product.price;

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdate(item.id, "quantity", quantity - 1);
    } else {
      onDelete(item.id);
    }
  };

  const handleIncrease = () => {
    onUpdate(item.id, "quantity", quantity + 1);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-top">
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
            {Number(currentPrice * quantity).toLocaleString("tr-TR")} {product.currency || "TL"}
          </div>
          <div className="price-label">
            {quantity > 1 ? `${quantity} x ${Number(currentPrice).toLocaleString("tr-TR")} TL / Ay` : "Aylık Tutar"}
          </div>
        </div>
      </div>

      <div className="cart-item-controls">
        {/* Adet Arttırma / Azaltma Sayacı */}
        <div className="quantity-control" style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #ccc", borderRadius: "6px", padding: "4px 8px" }}>
          <button
            onClick={handleDecrease}
            style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "16px", padding: "0 6px" }}
          >
            -
          </button>
          <span style={{ fontWeight: "600", minWidth: "20px", textAlign: "center" }}>{quantity}</span>
          <button
            onClick={handleIncrease}
            style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "16px", padding: "0 6px" }}
          >
            +
          </button>
        </div>

        {/* Periyot Seçici */}
        <div className="select-wrapper">
          <span className="select-icon">
            <IconClock />
          </span>
          <select
            className="cart-select"
            value={item.period}
            onChange={(e) => onUpdate(item.id, "period", e.target.value)}
          >
            {availablePeriods.length > 0 ? (
              availablePeriods.map((p) => (
                <option key={p} value={p}>
                  {PERIOD_MAP[p]?.label || p}
                </option>
              ))
            ) : (
              <option value="">Aylık Kiralama</option>
            )}
          </select>
          <IconChevron />
        </div>

        {/* Renk Seçici */}
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

        <button className="delete-btn" onClick={() => onDelete(item.id)} title="Kaldır">
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

// ── Alt Bileşen: CartSummary ────────────────────────────────
function CartSummary({ items }) {
  const totalMonthly = items.reduce((total, item) => {
    const price = item.period && item.product?.rentalPeriodPrices?.[item.period]
      ? item.product.rentalPeriodPrices[item.period]
      : Number(item.product?.price) || 0;
    const qty = item.quantity || 1;
    return total + Number(price) * qty;
  }, 0);

  const totalItemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const firstMonth = totalMonthly;
  const nextMonth = totalMonthly;

  return (
    <>
      <div className="campaign-box">
        <div className="campaign-icon">
          <IconGift />
        </div>
        <span className="campaign-label">Kampanya Seç</span>
        <span className="coming-soon-badge" style={{ marginLeft: "6px" }}>
          Yakında
        </span>
        <span className="campaign-arrow">›</span>
      </div>

      <div className="summary-box">
        <div className="summary-title">Aylık Kira ({totalItemCount} ürün)</div>

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
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const userId = getOwnerIdFromToken();
        const data = await getCartsByUser(userId);

        // Sepette aynı ürünler geliyorsa bunları miktar (quantity) olarak birleştiriyoruz
        const groupedMap = new Map();

        data.forEach((cartItem) => {
          const availablePeriods = cartItem.product?.rentalPeriodPrices
            ? Object.keys(cartItem.product.rentalPeriodPrices)
            : [];

          const period = availablePeriods[0] || "";
          const color = "Siyah";
          const key = `${cartItem.product?.id}_${period}_${color}`;

          if (groupedMap.has(key)) {
            const existing = groupedMap.get(key);
            existing.quantity += 1;
          } else {
            groupedMap.set(key, {
              ...cartItem,
              period,
              color,
              quantity: cartItem.quantity || 1,
            });
          }
        });

        setItems(Array.from(groupedMap.values()));
      } catch (err) {
        console.error("Sepet yüklenirken hata oluştu:", err);
        setError("Sepetiniz yüklenemedi. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleUpdate = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCart(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Ürün sepetten silinemedi:", err);
      alert("Ürün silinirken bir hata oluştu.");
    }
  };

  const createOrderFunction = async () => {
    try {
      const now = new Date();
      const startDate = now.toISOString();

      const orderProp = {
        userId: getOwnerIdFromToken(),
        description: "Sepet Onayı",
        status: "PENDING",
        totalPrice: items.reduce((s, i) => {
          const price = i.period && i.product?.rentalPeriodPrices?.[i.period]
            ? i.product.rentalPeriodPrices[i.period]
            : Number(i.product?.price) || 0;
          return s + Number(price) * (i.quantity || 1);
        }, 0),
        items: items.map((item) => {
          const unitPrice = item.period && item.product?.rentalPeriodPrices?.[item.period]
            ? item.product.rentalPeriodPrices[item.period]
            : item.product?.price;

          const monthsToAdd = PERIOD_MAP[item.period]?.months || 1;

          const endDateObj = new Date(now);
          endDateObj.setMonth(endDateObj.getMonth() + monthsToAdd);

          return {
            productId: item.product.id,
            quantity: item.quantity || 1,
            unitPrice: unitPrice,
            startDate: startDate,
            endDate: endDateObj.toISOString(),
          };
        }),
        addressId: 1,
      };

      await createOrder(orderProp);

      handleToast("Siparişiniz başarıyla oluşturuldu!");
      setItems([]);
    } catch (err) {
      console.error("Sipariş oluşturulamadı:", err);
      handleToast("Sipariş oluşturulurken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="cart-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>Sepetiniz Yükleniyor...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  const totalItemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="cart-page">
      <Header categories={[]} wishlistCount={wishlist.size} cartCount={totalItemCount} />

      <main className="cart-content">
        <h1 className="cart-title">Sepetim ({totalItemCount} ürün)</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Sepetiniz boş</h2>
            <p>Ürün ekleyerek kiralamaya başlayın.</p>
          </div>
        ) : (
          <div className="cart-layout">
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

            <div className="cart-sidebar">
              <CartSummary items={items} />
              <button className="checkout-btn" onClick={() => createOrderFunction()}>
                Sepeti Onayla
              </button>
            </div>
          </div>
        )}

        <Toast msg={toastMessage} />
      </main>
    </div>
  );
}