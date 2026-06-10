import { useState } from "react";
import "./auth.css";
import { login, register } from "../services/auth-service";

/* ── Icons (değişmedi) ── */
const EyeOff = () => { /* aynı */ };
const EyeOn = () => { /* aynı */ };
const ChevronDown = () => { /* aynı */ };

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
      <button className="toggle-pw" onClick={() => setShow(s => !s)} type="button">
        {show ? <EyeOn /> : <EyeOff />}
      </button>
    </div>
  );
}

function LoginForm({ onForgot, onRegister }) {
  const [username, setUsername] = useState("timurturbil@gmail.com");  // backend "username" bekliyor
  const [password, setPassword] = useState("secret");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async event => {
    event?.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Giriş Yap</h1>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <div className="input-wrap">
            <input
              type="text"
              placeholder="Kullanıcı adı veya e-posta*"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <PasswordInput
            placeholder="Şifre*"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-green" type="submit" disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <a className="forgot-link" onClick={onForgot}>Şifremi Unuttum!</a>

      <div className="divider">Veya</div>

      <button className="btn btn-outline" onClick={onRegister}>Üye Ol</button>
    </div>
  );
}

function RegisterForm({ onLogin }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", username: "", email: "",
    phone: "", password: "", passwordConfirm: "",
    role: "USER", createdAt: null, updatedAt: null,
    deleted: false, verified: false,
    kabul: "", onay: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = field => e =>
    setForm(f => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleRegister = async () => {
    if (form.password !== form.passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const now = new Date().toISOString().slice(0, 19); // "2025-01-01T00:00:00"
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        deleted: false,
        verified: false,
        createdAt: now,
        updatedAt: now,
      });
      // Kayıt başarılı → login ekranına geç
      onLogin();
    } catch (err) {
      setError(err.message || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title center">Üyelik Oluştur</h1>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div className="input-row">
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label>Ad*</label>
          <div className="input-wrap">
            <input type="text" placeholder="" value={form.firstName} onChange={set("firstName")} />
          </div>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <div className="input-wrap" style={{ marginTop: 22 }}>
            <input type="text" placeholder="Soyad*" value={form.lastName} onChange={set("lastName")} />
          </div>
        </div>
      </div>

      <div className="input-group">
        <div className="input-wrap">
          <input type="text" placeholder="Kullanıcı adı*" value={form.username} onChange={set("username")} />
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
          <input type="tel" placeholder="Telefon*" value={form.phone} onChange={set("phone")} />
        </div>
      </div>

      <div className="input-group">
        <PasswordInput placeholder="Şifre*" value={form.password} onChange={set("password")} />
      </div>

      <div className="input-group">
        <PasswordInput placeholder="Şifre Tekrar*" value={form.passwordConfirm} onChange={set("passwordConfirm")} />
      </div>

      {/* Consent blokları — değişmedi */}
      <div className="consent-block">
        Kişisel verilerimin <a href="#">Aydınlatma Metni</a>'nde belirtilen kapsamda işlenmesine{" "}
        <a href="#">Açık Rıza</a> veriyorum.
      </div>
      <div className="consent-options">
        <label className="consent-option">
          <input type="checkbox" checked={form.kabul === "evet"} onChange={() => setForm(f => ({ ...f, kabul: "evet" }))} />
          Kabul ediyorum.
        </label>
        <label className="consent-option">
          <input type="checkbox" checked={form.kabul === "hayir"} onChange={() => setForm(f => ({ ...f, kabul: "hayir" }))} />
          Kabul etmiyorum.
        </label>
      </div>
      <label className="consent-single">
        <input type="checkbox" checked={form.onay} onChange={set("onay")} />
        Onay veriyorum.
      </label>
      <p className="consent-note">
        <a href="#">Aydınlatma Metni</a>'ni okuyunuz.
      </p>

      <button className="btn btn-black" onClick={handleRegister} disabled={loading}>
        {loading ? "Kaydediliyor..." : "ÜYE OL"}
      </button>

      <p className="signup-footer" style={{ marginTop: 14 }}>
        "ÜYE OL" butonuna tıklayarak <a href="#">Üyelik Sözleşmesi</a>ni kabul etmiş olursunuz.
      </p>

      <div className="bottom-link" style={{ marginTop: 20 }}>
        Zaten üye misin? <span onClick={onLogin}>Giriş Yap</span>
      </div>
    </div>
  );
}

function ForgotForm({ onRegister }) {
  // değişmedi — aynı kalabilir
}

export default function Auth() {
  const [page, setPage] = useState("login");
  return (
    <div>
      {/* header — aynı kalıyor */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", background: "#f0f0f0" }}>
        {page === "login" && <LoginForm onForgot={() => setPage("forgot")} onRegister={() => setPage("register")} />}
        {page === "register" && <RegisterForm onLogin={() => setPage("login")} />}
        {page === "forgot" && <ForgotForm onRegister={() => setPage("register")} />}
      </div>
    </div>
  );
}