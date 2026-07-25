import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import { getAllCategories, createProduct } from "../services/product-service";
import { uploadFileToS3, createProductImages } from "../services/product-image-service";
import { getOwnerIdFromToken } from "../services/auth-service";
import "./advert_css.css";
import { IMAGE_PREFIX } from "../constants";

// Kiralama periyotları sabit listesi
const RENTAL_PERIOD_OPTIONS = [
  { value: "ONE_MONTH", label: "1 Ay" },
  { value: "THREE_MONTH", label: "3 Ay" },
  { value: "SIX_MONTH", label: "6 Ay" },
  { value: "NINE_MONTH", label: "9 Ay" },
  { value: "TWELVE_MONTH", label: "12 Ay" },
];

export default function Advert() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("TL");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  
  // Dinamik Ürün Özellikleri State'i
  const [attributes, setAttributes] = useState([]);

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [buildingFloor, setBuildingFloor] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  const handlePhotoChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 5 - uploadedImages.length;
    if (remainingSlots <= 0) {
      setMessage("En fazla 5 fotoğraf yükleyebilirsiniz.");
      return;
    }
    const filesToUpload = files.slice(0, remainingSlots);
    setUploading(true);
    setMessage("");

    try {
      const uploaded = await Promise.all(
        filesToUpload.map((file) => uploadFileToS3(file))
      );
      setUploadedImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setMessage(err.message || "Fotoğraf yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  // Kiralama dönemi ekleme/çıkarma işlemi
  const togglePeriod = (periodValue) => {
    setAvailablePeriods((prev) =>
      prev.includes(periodValue)
        ? prev.filter((p) => p !== periodValue)
        : [...prev, periodValue]
    );
  };

  // Dinamik Özellik İşlemleri
  const handleAddAttribute = () => {
    setAttributes((prev) => [...prev, { attributeName: "", attributeValue: "" }]);
  };

  const handleRemoveAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index, field, value) => {
    setAttributes((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const isSubmittable =
    termsAccepted &&
    categoryId &&
    productName.trim() !== "" &&
    description.trim() !== "" &&
    price !== "" &&
    depositAmount !== "" &&
    stockQuantity !== "" &&
    stockQuantity !== "0" &&
    availablePeriods.length > 0 &&
    uploadedImages.length > 0;

  const handleSubmit = async () => {
    if (!isSubmittable) return;

    setSubmitLoading(true);
    setMessage("");

    try {
      const ownerId = getOwnerIdFromToken();
      if (!ownerId) {
        throw new Error("Kullanıcı kimliği token üzerinden alınamadı.");
      }

      // Sadece dolu olan dinamik özellikleri temizle ve payload formatına sok
      const formattedAttributes = attributes
        .filter(
          (attr) => attr.attributeName.trim() !== "" && attr.attributeValue.trim() !== ""
        )
        .map((attr) => ({
          attributeName: attr.attributeName.trim(),
          attributeValue: attr.attributeValue.trim(),
        }));

      const requestBody = {
        ownerId,
        categoryId: Number(categoryId),
        productName: productName.trim(),
        description: description.trim(),
        currency,
        price: Number(price),
        brand: brand.trim() || undefined,
        stockQuantity: Number(stockQuantity),
        availablePeriods,
        depositAmount: Number(depositAmount),
        attributes: formattedAttributes, // Dinamik eklenen özellikler
      };

      const createdProduct = await createProduct(requestBody);
      if (!createdProduct?.id) {
        throw new Error("Ürün oluşturuldu ancak ürün kimliği alınamadı.");
      }

      if (uploadedImages.length > 0) {
        const imageNames = uploadedImages.map((image) => image.imageName);
        await createProductImages(createdProduct.id, imageNames);
      }

      navigate("/products");
      return;
    } catch (err) {
      setMessage(err.message || "İlan oluşturulurken hata oluştu.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Header categories={categories} wishlistCount={wishlist.size} cartCount={cartCount} />

      <div className="page-content">
        <div>
          <div className="section-title">Kategori</div>
          <div className="card">
            <div className="form-group">
              <div className="form-label">
                Kategori <span className="required-star">*</span>
              </div>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="section-title">İlan Detayları</div>
          <div className="card">
            <div className="form-group">
              <div className="form-label">
                Ürün Adı <span className="required-star">*</span>
              </div>
              <input
                className="form-input"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="form-label">
                Açıklama <span className="required-star">*</span>
              </div>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Ürün açıklamanızı buraya yazın..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="form-label">
                  Para Birimi <span className="required-star">*</span>
                </div>
                <select
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="TL">TL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div className="form-group">
                <div className="form-label">
                  Fiyat <span className="required-star">*</span>
                </div>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Marka</div>
                <input
                  className="form-input"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="form-label">
                  Stok Adedi <span className="required-star">*</span>
                </div>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>
            </div>

            {/* Çoklu Kiralama Dönemi Seçimi (Chips Yapısı) */}
            <div className="form-group">
              <div className="form-label">
                Uygun Kiralama Dönemleri <span className="required-star">*</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "6px",
                }}
              >
                {RENTAL_PERIOD_OPTIONS.map((option) => {
                  const isSelected = availablePeriods.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => togglePeriod(option.value)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: isSelected ? "2px solid #3b82f6" : "1px solid #d1d5db",
                        backgroundColor: isSelected ? "#eff6ff" : "#fff",
                        color: isSelected ? "#1d4ed8" : "#374151",
                        fontWeight: isSelected ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <div className="form-label">
                Depozito <span className="required-star">*</span>
              </div>
              <input
                className="form-input"
                type="number"
                min="0"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>

            {/* ── Dynamic Product Attributes Section ── */}
            <div className="form-group" style={{ marginTop: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div className="form-label" style={{ marginBottom: 0 }}>
                  Ürün Özellikleri (Opsiyonel)
                </div>
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  style={{
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ➕ Özellik Ekle
                </button>
              </div>

              {attributes.map((attr, index) => (
                <div
                  key={index}
                  className="form-row"
                  style={{
                    marginBottom: "10px",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Özellik Adı (Örn: RAM)"
                      value={attr.attributeName}
                      onChange={(e) =>
                        handleAttributeChange(index, "attributeName", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Değeri (Örn: 8 GB)"
                      value={attr.attributeValue}
                      onChange={(e) =>
                        handleAttributeChange(index, "attributeValue", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(index)}
                    style={{
                      backgroundColor: "#fee2e2",
                      border: "1px solid #fca5a5",
                      color: "#dc2626",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    title="Özelliği Sil"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="section-title">Adres Bilgileri</div>
          <div className="card">
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">İl</div>
                <input
                  className="form-input"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="İl girin"
                />
              </div>
              <div className="form-group">
                <div className="form-label">İlçe</div>
                <input
                  className="form-input"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="İlçe girin"
                />
              </div>
              <div className="form-group">
                <div className="form-label">Cadde / Mahalle</div>
                <input
                  className="form-input"
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Cadde veya mahalle girin"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Bina No / Kat</div>
                <input
                  className="form-input"
                  type="text"
                  value={buildingFloor}
                  onChange={(e) => setBuildingFloor(e.target.value)}
                  placeholder="Bina no ve kat"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="section-title">
            Fotoğraf <span className="required-star">*</span>
          </div>
          <div className="card">
            <div className="photo-upload-row">
              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handlePhotoChange}
                />
                <div className="upload-icon">📷</div>
                <div className="upload-label">Fotoğraf Ekle</div>
                <div className="upload-sublabel">
                  {uploading
                    ? "Yükleniyor..."
                    : "En az 1 ve en fazla 5 fotoğraf yükleyin."}
                </div>
              </label>
            </div>

            <div className="photo-count-row">
              <span className="photo-count-label">
                Eklediğiniz Fotoğraf Adedi{" "}
                <span className="photo-count-num">{uploadedImages.length}/5</span>
              </span>
            </div>

            {uploadedImages.length > 0 && (
              <div className="photo-preview-grid">
                {uploadedImages.map((image, index) => (
                  <div key={`${image.imageName}-${index}`} className="photo-preview-item">
                    <img
                      className="photo-preview-img"
                      src={IMAGE_PREFIX + image.imageName}
                      alt={`Yüklenen ${index + 1}`}
                    />
                    <div className="photo-preview-meta">
                      <span>{index + 1}. fotoğraf</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bottom-section">
          <label className="message-consent">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <a href="#">İlan verme kurallarını</a>&nbsp;okudum, kabul ediyorum
          </label>

          <hr className="divider" />

          {message && <div className="form-message">{message}</div>}

          <button
            className={`btn-submit ${isSubmittable ? "active" : ""}`}
            disabled={!isSubmittable || submitLoading}
            onClick={handleSubmit}
          >
            {submitLoading ? "Kaydediliyor..." : "İlanı Oluştur"}
          </button>
        </div>
      </div>
    </div>
  );
}
