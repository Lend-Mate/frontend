import { getOwnerIdFromToken } from "../services/auth-service"
import { addFavourite } from "../services/favourite-service"

// Varsayılan Görsel URL'i
const DEFAULT_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0hpZej3ruC4MVu8yn9yei4SSJtX4B7rc5VHsTHEd5Aq_tNkI-ffi2oIbx&s=10";

export default function ProductCard({ product, openModal, toggleWish, getImageUrl, isWished, isNew = false }) {
  const quantity = product.stockQuantity;
  const isRented = quantity === 0; // Stok 0 ise kiralanmıştır
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

  // Görsel URL'ini belirle (Eğer primaryImage yoksa direkt varsayılan görseli ver)
  const imageSrc = primaryImage?.imageUrl 
    ? getImageUrl(primaryImage.imageUrl) 
    : DEFAULT_IMAGE;

  return (
    <div
      className={`product-card ${isRented ? 'rented' : ''}`}
      onClick={() => openModal(product)}
    >
      {/* RENTED Çapraz Yazı Katmanı */}
      {isRented && (
        <div className="product-rented-overlay">
          <span>KİRALANDI</span>
        </div>
      )}

      {isNew && (
        <span className="product-badge">Yeni</span>
      )}
      <button
        type="button"
        className={`product-wish ${isWished ? 'active' : ''}`}
        disabled={isRented}
        onClick={e => {
          e.stopPropagation()
          toggleWish(product.id)
          if (window.location.pathname !== '/favorites') {
            const userId = getOwnerIdFromToken();
            addFavourite({ productId: product.id, userId })
          }
        }}
      >
        <i className={`fa${isWished ? 's' : 'r'} fa-heart`} />
      </button>

      <div className="product-img-wrap">
        <img
          src={imageSrc}
          alt={product.productName || 'Ürün Görseli'}
          loading="lazy"
          /* Eğer URL geçerli olsa bile yükleme sırasında (404/403 vb.) hata verirse fallback görsele geçer */
          onError={(e) => {
            e.target.onerror = null; // Sonsuz döngüyü engeller
            e.target.src = DEFAULT_IMAGE;
          }}
        />
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand || 'HemenKirala'}</div>
        <div className="product-name">{product.productName}</div>
        <div className="product-specs">{product.description}</div>

        <div className="duration-pills">
          {product.rentalPeriodPrices ? (
            Object.keys(product.rentalPeriodPrices)
            .map((period, index) => {
              const periodMap = {
                ONE_MONTH: '1 Ay',
                THREE_MONTH: '3 Ay',
                SIX_MONTH: '6 Ay',
                NINE_MONTH: '9 Ay',
                TWELVE_MONTH: '12 Ay'
              };
              return (
                <span key={index} className="pill active">
                  {periodMap[period] || period}
                </span>
              );
            })
          ) : (
            <span className="pill active"></span>
          )}
        </div>

        <div className="product-price">
          {Number(product.price).toLocaleString('tr-TR')} {product.currency}
          <span> / Aylık Ödenecek Tutar</span>
        </div>
      </div>
    </div>
  )
}
