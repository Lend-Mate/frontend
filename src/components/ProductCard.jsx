import { getOwnerIdFromToken } from "../services/auth-service"
import { addFavourite } from "../services/favourite-service"

export default function ProductCard({ product, openModal, toggleWish, getImageUrl, isWished }) {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

  return (
    <div className="product-card" onClick={() => openModal(product)}>
      <span className="product-badge">Yeni</span>
      <button
        type="button"
        className={`product-wish ${isWished ? 'active' : ''}`}
        onClick={e => {
          e.stopPropagation()
          toggleWish(product.id)
          const userId = getOwnerIdFromToken();
          addFavourite({ productId: product.id, userId })
        }}
      >
        <i className={`fa${isWished ? 's' : 'r'} fa-heart`} />
      </button>

      <div className="product-img-wrap">
        <img
          src={getImageUrl(primaryImage?.imageUrl)}
          alt={product.productName}
          loading="lazy"
        />
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand || 'Lendmate'}</div>
        <div className="product-name">{product.productName}</div>
        <div className="product-specs">{product.description}</div>

        <div className="duration-pills">
          <span className="pill active">
            {product.minRentalDays}–{product.maxRentalDays} Gün
          </span>
        </div>

        <div className="product-price">
          {Number(product.price).toLocaleString('tr-TR')} {product.currency}
          <span> / Günlük</span>
        </div>
      </div>
    </div>
  )
}
