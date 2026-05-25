import { useState } from "react";
import "./auth.css";

/* ── Icons ── */
const EyeOff = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const EyeOn = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Reusable ── */
function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="input-wrap">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button className="toggle-pw" onClick={() => setShow((s) => !s)} type="button" aria-label="Şifreyi göster/gizle">
        {show ? <EyeOn /> : <EyeOff />}
      </button>
    </div>
  );
}

/* ══════════════════════════════
   LOGIN
══════════════════════════════ */
function LoginForm({ onForgot, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-card">
      <h1 className="auth-title">Giriş Yap</h1>

      <div className="input-group">
        <div className="input-wrap">
          <input
            type="email"
            placeholder="E-posta adresi*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="input-group">
        <PasswordInput
          placeholder="Şifre*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-green">Giriş Yap</button>

      <a className="forgot-link" onClick={onForgot}>Şifremi Unuttum!</a>

      <div className="divider">Veya</div>

      <button className="btn btn-outline" onClick={onRegister}>Üye Ol</button>
    </div>
  );
}

/* ══════════════════════════════
   REGISTER
══════════════════════════════ */
function RegisterForm({ onLogin }) {
  const [form, setForm] = useState({
    ad: "", soyad: "", email: "", telefon: "", sifre: "", sifreTekrar: "",
    kabul: "", onay: false,
  });

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div className="auth-card">
      <h1 className="auth-title center">Üyelik Oluştur</h1>

      <div className="input-row">
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label>Ad*</label>
          <div className="input-wrap">
            <input type="text" placeholder="" value={form.ad} onChange={set("ad")} className={form.ad ? "focused" : ""} />
          </div>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <div className="input-wrap" style={{ marginTop: 22 }}>
            <input type="text" placeholder="Soyad*" value={form.soyad} onChange={set("soyad")} />
          </div>
        </div>
      </div>

      <div className="input-group">
        <div className="input-wrap">
          <input type="email" placeholder="E-posta adresi*" value={form.email} onChange={set("email")} />
        </div>
      </div>

      <div className="input-group">
        <div className="phone-wrap">
          <div className="phone-country">
            <span>🇹🇷</span> TR <ChevronDown />
          </div>
          <input type="tel" placeholder="Telefon*" value={form.telefon} onChange={set("telefon")} />
        </div>
      </div>

      <div className="input-group">
        <PasswordInput placeholder="Şifre*" value={form.sifre} onChange={set("sifre")} />
      </div>

      <div className="input-group">
        <PasswordInput placeholder="Şifre Tekrar*" value={form.sifreTekrar} onChange={set("sifreTekrar")} />
      </div>

      <div className="consent-block">
        Kişisel verilerimin <a href="#">Aydınlatma Metni</a>'nde belirtilen kapsamda; bana özel kampanyaların sunulması
        ve kişiselleştirilmiş teklifler oluşturulması amacıyla işlenmesine <a href="#">Açık Rıza</a> veriyorum.
      </div>
      <div className="consent-options">
        <label className="consent-option">
          <input type="checkbox" checked={form.kabul === "evet"} onChange={() => setForm((f) => ({ ...f, kabul: "evet" }))} />
          Kabul ediyorum.
        </label>
        <label className="consent-option">
          <input type="checkbox" checked={form.kabul === "hayir"} onChange={() => setForm((f) => ({ ...f, kabul: "hayir" }))} />
          Kabul etmiyorum.
        </label>
      </div>

      <div className="consent-block" style={{ marginTop: 0 }}>
        Avantajlardan ve kampanyalardan haberdar olmak için tarafıma <a href="#">Ticari İleti İzni</a> kapsamında
        e-posta ve SMS gönderilmesine onay veriyorum.
      </div>
      <label className="consent-single">
        <input type="checkbox" checked={form.onay} onChange={set("onay")} />
        Onay veriyorum.
      </label>

      <p className="consent-note">
        Lütfen üye olmadan önce <a href="#">Aydınlatma Metni</a>'ni okuyunuz.
      </p>

      <button className="btn btn-black">ÜYE OL</button>

      <p className="signup-footer" style={{ marginTop: 14 }}>
        "ÜYE OL" butonuna tıklayarak <a href="#">Üyelik Sözleşmesi</a>ni okuduğunuzu ve kabul ettiğinizi onaylamış olursunuz.
      </p>

      <div className="bottom-link" style={{ marginTop: 20 }}>
        Kiralabunu.com'a üye misin?
        <span onClick={onLogin}>Giriş Yap</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   FORGOT PASSWORD
══════════════════════════════ */
function ForgotForm({ onRegister }) {
  const [contact, setContact] = useState("");

  return (
    <div className="auth-card">
      <h1 className="auth-title center">Şifremi Unuttum</h1>
      <p className="auth-subtitle">Kayıtlı olduğun e-posta adresi'ni gir.</p>

      <div className="input-group">
        <div className="input-wrap">
          <input
            type="text"
            placeholder="E-Posta adresi ya da telefon gir"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
      </div>

      <button className="btn btn-black" style={{ marginTop: 16 }}>Gönder</button>

      <div className="bottom-link" style={{ marginTop: 28 }}>
        <strong>Kiralabunu.com'a üye değil misin?</strong>
        <span className="green-link" onClick={onRegister} style={{ display: "block", marginTop: 6 }}>
          Üyelik Oluştur!
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   ROOT
══════════════════════════════ */
export default function Auth() {
  const [page, setPage] = useState("login"); // "login" | "register" | "forgot"

  return (
    <div>
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
              <span className="badge">{0}</span>
            </button>
            <button type="button" className="icon-btn cart-btn" onClick={() => {
              window.location.href = '/shopping-cart'
            }}>
              <i className="fas fa-shopping-cart" />
              <span className="badge">{0}</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="main-nav">
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
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", background: "#f0f0f0" }}>
      {/* Tab switcher for quick navigation */}
      
      {page === "login" && (
        <LoginForm onForgot={() => setPage("forgot")} onRegister={() => setPage("register")} />
      )}
      {page === "register" && (
        <RegisterForm onLogin={() => setPage("login")} />
      )}
      {page === "forgot" && (
        <ForgotForm onRegister={() => setPage("register")} />
      )}
    </div>
    </div>
  );
}
