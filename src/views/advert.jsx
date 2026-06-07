import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import { getAllCategories, createProduct } from "../services/product-service";
import { uploadFileToS3, createProductImages } from "../services/product-image-service";
import { getOwnerIdFromToken } from "../services/auth-service";
import "./advert_css.css";
import { IMAGE_PREFIX } from "../constants";

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
  const [minRentalDays, setMinRentalDays] = useState("");
  const [maxRentalDays, setMaxRentalDays] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
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
      //setMessage(`${uploaded.length} fotoğraf yüklendi.`);
    } catch (err) {
      setMessage(err.message || "Fotoğraf yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const isSubmittable =
    termsAccepted &&
    categoryId &&
    productName.trim() !== "" &&
    description.trim() !== "" &&
    price !== "" &&
    depositAmount !== "" &&
    stockQuantity !== "" &&
    minRentalDays !== "" &&
    maxRentalDays !== "" &&
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

      const requestBody = {
        ownerId,
        categoryId: Number(categoryId),
        productName: productName.trim(),
        description: description.trim(),
        currency,
        price: Number(price),
        brand: brand.trim() || undefined,
        stockQuantity: Number(stockQuantity),
        minRentalDays: minRentalDays ? Number(minRentalDays) : undefined,
        maxRentalDays: maxRentalDays ? Number(maxRentalDays) : undefined,
        depositAmount: Number(depositAmount),
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


  console.log({isSubmittable, submitLoading, termsAccepted, categoryId, productName, description, price, depositAmount, stockQuantity})
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
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="form-label">
                  Min. Kiralama Günü <span className="required-star">*</span>
                </div>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={minRentalDays}
                  onChange={(e) => setMinRentalDays(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="form-label">
                  Max. Kiralama Günü <span className="required-star">*</span>
                </div>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={maxRentalDays}
                  onChange={(e) => setMaxRentalDays(e.target.value)}
                />
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
          <div className="section-title">Fotoğraf <span className="required-star">*</span></div>
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
                Eklediğiniz Fotoğraf Adedi{' '}
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