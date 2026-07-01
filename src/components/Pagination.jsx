export default function Pagination({ page, totalPages, onPageChange }) {
  const getPages = () => {
    const pages = [];

    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages - 1, page + 2);

    if (start > 0) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    return pages;
  };

  return (
    <div style={styles.paginationWrapper}>
      {/* Prev */}
      <button
        style={styles.navBtn}
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        ←
      </button>

      {/* Pages */}
      {getPages().map((p, idx) =>
        p === "..." ? (
          <span key={idx} style={styles.dots}>...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              ...styles.pageBtn,
              ...(p === page ? styles.activePage : {}),
            }}
          >
            {p + 1}
          </button>
        )
      )}

      {/* Next */}
      <button
        style={styles.navBtn}
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        →
      </button>
    </div>
  );
}

const styles = {
  paginationWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 32,
    padding: "16px 0",
  },

  pageBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    color: "#374151",
    transition: "all 0.2s ease",
  },

  activePage: {
    background: "#111827",
    color: "#fff",
    border: "1px solid #111827",
    fontWeight: 600,
    transform: "scale(1.05)",
  },

  navBtn: {
    minWidth: 40,
    height: 36,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },

  dots: {
    padding: "0 6px",
    color: "#9ca3af",
  },
};