import "../App.css"
import { useEffect, useRef, useState } from "react"

const DEFAULT_NAV_LINKS = [
  { href: "/products", label: "Tüm Ürünler" },
  { href: "/products?sale=true", label: "İndirimli Ürünler" }
]

export default function Header({ categories = [], wishlistCount = 0, cartCount = 0 }) {
  const [isCatsDropdownOpen, setIsCatsDropdownOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const profileMenuTimer = useRef(null)

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCatsDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleDocumentClick)
    return () => {
      document.removeEventListener("click", handleDocumentClick)
      window.clearTimeout(profileMenuTimer.current)
    }
  }, [])

  const keepProfileMenuOpen = () => {
    window.clearTimeout(profileMenuTimer.current)
    setIsProfileMenuOpen(true)
  }

  const closeProfileMenuLater = () => {
    window.clearTimeout(profileMenuTimer.current)
    profileMenuTimer.current = window.setTimeout(() => {
      setIsProfileMenuOpen(false)
    }, 100)
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            <span className="logo-icon">+</span>lendmate
          </a>
          <div className="search-bar">
            <i className="fas fa-search" />
            <input type="text" placeholder="Marka, ürün veya kategori ara" />
          </div>
          <button
            type="button"
            className="create-listing-btn"
            onClick={() => {
              window.location.href = "/advert"
            }}
          >
            <i className="fas fa-plus" /> Ücretsiz İlan Oluştur
          </button>
          <div className="header-actions">
            <div
              style={{ position: "relative" }}
              onMouseEnter={keepProfileMenuOpen}
              onMouseLeave={closeProfileMenuLater}
            >
              <button
                type="button"
                className="icon-btn"
                onClick={() => {
                  window.location.href = "/profile"
                }}
              >
                <i className="fas fa-user" />
              </button>
              {isProfileMenuOpen && (
                <div
                  onMouseEnter={keepProfileMenuOpen}
                  onMouseLeave={closeProfileMenuLater}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: 180,
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: 14,
                    boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                    zIndex: 120,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/profile"
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#111",
                    }}
                  >
                    Profil
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("token")
                      window.location.href = "/auth"
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#111",
                    }}
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              className="icon-btn wishlist-btn"
              onClick={() => {
                window.location.href = "/favorites"
              }}
            >
              <i className="fas fa-heart" />
              <span className="badge">{wishlistCount}</span>
            </button>
            <button
              type="button"
              className="icon-btn cart-btn"
              onClick={() => {
                window.location.href = "/shopping-cart"
              }}
            >
              <i className="fas fa-shopping-cart" />
              <span className="badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="main-nav" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="nav-inner">
          <div>
            <button
              type="button"
              className="all-cats-btn"
              onClick={(event) => {
                event.stopPropagation()
                setIsCatsDropdownOpen((prev) => !prev)
              }}
            >
              <i className="fas fa-th-large" /> TÜM KATEGORİLER
            </button>
          </div>
          <div>
             {categories.slice(0, 4).map((cat) => (
              <a key={cat.id} href={`/products?categoryId=${cat.id}`}>
                {cat.categoryName}
              </a>
            ))}
            {categories.length > 0 && (
              <a href="/products" style={{ fontWeight: "bold" }}>
                |
              </a>
            )}
            {DEFAULT_NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
           
          </div>
        </div>
      </nav>

      <div className={`cats-dropdown ${isCatsDropdownOpen ? "open" : ""}`} ref={dropdownRef}>
        <div className="cats-grid">
          <a href="/products" className="all-cats-link">
            <i className="fas fa-th" /> Tüm Ürünler
          </a>
          {categories.map((cat) => (
            <a key={cat.id} href={`/products?categoryId=${cat.id}`}>
              <i className="fas fa-tag" /> {cat.categoryName}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
