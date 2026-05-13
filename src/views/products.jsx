import { useState } from "react";

// ============================
// DATA
// ============================
const PRODUCTS = [
  {
    id: 1, brand: "Apple", name: "Apple iPhone 15 128GB",
    specs: "6.1 inç, A16 Bionic, 5G, 2 Kamera, 6 GB Ram",
    img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=300&auto=format",
    prices: { "3 Ay": 3100, "6 Ay": 2950, "12 Ay": 2880, "24 Ay": 2810 }, defaultDur: "24 Ay",
  },
  {
    id: 2, brand: "Apple", name: "Apple iPhone 16 Pro Max 256GB",
    specs: "6.9 inç, A18 Pro çip, Pro kamera",
    img: "https://images.unsplash.com/photo-1632661674596-618d8b64a6e2?w=300&auto=format",
    prices: { "3 Ay": 7500, "6 Ay": 7100, "12 Ay": 6950, "24 Ay": 6740 }, defaultDur: "24 Ay",
  },
  {
    id: 3, brand: "Apple", name: "Apple iPhone 15 Pro Max 256GB",
    specs: "6.7 inç, A17 Bionic, 5G, 3 Kamera, 8 GB Ram",
    img: "https://images.unsplash.com/photo-1698527264261-dc58db8e8a7c?w=300&auto=format",
    prices: { "3 Ay": 5200, "6 Ay": 5000, "12 Ay": 4900, "24 Ay": 4805 }, defaultDur: "24 Ay",
  },
  {
    id: 4, brand: "Samsung", name: "Samsung Galaxy S24 Ultra 256GB",
    specs: "6.8 inç, Snapdragon 8 Gen 3, 12 GB Ram, S Pen",
    img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&auto=format",
    prices: { "3 Ay": 4200, "6 Ay": 3950, "12 Ay": 3800, "24 Ay": 3650 }, defaultDur: "24 Ay",
  },
  {
    id: 5, brand: "Samsung", name: "Samsung Galaxy Z Fold6 512GB",
    specs: "7.6 inç katlanabilir, 12 GB Ram, S Pen",
    img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&auto=format",
    prices: { "3 Ay": 8200, "6 Ay": 7800, "12 Ay": 7500, "24 Ay": 7200 }, defaultDur: "24 Ay",
  },
  {
    id: 6, brand: "Xiaomi", name: "Xiaomi 15T Pro 12GB 1TB",
    specs: "12 GB Ram, 1 TB Depolama, Leica Kamera",
    img: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format",
    prices: { "1 Ay": 4200, "3 Ay": 3800, "6 Ay": 3600, "24 Ay": 3385 }, defaultDur: "24 Ay",
  },
];

const BRANDS = ["Apple", "DJI", "General Mobile", "Oppo", "Reeder", "Samsung", "Xiaomi"];

const SUB_CATS = [
  { label: "iPhone 17", img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=150&auto=format" },
  { label: "Samsung Galaxy", img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&auto=format" },
  { label: "iPhone 15", img: "https://images.unsplash.com/photo-1698527264261-dc58db8e8a7c?w=150&auto=format" },
  { label: "600 TL Altı Telefon", img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=150&auto=format" },
  { label: "Akıllı Saatler", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format" },
];

// ============================
// STYLES (inline — no external CSS needed)
// ============================
const s = {
  page: { display: "flex", gap: 0, minHeight: "100vh", maxWidth: 1280, margin: "0 auto", padding: "0 16px", fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", color: "#111" },
  sidebar: { width: 220, flexShrink: 0, padding: "20px 16px 20px 0" },
  sidebarMenu: { background: "#fff", borderRadius: 10, border: "1px solid #eee", overflow: "hidden", marginBottom: 16 },
  sidebarItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", borderLeft: active ? "3px solid #4CAF50" : "3px solid transparent", color: active ? "#4CAF50" : "#111", background: active ? "#f0faf0" : "transparent" }),
  sidebarIcon: { width: 28, height: 28, background: "#f5f5f5", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 },
  filterBox: { background: "#fff", borderRadius: 10, border: "1px solid #eee", padding: 16, marginBottom: 12 },
  filterTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#111" },
  filterItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#444", marginBottom: 8, cursor: "pointer" },
  moreBtn: { border: "1px solid #ddd", background: "none", padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", color: "#555", marginTop: 4, fontFamily: "inherit" },
  main: { flex: 1, padding: "20px 0" },
  subCats: { display: "flex", gap: 12, marginBottom: 20, overflowX: "auto", paddingBottom: 4 },
  subCat: { flexShrink: 0, background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "12px 16px", textAlign: "center", cursor: "pointer", minWidth: 130, transition: "all .15s" },
  subCatImg: { width: 80, height: 60, objectFit: "contain", margin: "0 auto 8px", display: "block" },
  subCatLabel: { fontSize: 12, fontWeight: 600, color: "#111" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  viewBtns: { display: "flex", gap: 4 },
  viewBtn: (active) => ({ background: "#fff", border: active ? "1.5px solid #4CAF50" : "1px solid #ddd", borderRadius: 6, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: active ? "#4CAF50" : "#555" }),
  sortSelect: { border: "1px solid #ddd", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#fff" },
  productsGrid: (list) => ({ display: "grid", gridTemplateColumns: list ? "1fr" : "repeat(3, 1fr)", gap: 14 }),
  productCard: { background: "#fff", borderRadius: 12, border: "1.5px solid #eee", overflow: "hidden", cursor: "pointer", transition: "all .18s", position: "relative" },
  wishBtn: (on) => ({ position: "absolute", top: 10, right: 10, background: "#fff", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,.12)", fontSize: 14, color: on ? "#e53935" : "#aaa" }),
  prodImg: { height: 160, background: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  prodImgEl: { width: "100%", height: "100%", objectFit: "contain" },
  prodInfo: { padding: 14 },
  prodBrand: { fontSize: 11, fontWeight: 700, color: "#4CAF50", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 3 },
  prodName: { fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.3, marginBottom: 4 },
  prodSpecs: { fontSize: 11, color: "#888", marginBottom: 12, minHeight: 28 },
  durPills: { display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 },
  durPill: (active) => ({ fontSize: 10, fontWeight: 600, padding: "4px 9px", borderRadius: 20, border: active ? "1.5px solid #4CAF50" : "1.5px solid #ddd", cursor: "pointer", color: active ? "#4CAF50" : "#777", background: active ? "#f0faf0" : "#fff", fontFamily: "inherit" }),
  prodPrice: { fontSize: 16, fontWeight: 800, color: "#111" },
  prodPriceSmall: { fontSize: 10, fontWeight: 400, color: "#888" },
  rentBtn: { display: "block", width: "100%", background: "#4CAF50", color: "#fff", fontWeight: 700, fontSize: 13, padding: 10, border: "none", borderRadius: 8, cursor: "pointer", marginTop: 10, fontFamily: "inherit" },
};

// ============================
// COMPONENTS
// ============================

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "12px 24px", borderRadius: 50, fontSize: 13, fontWeight: 600, zIndex: 99, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#4CAF50" }}>✓</span> {msg}
    </div>
  );
}

function ProductCard({ product, wished, onWish, selectedDur, onDurChange, onRent }) {
  const price = product.prices[selectedDur] ?? product.prices[product.defaultDur];

  return (
    <div style={s.productCard}>
      <button style={s.wishBtn(wished)} onClick={(e) => { e.stopPropagation(); onWish(product.id); }}>
        {wished ? "♥" : "♡"}
      </button>
      <div style={s.prodImg}>
        <img src={product.img} alt={product.name} style={s.prodImgEl} loading="lazy" />
      </div>
      <div style={s.prodInfo}>
        <div style={s.prodBrand}>{product.brand}</div>
        <div style={s.prodName}>{product.name}</div>
        <div style={s.prodSpecs}>{product.specs}</div>
        <div style={s.durPills}>
          {Object.keys(product.prices).map((dur) => (
            <button
              key={dur}
              style={s.durPill(dur === selectedDur)}
              onClick={(e) => { e.stopPropagation(); onDurChange(product.id, dur); }}
            >
              {dur}
            </button>
          ))}
        </div>
        <div style={s.prodPrice}>
          {price.toLocaleString("tr-TR")} TL{" "}
          <span style={s.prodPriceSmall}>/ Aylık ödenecek tutar</span>
        </div>
        <button style={s.rentBtn} onClick={(e) => { e.stopPropagation(); onRent(product); }}>
          Kirala
        </button>
      </div>
    </div>
  );
}

function Sidebar({ checkedBrands, onBrandToggle }) {
  const sidebarItems = [
    { label: "Telefon & Aksesuarları", icon: "📱", active: true },
    { label: "Telefonlar", icon: "📞", active: false },
    { label: "Telefon Aksesuarları", icon: "🔌", active: false },
  ];

  return (
    <aside style={s.sidebar}>
      <div style={s.sidebarMenu}>
        {sidebarItems.map((item) => (
          <div key={item.label} style={s.sidebarItem(item.active)}>
            <div style={s.sidebarIcon}>{item.icon}</div>
            {item.label}
          </div>
        ))}
      </div>

      <div style={s.filterBox}>
        <div style={s.filterTitle}>Markalar</div>
        {BRANDS.map((brand) => (
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
        <button style={s.moreBtn}>Daha Fazla</button>
      </div>

      <div style={s.filterBox}>
        <div style={s.filterTitle}>Fiyat Aralığı</div>
        {["500 Altı", "500 - 1000", "1000 - 2000", "2000 - 5000", "5000 Üzeri"].map((range) => (
          <label key={range} style={s.filterItem}>
            <input type="checkbox" style={{ accentColor: "#4CAF50", width: 15, height: 15, cursor: "pointer" }} />
            {range} TL
          </label>
        ))}
      </div>

      <div style={s.filterBox}>
        <div style={s.filterTitle}>Kiralama Süresi</div>
        {["1 Ay", "3 Ay", "6 Ay", "12 Ay", "24 Ay"].map((dur) => (
          <label key={dur} style={s.filterItem}>
            <input type="checkbox" style={{ accentColor: "#4CAF50", width: 15, height: 15, cursor: "pointer" }} />
            {dur}
          </label>
        ))}
      </div>
    </aside>
  );
}

// ============================
// MAIN PAGE COMPONENT
// ============================
export default function Products() {
  const [selectedDurations, setSelectedDurations] = useState(() => {
    const init = {};
    PRODUCTS.forEach((p) => (init[p.id] = p.defaultDur));
    return init;
  });
  const [wishlist, setWishlist] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [checkedBrands, setCheckedBrands] = useState(new Set());
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  function handleWish(id) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleDurChange(id, dur) {
    setSelectedDurations((prev) => ({ ...prev, [id]: dur }));
  }

  function handleBrandToggle(brand) {
    setCheckedBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  }

  function handleRent(product) {
    showToast(`${product.name} sepete eklendi!`);
  }

  let products = [...PRODUCTS];
  if (checkedBrands.size > 0) products = products.filter((p) => checkedBrands.has(p.brand));
  if (sortBy === "asc") products.sort((a, b) => (a.prices[selectedDurations[a.id]] ?? 0) - (b.prices[selectedDurations[b.id]] ?? 0));
  if (sortBy === "desc") products.sort((a, b) => (b.prices[selectedDurations[b.id]] ?? 0) - (a.prices[selectedDurations[a.id]] ?? 0));

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f7f7f7", minHeight: "100vh" }}>
      
      <div style={s.page}>
        
        <Sidebar checkedBrands={checkedBrands} onBrandToggle={handleBrandToggle} />

        <main style={s.main}>
          {/* Sub-categories */}
          <div style={s.subCats}>
            {SUB_CATS.map((sc) => (
              <div key={sc.label} style={s.subCat}>
                <img src={sc.img} alt={sc.label} style={s.subCatImg} />
                <p style={s.subCatLabel}>{sc.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={s.toolbar}>
            <div style={s.viewBtns}>
              <button style={s.viewBtn(viewMode === "grid")} onClick={() => setViewMode("grid")}>⊞</button>
              <button style={s.viewBtn(viewMode === "list")} onClick={() => setViewMode("list")}>☰</button>
            </div>
            <div style={{ fontSize: 13, color: "#888" }}>{products.length} ürün bulundu</div>
            <select style={s.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sırala</option>
              <option value="asc">Fiyat: Düşükten Yükseğe</option>
              <option value="desc">Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>

          {/* Product Grid */}
          <div style={s.productsGrid(viewMode === "list")}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={wishlist.has(product.id)}
                onWish={handleWish}
                selectedDur={selectedDurations[product.id]}
                onDurChange={handleDurChange}
                onRent={handleRent}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#888", fontSize: 14 }}>
              Seçilen filtrelere göre ürün bulunamadı.
            </div>
          )}
        </main>
      </div>

      <Toast msg={toast} />
    </div>
  );
}