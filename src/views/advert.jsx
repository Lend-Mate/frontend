import { useState } from "react";
import "./advert_css.css";

const TOOLBAR_BUTTONS = [
  { label: "B", className: "" },
  { label: "I", className: "italic" },
  { label: "U", className: "underline" },
  { label: "≡", className: "" },
  { label: "⊟", className: "" },
  { label: "≣", className: "" },
  { label: "•", className: "" },
  { label: "1.", className: "" },
  { label: "↺", className: "" },
  { label: "↻", className: "" },
  { label: "⊘", className: "" },
  { label: "🔗", className: "" },
  { label: "A", className: "" },
  { label: "Tı", className: "" },
  { label: "A", className: "" },
  { label: "A", className: "" },
];

export default function Advert() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [district, setDistrict] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [photoCount] = useState(0);
  const [contactMethod, setContactMethod] = useState("phone");
  const [selectedName, setSelectedName] = useState("short");
  const [allowMessages, setAllowMessages] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isSubmittable = termsAccepted && title.trim() !== "";

    const [wishlist, setWishlist] = useState(new Set())
  const [cartCount, setCartCount] = useState(0)
  
  return (
    <div className="page-wrapper">

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

      <div className="page-content">
              {/* ── Kategori ── */}
      <div>
        <div className="section-title">Kategori</div>
        <div className="card">
          <div className="category-row">
            <div className="category-path">
              <div className="category-icon">🐾</div>
              Hayvanlar Alemi
              <span>&gt;</span> Aksesuar & Ekipman
              <span>&gt;</span> Kedi
              <span>&gt;</span> Tuvalet & Kum
            </div>
            <a className="help-link">
              <span>?</span> Önemli Uyarı
            </a>
          </div>
        </div>
      </div>

      {/* ── İlan Detayları ── */}
      <div>
        <div className="section-title">İlan Detayları</div>
        <div className="card">

          {/* Başlık */}
          <div className="form-group">
            <div className="form-label">
              İlan Başlığı <span className="required-star">*</span>
              <a className="help-link" style={{ marginLeft: "auto", fontWeight: 400 }}>? Yardım</a>
            </div>
            <input
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Açıklama */}
          <div className="form-group">
            <div className="form-label">
              Açıklama <span className="required-star">*</span>
              <a className="help-link" style={{ marginLeft: "auto", fontWeight: 400 }}>? Yardım</a>
            </div>
            <div className="editor-wrapper">
              <div className="editor-toolbar">
                {TOOLBAR_BUTTONS.map((btn, i) => (
                  <button key={i} className={`toolbar-btn ${btn.className}`}>
                    {btn.label}
                  </button>
                ))}
              </div>
              <div
                className="editor-body"
                contentEditable
                data-placeholder="İlan açıklamanızı buraya yazın..."
                suppressContentEditableWarning
              />
            </div>
          </div>

          {/* Fiyat */}
          <div className="form-group">
            <div className="form-label">
              Fiyat <span className="required-star">*</span>
            </div>
            <div className="price-row">
              <input
                className="form-input price-input"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                className="form-input price-cents"
                type="text"
                defaultValue="00"
              />
              <select className="form-select price-currency">
                <option>TL</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>

          <hr className="divider" />

          {/* Ürün */}
          <div className="form-group">
            <div className="form-label">
              Ürün <span className="required-star">*</span>
            </div>
            <select
              className="form-select select-half"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              <option value="">Seçiniz</option>
              <option>Kedi Kumu</option>
              <option>Kedi Tuvaleti</option>
            </select>
          </div>

          {/* Marka */}
          <div className="form-group">
            <div className="form-label">
              Marka <span className="required-star">*</span>
            </div>
            <select
              className="form-select select-half"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">Seçiniz</option>
              <option>Catit</option>
              <option>Moderna</option>
              <option>Savic</option>
            </select>
          </div>

          {/* Durumu */}
          <div className="form-group">
            <div className="form-label">
              Durumu <span className="required-star">*</span>
            </div>
            <select
              className="form-select select-half"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">Seçiniz</option>
              <option>Sıfır</option>
              <option>İkinci El</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Adres Bilgileri ── */}
      <div>
        <div className="address-header">
          <div className="section-title">Adres Bilgileri</div>
          <div className="country-info">
            Türkiye
            <span className="country-change">Ülke Değiştir</span>
          </div>
        </div>
        <div className="card">
          <div className="address-grid">
            <div>
              <div className="form-label">
                İl <span className="required-star">*</span>
              </div>
              <select className="form-select">
                <option>İstanbul</option>
                <option>Ankara</option>
                <option>İzmir</option>
              </select>
            </div>
            <div>
              <div className="form-label">
                İlçe <span className="required-star">*</span>
              </div>
              <select
                className="form-select"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Seçiniz</option>
                <option>Kadıköy</option>
                <option>Beşiktaş</option>
                <option>Üsküdar</option>
              </select>
            </div>
            <div>
              <div className="form-label">Mahalle</div>
              <select
                className="form-select"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                disabled={!district}
              >
                <option value="">Seçiniz</option>
                <option>Moda</option>
                <option>Fenerbahçe</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fotoğraf ── */}
      <div>
        <div className="section-title">Fotoğraf</div>
        <div className="card">
          <div className="photo-upload-row">
            <label className="upload-box">
              <input type="file" accept="image/*" multiple hidden />
              <div className="upload-icon">📷</div>
              <div className="upload-label">Bilgisayardan Fotoğraf Ekle</div>
              <div className="upload-sublabel">veya sürükle bırak</div>
            </label>
            <label className="upload-box solid">
              <input type="file" accept="image/*" capture="environment" hidden />
              <div className="upload-icon">📱</div>
              <div className="upload-label">Cep Telefonundan Fotoğraf Ekle</div>
            </label>
          </div>

          <div className="photo-count-row">
            <span className="photo-count-label">
              Eklediğiniz Fotoğraf Adedi{" "}
              <span className="photo-count-num">{photoCount}/10</span>
            </span>
            <span>?</span>
          </div>
          <div className="progress-bar-bg" style={{ marginBottom: 8 }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${(photoCount / 10) * 100}%` }}
            />
          </div>
          <div className="photo-tip">
            Daha fazla fotoğraf ile ilanınızın görünürlüğünü arttırabilirsiniz.
          </div>
        </div>
      </div>

      {/* ── İletişim Bilgileri ── */}
      <div>
        <div className="section-title">İletişim Bilgileri</div>
        <div className="card">
          <div className="contact-question">Size nasıl ulaşılsın ?</div>

          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="contact"
                value="phone"
                checked={contactMethod === "phone"}
                onChange={() => setContactMethod("phone")}
              />
              Telefon numaralarım ile
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="contact"
                value="none"
                checked={contactMethod === "none"}
                onChange={() => setContactMethod("none")}
              />
              Telefonla ulaşılmak istemiyorum
            </label>
          </div>

          {contactMethod === "phone" && (
            <div className="contact-popup">
              <div className="contact-note">
                Yayınladığınız ilanlarda "iletişim bilgileri" bölümünde görünecek
                adınız ve soyadınızdır.
              </div>

              <div className="name-radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="displayName"
                    value="full"
                    checked={selectedName === "full"}
                    onChange={() => setSelectedName("full")}
                  />
                  Timur Turbil
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="displayName"
                    value="short"
                    checked={selectedName === "short"}
                    onChange={() => setSelectedName("short")}
                  />
                  Timur T.
                </label>
              </div>

              <div className="phone-fields">
                <div className="phone-row">
                  <label>Ev Telefonu</label>
                  <input
                    className="phone-input"
                    type="tel"
                    placeholder="+90 (__) __ __"
                  />
                </div>
                <div className="phone-row">
                  <label>Cep Telefonu</label>
                  <input
                    className="phone-input"
                    type="tel"
                    defaultValue="+90  (534) 516 4540"
                  />
                </div>
              </div>

              <div className="popup-actions">
                <button className="btn btn-secondary">İptal</button>
                <button className="btn btn-primary">Kaydet</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Alt Bar ── */}
      <div className="bottom-section">
        <label className="message-consent">
          <input
            type="checkbox"
            checked={allowMessages}
            onChange={(e) => setAllowMessages(e.target.checked)}
          />
          sahibinden.com üzerinden diğer kullanıcılar bana mesaj gönderebilsinler.
        </label>

        <hr className="divider" />

        <div className="submit-row">
          <label className="terms-check">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <a href="#">İlan verme kurallarını</a>&nbsp;okudum, kabul ediyorum
          </label>
          <button className={`btn-submit ${isSubmittable ? "active" : ""}`} disabled={!isSubmittable}>
            İlanı Oluştur
          </button>
        </div>
      </div>

      </div>

    </div>
  );
}