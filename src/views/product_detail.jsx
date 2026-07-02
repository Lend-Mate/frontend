import { useState } from "react";
import "./product_detail.css";
import Header from "../components/Header";

/* ── Sabit veri ─────────────────────────── */
const PRODUCT = {
  title: "Apple iPhone 15 128GB",
  brand: "Apple",
  specs: "6.1 inç, A16 Bionic, 5G, 2 Kamera, 6 GB Ram",
  avgRating: 4.6,
  reviewCount: 14,
  prices: { 3: 4250, 6: 3180, 12: 3540, 24: 2835 },
  repairExtra: 1871.10,
  images: [
    "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923777972",
    "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-yellow?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923780404",
    "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-green?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923779208",
    "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923777047",
  ],
  technicalSpecs: [
    { key: "Dahili Hafıza", value: "128 GB" },
    { key: "Ram Kapasitesi", value: "6 GB" },
    { key: "Ekran Boyutu", value: "6.1 inç" },
    { key: "Görüntülü Konuşma", value: "Evet" },
  ],
  technicalSpecsRight: [
    { key: "Kablosuz Şarj", value: "Evet" },
    { key: "Kamera Çözünürlüğü", value: "48 MP" },
    { key: "Ön Kamera", value: "12 MP" },
    { key: "Yüz Tanıma", value: "Evet" },
  ],
};

const REVIEWS = [
  {
    id: 1,
    name: "Ahmet Y.",
    initials: "AY",
    date: "15 Haziran 2025",
    rating: 5,
    text: "Ürün eksiksiz ve temiz geldi. Kamera kalitesi beklentilerimin çok üzerinde. Kiralama süreci oldukça kolay ve hızlıydı. Kesinlikle tekrar kiralarım.",
    avatarColor: "#3ac267",
    verified: true,
  },
  {
    id: 2,
    name: "Merve K.",
    initials: "MK",
    date: "3 Mayıs 2025",
    rating: 4,
    text: "Genel olarak memnun kaldım. Telefon iyi durumda geldi, pil ömrü de gayet yeterliydi. Sadece kutu biraz yıpranmıştı ama ürünün kendisinde sorun yoktu.",
    avatarColor: "#7c6fcd",
    verified: true,
  },
  {
    id: 3,
    name: "Burak T.",
    initials: "BT",
    date: "21 Nisan 2025",
    rating: 5,
    text: "Harika bir deneyimdi. Teslimat süpriz şekilde 2 iş gününde oldu. iPhone 15'in Dynamic Island özelliğini kullanmak için kiralamıştım, tam beklediğim gibiydi.",
    avatarColor: "#e07c3a",
    verified: true,
  },
  {
    id: 4,
    name: "Selin A.",
    initials: "SA",
    date: "10 Mart 2025",
    rating: 4,
    text: "Kısa süreli kullanım için mükemmel bir seçenek. Satın almadan önce denemek için kiraladım, oldukça memnun kaldım. Müşteri hizmetleri de çok ilgili.",
    avatarColor: "#e03a6e",
    verified: false,
  },
];

/* Yıldız dağılımı (örnek) */
const RATING_DIST = { 5: 8, 4: 4, 3: 1, 2: 1, 1: 0 };

/* ── Yardımcı bileşenler ──────────────────── */
function Stars({ rating, size = "normal" }) {
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

/* ── Ana bileşen ─────────────────────────── */
export default function ProductDetail() {
  const [selectedPeriod, setSelectedPeriod] = useState(24);
  const [activeImg, setActiveImg] = useState(0);
  const [repairChecked, setRepairChecked] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const totalReviews = Object.values(RATING_DIST).reduce((a, b) => a + b, 0);

  return (
    <div>
        <Header categories={[]} wishlistCount={0} cartCount={0} />
        <div className="page">
      
      {/* ── Top card ── */}
      <div className="top-card">

        {/* Thumbnail rail */}
        <div className="thumb-rail">
          {PRODUCT.images.map((src, i) => (
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
          <img src={PRODUCT.images[activeImg]} alt={PRODUCT.title} />
        </div>

        {/* Purchase panel */}
        <div className="purchase-panel">
          <div className="panel-header">
            <Stars rating={PRODUCT.avgRating} />
            <button
              className="wishlist-btn"
              onClick={() => setWishlist(!wishlist)}
              title="Favorilere ekle"
            >
              {wishlist ? "♥" : "♡"}
            </button>
          </div>

          <div>
            <div className="product-title">{PRODUCT.title}</div>
            <div className="brand-name">{PRODUCT.brand}</div>
            <div className="product-specs">{PRODUCT.specs}</div>
          </div>

          <div className="price-block">
            <span className="price-amount">
              {PRODUCT.prices[selectedPeriod].toLocaleString("tr-TR")} TL
            </span>
            <span className="price-label">/ Aylık ödenecek tutar</span>
          </div>

          {/* Period selector */}
          <div className="period-selector">
            {[3, 6, 12, 24].map((p) => (
              <button
                key={p}
                className={`period-btn ${selectedPeriod === p ? "active" : ""}`}
                onClick={() => setSelectedPeriod(p)}
              >
                {p} Ay
              </button>
            ))}
          </div>

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

          {/* Repair option */}
          <div className="repair-row">
            <label className="repair-label">
              <input
                type="checkbox"
                checked={repairChecked}
                onChange={(e) => setRepairChecked(e.target.checked)}
              />
              Onarım garantisini %100'e tamamla
            </label>
            <span className="repair-price">
              {PRODUCT.repairExtra.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
            </span>
          </div>

          {/* Variant select */}
          <select className="variant-select" defaultValue="">
            <option value="" disabled>Lütfen seçiniz</option>
            <option>Siyah</option>
            <option>Sarı</option>
            <option>Yeşil</option>
            <option>Mavi</option>
          </select>

          {/* CTA */}
          <button className="rent-btn">Kirala</button>
        </div>
      </div>

      {/* ── Ürün Özellikleri ── */}
      <div className="specs-card">
        <div className="section-title">Ürün Özellikleri</div>
        <div className="specs-grid">
          <div className="specs-col">
            {PRODUCT.technicalSpecs.map((s) => (
              <div key={s.key} className="spec-row">
                <span className="spec-key">{s.key}</span>
                <span className="spec-val">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="specs-col">
            {PRODUCT.technicalSpecsRight.map((s) => (
              <div key={s.key} className="spec-row">
                <span className="spec-key">{s.key}</span>
                <span className="spec-val">{s.value}</span>
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
            {PRODUCT.title}
          </div>

          <div className="reviews-body">
            {/* Rating summary */}
            <div className="rating-summary">
              <div className="rating-product-img">
                <img src={PRODUCT.images[0]} alt={PRODUCT.title} />
              </div>

              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((n) => {
                  const count = RATING_DIST[n] || 0;
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
              {REVIEWS.map((r) => (
                <div key={r.id} className="review-item">
                  <div className="review-top">
                    <div
                      className="reviewer-avatar"
                      style={{ background: r.avatarColor }}
                    >
                      {r.initials}
                    </div>
                    <div className="reviewer-info">
                      <div className="reviewer-name">{r.name}</div>
                      <div className="review-date">{r.date}</div>
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
                  {r.verified && (
                    <div className="verified-badge">✓ Doğrulanmış Kiralama</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}