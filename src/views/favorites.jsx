import { useState, useEffect } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductDetailModal";
import { getAllCategories } from "../services/product-service";
import { getOwnerIdFromToken } from "../services/auth-service";
import {
  getFavourites,
  addFavourite,
  deleteFavourite,
} from "../services/favourite-service";
import Toast from "../components/Toast";
import { addToCart } from "../services/order-service";

// S3 bucket base URL
const S3_BASE = "https://lend-mate-bucket.s3.amazonaws.com";

function getImageUrl(key) {
  if (!key) return "https://placehold.co/400x300?text=Görsel+Yok";
  if (key.startsWith("http")) return key;
  return `${S3_BASE}/${key}`;
}

// ── STYLES ──────────────────────────────────────────────────────────────────
const s = {
  page: {
    display: "flex",
    gap: 0,
    minHeight: "100vh",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 16px",
    fontFamily: "'Outfit', sans-serif",
    background: "#f7f7f7",
    color: "#111",
  },
  main: {
    flex: 1,
    padding: "20px 0",
  },
  productsGrid: (list) => ({
    display: "grid",
    gridTemplateColumns: list ? "1fr" : "repeat(3, 1fr)",
    gap: 14,
  }),
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#888",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: "#333",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    marginBottom: 24,
  },
  emptyBtn: {
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

// ── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function Favorites() {
  const [products, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartCount, setCartCount] = useState(0);

  const [wishlist, setWishlist] = useState(new Set());
  const [favouriteMap, setFavouriteMap] = useState({});

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [toast, setToast] = useState("");
  const [modalProduct, setModalProduct] = useState(null);

  // Veri çekme
  useEffect(() => {
    const userId = getOwnerIdFromToken();

    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          getFavourites(userId),
          getAllCategories(),
        ]);
        setAllProducts(prods);
        setCategories(cats);

        // Kalpler dolu gelsin
        setWishlist(
          new Set(prods.map((fav) => fav.product.id))
        );

        // productId -> favouriteId map'i
        const map = {};

        prods.forEach((fav) => {
          map[fav.product.id] = fav.id;
        });

        setFavouriteMap(map);
      } catch (err) {
        setError("Ürünler yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const toggleWish = async (productId) => {
    const userId = getOwnerIdFromToken();
    console.log({wishlist})
    try {
      // Favoriden çıkar
      if (wishlist.has(productId)) {
        const favouriteId = favouriteMap[productId];

        if (favouriteId) {
          await deleteFavourite(favouriteId);
        }

        setWishlist((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });

        setFavouriteMap((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });

        setAllProducts((prev) =>
          prev.filter((fav) => fav.product.id !== productId)
        );

        showToast("Favorilerden kaldırıldı.");
      }
    } catch (err) {
      console.error(err);
      showToast("İşlem gerçekleştirilemedi.");
    }
  };

  const openModal = (product) => setModalProduct(product);
  const closeModal = () => setModalProduct(null);

  const handleRent = (product) => {
    setCartCount((prev) => prev + 1);
    closeModal();
    showToast(`${product.productName} sepete eklendi!`);
    const userId = getOwnerIdFromToken();
    addToCart({ productId: product.id, userId }).catch(err => {
      console.error("Sepete ürün eklenirken bir hata oluştu:", err)
      showToast("Ürün sepette eklenirken bir hata oluştu.")
    })
  };

  const sortedProducts = [...products];

  if (sortBy === "asc") {
    sortedProducts.sort(
      (a, b) => Number(a.product.price) - Number(b.product.price)
    );
  }

  if (sortBy === "desc") {
    sortedProducts.sort(
      (a, b) => Number(b.product.price) - Number(a.product.price)
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#f7f7f7",
        minHeight: "100vh",
      }}
    >
      <Header
        categories={categories}
        wishlistCount={wishlist.size}
        cartCount={cartCount}
      />

      <div style={s.page}>
        <main style={s.main}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "1.9rem",
                fontWeight: 600,
                color: "#111827",
                letterSpacing: "-0.01em",
              }}
            >
              Favorilerim
              {!loading && (
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#888",
                    marginLeft: 10,
                  }}
                >
                  ({products.length} ürün)
                </span>
              )}
            </h1>

            {products.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <button
                  style={{
                    background: "#fff",
                    border:
                      viewMode === "grid"
                        ? "1.5px solid #4CAF50"
                        : "1px solid #ddd",
                    borderRadius: 6,
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: 14,
                    color: viewMode === "grid" ? "#4CAF50" : "#555",
                  }}
                  onClick={() => setViewMode("grid")}
                >
                  ⊞
                </button>

                <button
                  style={{
                    background: "#fff",
                    border:
                      viewMode === "list"
                        ? "1.5px solid #4CAF50"
                        : "1px solid #ddd",
                    borderRadius: 6,
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: 14,
                    color: viewMode === "list" ? "#4CAF50" : "#555",
                  }}
                  onClick={() => setViewMode("list")}
                >
                  ☰
                </button>

                <select
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 13,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    background: "#fff",
                  }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Sırala</option>
                  <option value="asc">
                    Fiyat: Düşükten Yükseğe
                  </option>
                  <option value="desc">
                    Fiyat: Yüksekten Düşüğe
                  </option>
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color: "#888",
              }}
            >
              <i
                className="fas fa-spinner fa-spin"
                style={{ fontSize: 28 }}
              />
              <p style={{ marginTop: 12, fontSize: 14 }}>
                Yükleniyor...
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color: "#e53935",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          ) : products.length === 0 ? (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>🤍</div>
              <div style={s.emptyTitle}>
                Henüz favori ürünün yok
              </div>
              <div style={s.emptyDesc}>
                Beğendiğin ürünleri favorilere ekleyerek daha
                sonra kolayca bulabilirsin.
              </div>

              <button
                style={s.emptyBtn}
                onClick={() =>
                  (window.location.href = "/products")
                }
              >
                Ürünleri Keşfet
              </button>
            </div>
          ) : (
            <div style={s.productsGrid(viewMode === "list")}>
              {sortedProducts.map((favourite) => (
                <ProductCard
                  key={favourite.product.id}
                  product={favourite.product}
                  openModal={openModal}
                  toggleWish={toggleWish}
                  getImageUrl={getImageUrl}
                  isWished={wishlist.has(
                    favourite.product.id
                  )}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          getImageUrl={getImageUrl}
          closeModal={closeModal}
          handleRent={handleRent}
        />
      )}

      <Toast msg={toast} />
    </div>
  );
}