import React, { useState, useEffect } from 'react';
import './my-products.css';
import Header from '../components/Header';
import { createAvailability, deleteAvailability, getAllProductsByOwnerId } from '../services/product-service'; // İlgili servis yolunuz
import { getOwnerIdFromToken } from '../services/auth-service';
import { IMAGE_PREFIX } from '../constants';
import Toast from '../components/Toast';

export default function MyProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [selectedProductComments, setSelectedProductComments] = useState(null); // Yorumlar Modalı için

    // Modal State'leri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState("");

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const openCommentsModal = (product) => {
        setSelectedProductComments(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProductComments(null);
    };

    // Bakım Modu Toggle Fonksiyonu
    const handleMaintenanceToggle = (productId) => {
        setProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.id === productId) {
                    const maintenanceItem = product.availabilities.filter(item => item.reason == "MAINTENANCE");
                    const isMaintenance = maintenanceItem.length > 0;

                    if (isMaintenance) {
                        deleteAvailability(maintenanceItem[0].id)
                        showToast(`Ürün ID #${productId} bakım modu kapatıldı.`);

                    } else {
                        const now = new Date().toISOString();
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + 7);

                        createAvailability({
                            productId: product.id,
                            startDate: now,
                            endDate: endDate.toISOString(),
                            reason: "MAINTENANCE"
                        })
                        showToast(`Ürün ID #${productId} bakım modu açıldı.`);

                    }
                    return { ...product, inMaintenance: !isMaintenance };
                }
                return product;
            })
        );
        setIsUpdated(!isUpdated);
    };

    // Bloklama Modu Toggle Fonksiyonu
    const handleBlockToggle = (productId) => {
        setProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.id === productId) {
                    const blockItem = product.availabilities.filter(item => item.reason == "BLOCKED");
                    const isBlocked = blockItem.length > 0;
                    if (isBlocked) {
                        deleteAvailability(blockItem[0].id)
                        showToast(`Ürün ID #${productId} blok modu kapatıldı.`);

                    } else {
                        const now = new Date().toISOString();
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + 7);

                        createAvailability({
                            productId: product.id,
                            startDate: now,
                            endDate: endDate.toISOString(),
                            reason: "BLOCKED"
                        })
                        showToast(`Ürün ID #${productId} blok modu açıldı.`);

                    }
                    return { ...product, isBlocked: !isBlocked };
                }
                return product;
            })
        );
        setIsUpdated(!isUpdated);
    };

    // Tarih formatlama yardımcı fonksiyonu
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    };

    useEffect(() => {
        const ownerId = getOwnerIdFromToken();
        if (!ownerId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        getAllProductsByOwnerId({
            ownerId: ownerId
        })
            .then((data) => {
                console.log({ data })
                const initialProducts = (data || []).map(p => ({
                    ...p,
                    inMaintenance: p.inMaintenance || false,
                    isBlocked: p.isBlocked || false
                }));
                setProducts(initialProducts);
            })
            .catch((err) => {
                console.error('Ürünler getirilirken hata oluştu:', err);
                showToast("Ürünler yüklenirken bir sorun oluştu.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isUpdated]);

    // Modal açıldığında arka plandaki sayfa kaymasını engelleme
    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    }, [isModalOpen]);

    if (loading) {
        return (
            <div>
                <Header categories={[]} wishlistCount={0} cartCount={0} />
                <div className="orders-container">
                    <p>Yayınladığınız ürünler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header categories={[]} wishlistCount={0} cartCount={0} />
            <div className="orders-container">
                {products.length === 0 ? (
                    <p>Yayınladığınız herhangi bir ürün bulunmamaktadır.</p>
                ) : (
                    products.map((product) => {
                        const primaryImg = product.images?.find(img => img.primary) || product.images?.[0];
                        const imgUrl = primaryImg ? IMAGE_PREFIX + primaryImg.imageUrl : 'https://via.placeholder.com/60';

                        return (
                            <div key={product.id} className="order-card">
                                {/* Ürün Üst Bilgileri (Header) - Toggles Sağ Üste Taşındı */}
                                <div className="order-header">
                                    <div className="header-item">
                                        <span className="label">Eklenme Tarihi</span>
                                        <span className="value">{formatDate(product.createdAt)}</span>
                                    </div>
                                    <div className="header-item">
                                        <span className="label">Ürün No / ID</span>
                                        <span className="value">#{product.id}</span>
                                    </div>
                                    <div className="header-item">
                                        <span className="label">Günlük Ücret / Depozito</span>
                                        <span className="value price">
                                            {product.price} {product.currency} / {product.depositAmount || 0} {product.currency}
                                        </span>
                                    </div>
                                    <div className="header-item">
                                        <span className="label">Stok Durumu</span>
                                        <span className="value">{product.stockQuantity} Adet</span>
                                    </div>

                                    {/* Sağ Üst Toggle Switch Alanı */}
                                    <div className="header-toggles">
                                        <div className="header-toggle-item">
                                            <span className="toggle-label">Bakımda</span>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={!!product.availabilities.filter(item => item.reason == "MAINTENANCE").length > 0}
                                                    onChange={() => handleMaintenanceToggle(product.id)}
                                                />
                                                <span className="slider round warning"></span>
                                            </label>
                                        </div>

                                        <div className="header-toggle-item">
                                            <span className="toggle-label">Blokla</span>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={!!product.availabilities.filter(item => item.reason == "BLOCKED").length > 0}
                                                    onChange={() => handleBlockToggle(product.id)}
                                                />
                                                <span className="slider round danger"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Ürün İçeriği ve Kiralama Geçmişi */}
                                <div className="order-content">
                                    {/* Görsel ve Temel Detaylar */}
                                    <div className="product-main-info">
                                        <img src={imgUrl} alt={product.productName} className="product-thumb" />
                                        <div className="product-text-details">
                                            <div className="product-brand">{product.brand}</div>
                                            <div className="product-title">{product.productName}</div>
                                            <div className="product-desc">{product.description}</div>
                                        </div>
                                    </div>

                                    {/* Kiralama Dönemleri / Takvim */}
                                    <div className="availabilities-section">
                                        <span className="availabilities-title">Kiralama Takvimi ({product.availabilities?.length || 0})</span>
                                        <div className="availabilities-list">
                                            {product.availabilities && product.availabilities.length > 0 ? (
                                                product.availabilities.slice(0, 2).map((item) => (
                                                    <div key={item.id} className="availability-badge">
                                                        <span className="status-dot"></span>
                                                        {formatDate(item.startDate)} - {formatDate(item.endDate)}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="no-rentals">Aktif kiralama kaydı yok</span>
                                            )}
                                            {product.availabilities?.length > 2 && (
                                                <span className="more-rentals">+{product.availabilities.length - 2} daha...</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Aksiyon Butonları */}
                                    <div className="actions-section">
                                        <button className="btn-rate" onClick={() => openCommentsModal(product)}>
                                            Yorumlar ({product.comments?.length || 0})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Yorumları Görüntüleme Modalı */}
                {isModalOpen && selectedProductComments && (
                    <div className="modal-overlay">
                        <div className="modal-content-wrapper">
                            <div className="modal-header">
                                <h3>Ürün Yorumları & Değerlendirmeler</h3>
                                <button className="close-button" onClick={closeModal}>✕</button>
                            </div>

                            <div className="modal-body">
                                <div className="modal-product-info">
                                    <div className="modal-product-details">
                                        <h4>{selectedProductComments.brand} {selectedProductComments.productName}</h4>
                                        <p className="modal-product-desc">Toplam {selectedProductComments.comments?.length || 0} yorum bulunmaktadır.</p>
                                    </div>
                                </div>

                                <hr className="divider" />

                                <div className="comments-modal-list">
                                    {selectedProductComments.comments && selectedProductComments.comments.length > 0 ? (
                                        selectedProductComments.comments.map((comm, idx) => (
                                            <div key={comm.id || idx} className="comment-item">
                                                <div className="comment-stars">
                                                    {'★'.repeat(comm.rating || 5)}{'☆'.repeat(5 - (comm.rating || 5))}
                                                </div>
                                                <p className="comment-text">{comm.text || comm.comment}</p>
                                                <span className="comment-date">{formatDate(comm.createdAt)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-comments-text">Bu ürün için henüz yorum yapılmamış.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Toast msg={toast} />
        </div>
    );
}