import { useEffect, useState } from "react";
import "./product_detail.css";
import Header from "../components/Header";
import { getProductById } from "../services/product-service";
import { IMAGE_PREFIX } from "../constants";
import { addFavourite } from "../services/favourite-service";
import { getOwnerIdFromToken } from "../services/auth-service";
import Toast from "../components/Toast";
import { addToCart } from "../services/order-service";

/* ── Yardımcı Yıldız Bileşeni ──────────────────── */
function Stars({ rating }) {
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`star ${s <= Math.round(rating) ? "" : "empty"}`}>
          {s <= Math.round(rating) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

/* ── Avatar Renk Seçici Yardımcı Fonksiyonu ────── */
const getAvatarColor = (userId) => {
  const colors = ["#3ac267", "#7c6fcd", "#e07c3a", "#e03a6e", "#3a9be0"];
  return colors[userId % colors.length];
};

/* ── Tarih Formatlayıcı ────────────────────────── */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* ── Kiralama Dönemi Haritası ────── */
const PERIOD_MAP = {
  ONE_MONTH: { label: "1 Ay", months: 1 },
  THREE_MONTH: { label: "3 Ay", months: 3 },
  SIX_MONTH: { label: "6 Ay", months: 6 },
  NINE_MONTH: { label: "9 Ay", months: 9 },
  TWELVE_MONTH: { label: "12 Ay", months: 12 },
};

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [isRented, setIsRented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [isWished, setIsWished] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");

  // Veri çekme
  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      getProductById(productId)
        .then((data) => {
          setProduct(data);
          setIsRented(data.stockQuantity === 0);

          // İlk mevcut periyodu seçili hale getir
          if (data.rentalPeriodPrices) {
            const periods = Object.keys(data.rentalPeriodPrices);
            if (periods.length > 0) {
              setSelectedPeriod(periods[0]);
            }
          }

          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Veri çekilirken hata oluştu:", err);
          setIsLoading(false);
        });
    }
  }, [productId]);

  const handleRent = (product) => {
    setCartCount((prev) => prev + 1);
    showToast(`${product.productName} sepete eklendi!`);
    const userId = getOwnerIdFromToken();
    addToCart({ productId: product.id, userId }).catch((err) => {
      console.error("Sepete ürün eklenirken bir hata oluştu:", err);
      showToast("Ürün sepette eklenirken bir hata oluştu.");
    });
  };

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Yükleniyor...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Ürün bulunamadı.</div>;
  }

  // API'den gelen yorumlar
  const comments = product.comments || [];
  const totalReviews = comments.length;

  // Dinamik puan dağılımı hesaplama
  const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRatingSum = 0;

  comments.forEach((c) => {
    if (ratingDist[c.rating] !== undefined) {
      ratingDist[c.rating] += 1;
    }
    totalRatingSum += c.rating;
  });

  // Seçili dönemin fiyatı
  const currentPrice =
    selectedPeriod && product.rentalPeriodPrices?.[selectedPeriod]
      ? product.rentalPeriodPrices[selectedPeriod]
      : product.price;

  // Kiralama seçenekleri dizisi
  const availablePeriods = product.rentalPeriodPrices
    ? Object.keys(product.rentalPeriodPrices)
    : [];

  const periodLabelsText = availablePeriods
    .map((p) => PERIOD_MAP[p]?.label || p)
    .join(", ");

  // ─── DİNAMİK ATTRIBUTES (ÖZELLİKLER) BAĞLAMA ─────────────────
  const apiAttributes = product.attributes || [];

  const allAttributes = [...apiAttributes];

  // Özellikleri iki eşit kolona bölüyoruz
  const midIndex = Math.ceil(allAttributes.length / 2);
  const specsLeft = allAttributes.slice(0, midIndex);
  const specsRight = allAttributes.slice(midIndex);

  // Görsel dizisini güvenli bir şekilde alma
  const productImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => IMAGE_PREFIX + img.imageUrl)
      : ["https://via.placeholder.com/512"];

  return (
    <div>
      <Header categories={[]} wishlistCount={0} cartCount={cartCount} />
      <div className="page">
        {/* ── Top card ── */}
        <div className="top-card">
          {/* Thumbnail rail */}
          <div className="thumb-rail">
            {productImages.map((src, i) => (
              <div
                key={i}
                className={`thumb ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={src} alt={`görsel-${i + 1}`} />
              </div>
            ))}
          </div>

          {/* Main image */}
          <div className="main-image">
            <img src={productImages[activeImg]} alt={product.productName} />
          </div>

          {/* Purchase panel */}
          <div className="purchase-panel">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "space-between",
                }}
              >
                <div className="product-title">{product.productName}</div>
                <button
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => {
                    setIsWished(!isWished);
                    addFavourite({ productId: product.id, userId: getOwnerIdFromToken() });
                  }}
                >
                  <i
                    className={`fa${isWished ? "s" : "r"} fa-heart`}
                    style={{ color: isWished ? "red" : "gray", fontSize: 20 }}
                  />
                </button>
              </div>
              <div className="brand-name">{product.brand}</div>
              <div className="product-specs">{product.description}</div>
            </div>

            <div className="price-block">
              <span className="price-amount">
                {Number(currentPrice).toLocaleString("tr-TR")} {product.currency}
              </span>
              <span className="price-label">/ Aylık ödenecek tutar</span>
            </div>

            {/* Period selector */}
            {availablePeriods.length > 0 && (
              <div className="period-selector">
                {availablePeriods.map((periodKey) => (
                  <button
                    key={periodKey}
                    className={`period-btn ${selectedPeriod === periodKey ? "active" : ""}`}
                    onClick={() => setSelectedPeriod(periodKey)}
                  >
                    {PERIOD_MAP[periodKey]?.label || periodKey}
                  </button>
                ))}
              </div>
            )}

            {/* Features */}
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">🛡️</div>
                Hasar Onarım Garantisi
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                Satın Alma Opsiyonu
              </div>
              <div className="feature-item">
                <div className="feature-icon">🚚</div>
                1-5 İş Günü Arasında Teslimat
              </div>
            </div>

            {/* CTA */}
            <button
              className={isRented ? "rent-btn-rented" : "rent-btn"}
              onClick={() => {
                if (isRented) {
                  return;
                }
                handleRent(product);
              }}
            >
              {isRented ? "Kiralandı" : "Sepete Ekle"}
            </button>
          </div>
        </div>

        {/* ── Ürün Özellikleri (Dinamik Attributes) ── */}
        <div className="specs-card">
          <div className="section-title">Ürün Özellikleri</div>
          <div className="specs-grid">
            <div className="specs-col">
              {specsLeft.map((s, index) => (
                <div key={s.id || `left-${index}`} className="spec-row">
                  <span className="spec-key">{s.attributeName}</span>
                  <span className="spec-val">{s.attributeValue}</span>
                </div>
              ))}
            </div>
            <div className="specs-col">
              {specsRight.map((s, index) => (
                <div key={s.id || `right-${index}`} className="spec-row">
                  <span className="spec-key">{s.attributeName}</span>
                  <span className="spec-val">{s.attributeValue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Yorumlar ── */}
        <div className="reviews-card">
          <div>
            <div className="reviews-title">Ürün Yorumları</div>
            <div className="reviews-title-underline" />
          </div>

          <div style={{ marginTop: 24 }}>
            <div className="product-title" style={{ marginBottom: 20 }}>
              {product.productName}
            </div>

            <div className="reviews-body">
              {/* Rating summary */}
              <div className="rating-summary">
                <div className="rating-product-img">
                  <img src={productImages[0]} alt={product.productName} />
                </div>

                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const count = ratingDist[n] || 0;
                    const pct = totalReviews ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={n} className="rating-bar-row">
                        <span className="bar-num">{n}</span>
                        <div className="bar-bg">
                          <div className="bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="bar-count">{count}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="rating-total">{totalReviews} değerlendirme</div>
              </div>

              {/* Review list */}
              <div className="review-list">
                {comments.length > 0 ? (
                  comments.map((r) => {
                    const initials = `U${r.userId}`;
                    return (
                      <div key={r.id} className="review-item">
                        <div className="review-top">
                          <div
                            className="reviewer-avatar"
                            style={{ background: getAvatarColor(r.userId) }}
                          >
                            {initials}
                          </div>
                          <div className="reviewer-info">
                            <div className="reviewer-name">Kullanıcı #{r.userId}</div>
                            <div className="review-date">{formatDate(r.createdAt)}</div>
                          </div>
                          <div className="review-stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                className={`star ${s <= r.rating ? "" : "empty"}`}
                              >
                                {s <= r.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="review-text">{r.text}</div>
                        <div className="verified-badge">✓ Doğrulanmış Kiralama</div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: "20px 0", color: "#666" }}>
                    Henüz yorum yapılmamış.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast msg={toast} />
    </div>
  );
}
