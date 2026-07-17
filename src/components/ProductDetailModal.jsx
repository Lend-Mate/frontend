import { useEffect, useState } from "react";

export default function ProductModal({ product, getImageUrl, closeModal, handleRent }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRented, setIsRented] = useState(false);
  useEffect(() => {
    if (!product) return;

    setIsRented(product.stockQuantity === 0);
    const defaultImage = (product.images?.find((img) => img.isPrimary) || product.images?.[0])?.imageUrl;
    setSelectedImage(defaultImage || null);
  }, [product]);

  if (!product) return null;

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && closeModal()}>
      <div className="modal" id="productModal">
        <button type="button" className="modal-close" onClick={closeModal}>
          <i className="fas fa-times" />
        </button>
        <div className="modal-content">
          <div className="modal-images">
            <img
              className="modal-main-img"
              src={getImageUrl(selectedImage)}
              alt={product.productName}
            />
            {product.images?.length > 1 && (
              <div className="modal-thumbs">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    className={`modal-thumb ${selectedImage === img.imageUrl ? 'active' : ''}`}
                    src={getImageUrl(img.imageUrl)}
                    alt={`thumb-${img.id}`}
                    onClick={() => setSelectedImage(img.imageUrl)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="modal-details">
            <div className="modal-brand">{product.brand || 'Lendmate'}</div>
            <h2 className="modal-title">{product.productName}</h2>
            <div className="modal-specs">{product.description}</div>

            <div className="modal-price-row">
              <span className="modal-price">
                {Number(product.price).toLocaleString('tr-TR')} {product.currency}
              </span>
              <span className="modal-price-label">/ Günlük</span>
            </div>

            <div className="modal-badges">
              <div className="modal-badge-row">
                <i className="fas fa-calendar-alt" /> {product.minRentalDays}–{product.maxRentalDays} gün arası kiralama
              </div>
              <div className="modal-badge-row">
                <i className="fas fa-shield-alt" /> Depozito: {Number(product.depositAmount).toLocaleString('tr-TR')} {product.currency}
              </div>
              <div className="modal-badge-row">
                <i className="fas fa-box" /> Stok: {product.stockQuantity} adet
              </div>
              <div className="modal-badge-row">
                <i className="fas fa-truck" /> 1-5 İş Günü Arasında Teslimat
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{
                background: "white", 
                border: "1px solid #ccc",
                }} type="button" className="modal-rent-btn" onClick={() => {
                  window.location.href = `/product-detail?productId=${product.id}`
                }}>
                <span style={{color: "black"}}>Detay</span>
              </button>
              <button style={{display: isRented ? "none" : ""}} type="button" className="modal-rent-btn" onClick={() => handleRent(product)}>
                Kirala
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
