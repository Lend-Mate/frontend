import { useState, useEffect } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductDetailModal";
import { getAllProducts, getAllCategories, searchProducts, getUniqueBrands } from "../services/product-service";
import { addToCart } from "../services/order-service";
import { getOwnerIdFromToken } from "../services/auth-service";
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";
// S3 bucket base URL — kendi bucket adresinle değiştir
const S3_BASE = "https://lendmate-budget.s3.eu-north-1.amazonaws.com"

function getImageUrl(key) {
  if (!key) return 'https://placehold.co/400x300?text=Görsel+Yok'
  if (key.startsWith('http')) return key
  return `${S3_BASE}/${key}`
}

// ── STYLES ──────────────────────────────────────────────────────────────────
const s = {
  page: { display: "flex", gap: 0, minHeight: "100vh", maxWidth: 1100, margin: "0 auto", padding: "0 16px", fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", color: "#111" },
  sidebar: { width: 220, flexShrink: 0, padding: "20px 16px 20px 0" },
  filterBox: { background: "#fff", borderRadius: 10, border: "1px solid #eee", padding: 16, marginBottom: 12 },
  filterTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#111" },
  filterItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#444", marginBottom: 8, cursor: "pointer" },
  moreBtn: { border: "1px solid #ddd", background: "none", padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", color: "#555", marginTop: 4, fontFamily: "inherit" },
  main: { flex: 1, padding: "20px 0" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  viewBtns: { display: "flex", gap: 4 },
  viewBtn: (active) => ({ background: "#fff", border: active ? "1.5px solid #4CAF50" : "1px solid #ddd", borderRadius: 6, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: active ? "#4CAF50" : "#555" }),
  sortSelect: { border: "1px solid #ddd", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#fff" },
  productsGrid: (list) => ({ display: "grid", gridTemplateColumns: list ? "1fr" : "repeat(3, 1fr)", gap: 14 }),
}

// ── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ brands, checkedBrands, onBrandToggle, priceRange, onPriceRangeToggle, rentalDaysRange, onRentalDaysToggle }) {
  return (
    <aside style={s.sidebar}>
      <div style={s.filterBox}>
        <div style={s.filterTitle}>Markalar</div>
        {brands.map((brand) => (
          <label key={brand} style={s.filterItem}>
            <input
              type="checkbox"
              checked={checkedBrands.has(brand)}
              onChange={() => onBrandToggle(brand)}
              style={{ accentColor: "#4CAF50", width: 15, height: 15, cursor: "pointer" }}
            />
            {brand}
          </label>
        ))}
      </div>

      <div style={s.filterBox}>
        <div style={s.filterTitle}>Fiyat Aralığı</div>
        {priceRange.map((range) => (
          <label key={range.label} style={s.filterItem}>
            <input
              type="checkbox"
              checked={range.checked}
              onChange={() => onPriceRangeToggle(range)}
              style={{ accentColor: "#4CAF50", width: 15, height: 15, cursor: "pointer" }}
            />
            {range.label}
          </label>
        ))}
      </div>

      <div style={s.filterBox}>
        <div style={s.filterTitle}>Kiralama Süresi</div>
        {rentalDaysRange.map((range) => (
          <label key={range.label} style={s.filterItem}>
            <input
              type="checkbox"
              checked={range.checked}
              onChange={() => onRentalDaysToggle(range)}
              style={{ accentColor: "#4CAF50", width: 15, height: 15, cursor: "pointer" }}
            />
            {range.label}
          </label>
        ))}
      </div>
    </aside>
  )
}

// ── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function Products() {
  const [pageData, setPageData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
  })
  const [page, setPage] = useState(0)
  const [size] = useState(12)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cartCount, setCartCount] = useState(0)
  const [wishlist, setWishlist] = useState(new Set())
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("default")
  const [checkedBrands, setCheckedBrands] = useState(new Set())
  const [toast, setToast] = useState("")
  const [modalProduct, setModalProduct] = useState(null)
  const [searchDuration, setSearchDuration] = useState(0)
  const [brands, setBrands] = useState([])


  const [priceRange, setPriceRange] = useState([
    {"label": "500 Altı", "min": 0, "max": 499},
    {"label": "500 - 1000", "min": 500, "max": 999},
    {"label": "1000 - 2000", "min": 1000, "max": 1999},
    {"label": "2000 - 5000", "min": 2000, "max": 4999},
    {"label": "5000 Üzeri", "min": 5000, "max": 999999999999999}
  ])

  const [rentalDaysRange, setRentalDaysRange] = useState([
    {"label": "1-7 Gün", "min": 1, "max": 7},
    {"label": "7-14 Gün", "min": 7, "max": 14},
    {"label": "14-30 Gün", "min": 14, "max": 30},
    {"label": "30+ Gün", "min": 30, "max": 999999999999999}
  ])

  // URL'den categoryId parametresini oku
  const urlParams = new URLSearchParams(window.location.search)
  const categoryIdFilter = urlParams.get('categoryId')

  const textSearch = urlParams.get('search')

  useEffect(() => {
    const params = {
      text: textSearch || undefined,
      categoryId: categoryIdFilter || undefined,
      brands: checkedBrands.size > 0 ? Array.from(checkedBrands) : undefined,
      minPrice: priceRange.find(r => r.checked)?.min,
      maxPrice: priceRange.find(r => r.checked)?.max,
      minRentalDays: rentalDaysRange.find(r => r.checked)?.min,
      maxRentalDays: rentalDaysRange.find(r => r.checked)?.max,
    };
    getUniqueBrands(params).then(_brands => {
      setBrands(_brands);
    }).catch(err => {
      console.error("Markalar yüklenirken bir hata oluştu:", err)
    })
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await handleGetProducts(0);
      } catch (err) {
        setError("Ürünler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [textSearch, checkedBrands, priceRange, rentalDaysRange, sortBy]);


  const handleGetProducts = async (pageNumber = page) => {
    const startTime = performance.now();

    let result;
    const params = {
      text: textSearch || undefined,
      page: pageNumber,
      size,
      sortBy: sortBy === "default" ? "id" : "price",
      ascending: sortBy !== "desc",
      categoryId: categoryIdFilter || undefined,
      brands: checkedBrands.size > 0 ? Array.from(checkedBrands) : undefined,
      minPrice: priceRange.find(r => r.checked)?.min,
      maxPrice: priceRange.find(r => r.checked)?.max,
      minRentalDays: rentalDaysRange.find(r => r.checked)?.min,
      maxRentalDays: rentalDaysRange.find(r => r.checked)?.max,
    };

    if (!textSearch) {
      result = await getAllProducts(params);
    } else {
      result = await searchProducts(params);
    } 

    const endTime = performance.now();
    setSearchDuration(endTime - startTime);

    setPageData(result);

    return result;
  };


  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  // Filtre + sıralama
  const products = pageData.content || [];

  const toggleWish = (id) => {
    setWishlist(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleBrandToggle(brand) {
    setCheckedBrands(prev => {
      const next = new Set(prev)
      next.has(brand) ? next.delete(brand) : next.add(brand)
      return next
    })
  }

  const openModal = (product) => setModalProduct(product)
  const closeModal = () => setModalProduct(null)

  const handleRent = (product) => {
    setCartCount(prev => prev + 1)
    closeModal()
    showToast(`${product.productName} sepete eklendi!`)
    const userId = getOwnerIdFromToken();
    addToCart({ productId: product.id, userId }).catch(err => {
      console.error("Sepete ürün eklenirken bir hata oluştu:", err)
      showToast("Ürün sepette eklenirken bir hata oluştu.")
    })
  }

  // Aktif kategori adı
  const activeCategoryName = categoryIdFilter
    ? categories.find(c => String(c.id) === categoryIdFilter)?.categoryName
    : null

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <Header categories={categories} wishlistCount={wishlist.size} cartCount={cartCount} />

      {/* ── ANA IÇERIK ── */}
      <div style={s.page}>
        <Sidebar
          brands={brands}
          checkedBrands={checkedBrands}
          onBrandToggle={handleBrandToggle}
          priceRange={priceRange}
          onPriceRangeToggle={(range) => {
            setPriceRange(prev => prev.map(r => r.label === range.label ? { ...r, checked: !r.checked } : r));
          }}
          rentalDaysRange={rentalDaysRange}
          onRentalDaysToggle={(range) => {
            setRentalDaysRange(prev => prev.map(r => r.label === range.label ? { ...r, checked: !r.checked } : r));
          }}
        />

        <main style={s.main}>
          {/* Başlık */}
          <h1 style={{ marginTop: 0, fontSize: "1.9rem", fontWeight: 600, color: "#111827", marginBottom: 18, letterSpacing: "-0.01em" }}>
            {activeCategoryName ? activeCategoryName : 'Tüm Ürünler'}
          </h1>

          {/* Toolbar */}
          <div style={s.toolbar}>
            <div style={s.viewBtns}>
              <button style={s.viewBtn(viewMode === "grid")} onClick={() => setViewMode("grid")}>⊞</button>
              <button style={s.viewBtn(viewMode === "list")} onClick={() => setViewMode("list")}>☰</button>
            </div>
            <div style={{ fontSize: 13, color: "#888" }}>
              {loading ? 'Yükleniyor...' : `${pageData.totalElements} ürün bulundu`}

              <span style={{ margin: "0 8px", color: "#ddd" }}>|</span>

              {searchDuration > 0 && ` Arama süresi: ${searchDuration.toFixed(2)} ms`}
            </div>
            <select style={s.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Sırala</option>
              <option value="asc">Fiyat: Düşükten Yükseğe</option>
              <option value="desc">Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>

          {/* Ürün Grid */}
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: 28 }} />
              <p style={{ marginTop: 12, fontSize: 14 }}>Ürünler yükleniyor...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#e53935', fontSize: 14 }}>{error}</div>
          ) : (
            <>
              <div style={s.productsGrid(viewMode === "list")}> 
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    openModal={openModal}
                    toggleWish={toggleWish}
                    getImageUrl={getImageUrl}
                    isWished={wishlist.has(product.id)}
                  />
                ))}
              </div>
              {products.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: "#888", fontSize: 14 }}>
                  Seçilen filtrelere göre ürün bulunamadı.
                </div>
              )}
            </>
          )}

          {!loading ? <Pagination
            page={pageData.number}
            totalPages={pageData.totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              handleGetProducts(newPage);
            }}
          />
            : null}
        </main>
      </div>

      {/* ── MODAL ── */}
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
  )
}