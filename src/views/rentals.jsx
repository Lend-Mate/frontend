import React, { useState, useEffect } from 'react';
import './rentals.css';
import Header from '../components/Header';
import { getDeliveredOrders } from '../services/order-service';
import { IMAGE_PREFIX } from '../constants';
import { getOwnerIdFromToken } from '../services/auth-service';
import { saveProductComment } from '../services/product-comment-service';
import Toast from '../components/Toast';

export default function RentalsPage() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null); // Modalda gösterilecek dinamik ürün

    // Modal State'leri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [toast, setToast] = useState("");

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setRating(0);
        setComment('');
        setIsChecked(false);
    };

    // Tarih formatlama yardımcı fonksiyonu (Örn: 2026-07-07T10:07:39 -> 7 Temmuz 2026)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    };

    useEffect(() => {
        setLoading(true);
        getDeliveredOrders()
            .then((ordersData) => {
                // Gelen gerçek API şemasına göre veriyi UI'a uygun haritalıyoruz
                const formattedRentals = ordersData.map(order => {
                    const products = order.items.map(item => {
                        const prodDetail = item.product || {};
                        // Birincil resmi (primary: true) bulmaya çalış, yoksa ilk resmi al
                        const primaryImg = prodDetail.images?.find(img => img.primary) || prodDetail.images?.[0];

                        return {
                            id: prodDetail.id || item.id,
                            name: prodDetail.productName || 'Bilinmeyen Ürün',
                            description: prodDetail.description || '',
                            brand: prodDetail.brand || '',
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            startDate: formatDate(item.startDate),
                            endDate: formatDate(item.endDate),
                            // Backend'den sadece dosya adı (UUID) geliyorsa base URL'inizi başına ekleyebilirsiniz. 
                            // Şimdilik doğrudan gelen url değerini atıyoruz.
                            img: primaryImg ? IMAGE_PREFIX + primaryImg.imageUrl : 'https://via.placeholder.com/60'
                        };
                    });

                    return {
                        id: order.id,
                        rentalNumber: order.orderNumber,
                        date: formatDate(order.createdAt),
                        summary: `1 Teslimat, ${products.length} Ürün`,
                        total: `${order.totalPrice} ${order.items[0]?.product?.currency || 'TL'}`,
                        status: order.status === 'DELIVERED' ? 'Teslim Edildi' : order.status,
                        statusDesc: 'Kiralama süreci başarıyla tamamlandı',
                        products: products
                    };
                });

                setRentals(formattedRentals);
            })
            .catch(err => {
                console.error('Kiralama geçmişi alınırken hata oluştu:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Modal açıldığında arka plandaki sayfa kaymasını engelleme
    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    }, [isModalOpen]);

    const saveProductCommentFunction = () => {
        if (!selectedProduct) return;

        const commentObject = {
            productId: selectedProduct.id,
            rating: rating,
            text: comment,
            userId: getOwnerIdFromToken() // Kullanıcı ID'sini token'dan alıyoruz
        };

        saveProductComment(commentObject)
            .then(response => {
                console.log('Yorum başarıyla kaydedildi:', response);
                closeModal();
                showToast("Yorumunuz başarıyla kaydedildi!");
            })
            .catch(err => {
                console.error('Yorum kaydedilirken hata oluştu:', err);
                showToast("Yorum kaydedilirken bir hata oluştu.");
            });

    }
    if (loading) {
        return (
            <div>
                <Header categories={[]} wishlistCount={0} cartCount={0} />
                <div className="orders-container"><p>Kiralama geçmişi yükleniyor...</p></div>
            </div>
        );
    }

    return (
        <div>
            <Header categories={[]} wishlistCount={0} cartCount={0} />
            <div className="orders-container">
                {rentals.length === 0 ? (
                    <p>Tamamlanmış kiralama işleminiz bulunmamaktadır.</p>
                ) : (
                    rentals.map((rental) => (
                        <div key={rental.id} className="order-card">
                            {/* Kiralama Üst Bilgileri */}
                            <div className="order-header">
                                <div className="header-item">
                                    <span className="label">Kiralama Tarihi</span>
                                    <span className="value">{rental.date}</span>
                                </div>
                                <div className="header-item">
                                    <span className="label">Kiralama No</span>
                                    <span className="value">#{rental.rentalNumber}</span>
                                </div>
                                <div className="header-item">
                                    <span className="label">Özet</span>
                                    <span className="value">{rental.summary}</span>
                                </div>
                                <div className="header-item">
                                    <span className="label">Toplam Tutar</span>
                                    <span className="value price">{rental.total}</span>
                                </div>
                            </div>

                            {/* Kiralama Durumu ve Ürünler */}
                            <div className="order-content">
                                <div className="status-section">
                                    <span className="status-icon">✓</span>
                                    <div>
                                        <div className="status-text">{rental.status}</div>
                                        <div className="status-sub">{rental.statusDesc}</div>
                                    </div>
                                </div>

                                <div className="products-images">
                                    {rental.products.map((prod, index) => (
                                        <div key={prod.id + '-' + index} className="product-thumb-wrapper" title={`${prod.brand} ${prod.name}`}>
                                            <img src={prod.img} alt={prod.name} className="product-thumb" />
                                        </div>
                                    ))}
                                </div>

                                {/* Butona basıldığında o kiralamadaki ilk ürünü modala gönderir */}
                                <button className="btn-rate" onClick={() => openModal(rental.products[0])}>
                                    Değerlendir
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* Ürünü Değerlendir Modal (Pop-up) */}
                {isModalOpen && selectedProduct && (
                    <div className="modal-overlay">
                        <div className="modal-content-wrapper">
                            <div className="modal-header">
                                <h3>Kiralama Deneyimini Değerlendir</h3>
                                <button className="close-button" onClick={closeModal}>✕</button>
                            </div>

                            <div className="modal-body">
                                {/* Ürün Detayı */}
                                <div className="modal-product-info">
                                    <img src={selectedProduct.img} alt={selectedProduct.name} className="modal-product-img" />
                                    <div className="modal-product-details">
                                        <h4>{selectedProduct.brand} {selectedProduct.name}</h4>
                                        <p className="modal-product-desc">{selectedProduct.description}</p>
                                        <p className="modal-rental-period"><b>Kiralama Dönemi:</b> {selectedProduct.startDate} - {selectedProduct.endDate}</p>
                                    </div>
                                </div>

                                <hr className="divider" />

                                {/* Puanlama Bölümü */}
                                <div className="rating-section">
                                    <p className="rating-title">Hizmeti aşağıdan puanlayabilir ve yorum yazabilirsin</p>
                                    <div className="stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`star ${(hoverRating || rating) >= star ? 'filled' : ''}`}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Yorum Alanı */}
                                <div className="comment-section">
                                    <div className="comment-header">
                                        <label htmlFor="comment">Yorumunu Yaz</label>
                                        <a href="#criteria" className="criteria-link">Yorum Yayınlama Kriterleri</a>
                                    </div>
                                    <div className="textarea-container">
                                        <textarea
                                            id="comment"
                                            maxLength={2000}
                                            placeholder="Ürün temiz ve sorunsuzdu. Zamanında teslim aldım, süreç çok hızlı ilerledi."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <span className="char-count">{comment.length}/2000</span>
                                    </div>
                                </div>

                                {/* Onay ve Uyarı Metinleri */}
                                <div className="checkbox-section">
                                    <input
                                        type="checkbox"
                                        id="privacy"
                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(e.target.checked)}
                                    />
                                    <label htmlFor="privacy">
                                        Yorumlarda ismimin gözükmesine ve yorum detaylarının platform genelinde kullanılmasına izin veriyorum. Aydınlatma Metni'ne ulaşmak için <a href="#link">tıklayınız</a>
                                    </label>
                                </div>

                                <p className="legal-warning">
                                    Sağlık beyanı veya tıbbi öneri içeren değerlendirmeleriniz ilgili mevzuata aykırı olduğundan yayımlanmamaktadır.
                                </p>

                                {/* Gönder Butonu */}
                                <button
                                    className={`btn-submit ${rating > 0 && comment.trim() && isChecked ? 'active' : ''}`}
                                    disabled={!(rating > 0 && comment.trim() && isChecked)}
                                    onClick={saveProductCommentFunction}
                                >
                                    Gönder
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Toast msg={toast} />
        </div>
    );
}