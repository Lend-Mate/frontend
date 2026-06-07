import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAllCategories } from "../services/product-service";
import { getProfile, updateProfile } from "../services/user-service";
import "./auth.css";

export default function Profile() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    profileImage: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, user] = await Promise.all([getAllCategories(), getProfile()]);
        setCategories(cats);
        setForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          profileImage: user.profileImage || "",
          password: "",
        });
      } catch (err) {
        setError(err.message || "Profil bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const setField = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        profileImage: form.profileImage,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await updateProfile(payload);
      setMessage("Profil bilgileriniz başarıyla güncellendi.");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setError(err.message || "Profil güncellenirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
      <Header categories={categories} wishlistCount={0} cartCount={0} />

      <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>
        <div className="auth-card">
          <h1 className="auth-title">Profilim</h1>

          {loading ? (
            <div style={{ padding: 24, textAlign: "center", color: "#555" }}>
              Profil bilgileri yükleniyor...
            </div>
          ) : (
            <form onSubmit={handleSave}>
              {error && (
                <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
                  {error}
                </div>
              )}

              {message && (
                <div style={{ background: "#e6ffed", color: "#1b5e20", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
                  {message}
                </div>
              )}

              <div className="input-row">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Ad</label>
                  <div className="input-wrap">
                    <input type="text" value={form.firstName} onChange={setField("firstName")} placeholder="Ad" />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Soyad</label>
                  <div className="input-wrap">
                    <input type="text" value={form.lastName} onChange={setField("lastName")} placeholder="Soyad" />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Kullanıcı adı</label>
                <div className="input-wrap">
                  <input type="text" value={form.username} onChange={setField("username")} placeholder="Kullanıcı adı" />
                </div>
              </div>

              <div className="input-group">
                <label>E-posta</label>
                <div className="input-wrap">
                  <input type="email" value={form.email} onChange={setField("email")} placeholder="E-posta" />
                </div>
              </div>

              <div className="input-group">
                <label>Telefon</label>
                <div className="input-wrap">
                  <input type="tel" value={form.phone} onChange={setField("phone")} placeholder="Telefon" />
                </div>
              </div>

              <div className="input-group">
                <label>Profil Görseli (URL)</label>
                <div className="input-wrap">
                  <input type="text" value={form.profileImage} onChange={setField("profileImage")} placeholder="Profil fotoğrafı URL'si" />
                </div>
              </div>

              <div className="input-group">
                <label>Şifre (isteğe bağlı)</label>
                <div className="input-wrap">
                  <input type="password" value={form.password} onChange={setField("password")} placeholder="Yeni şifre" />
                </div>
              </div>

              <button type="submit" className="btn btn-green" disabled={saving}>
                {saving ? "Kaydediliyor..." : "Bilgileri Güncelle"}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                style={{ marginTop: 12 }}
                onClick={handleLogout}
              >
                Çıkış Yap
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
