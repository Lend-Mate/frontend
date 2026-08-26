# HemenKirala Frontend

HemenKirala, kullanıcıların ürünleri inceleyip filtreleyerek kiralayabildiği, ürün ekleyebildiği ve kiralama süreçlerini yönetebildiği React tabanlı web uygulamasıdır.

<img width="1470" height="766" alt="Ekran Resmi 2026-08-27 00 25 06" src="https://github.com/user-attachments/assets/ea311a0a-4aac-4217-a38e-425a10cd3ed1" />
<img width="1470" height="766" alt="Ekran Resmi 2026-08-27 00 25 20" src="https://github.com/user-attachments/assets/7fbcd586-01e1-40a7-8357-b26f03c4752c" />
<img width="1470" height="766" alt="Ekran Resmi 2026-08-27 00 25 28" src="https://github.com/user-attachments/assets/23913c4e-6e9e-4e4e-b39e-ae945eda129d" />


---

## İçindekiler
- [Genel Bakış](#genel-bakış)
- [Mimari](#mimari)
- [Teknolojiler](#teknolojiler)
- [API Endpoints](#api-endpoints)
- [Kurulum](#kurulum)
- [Testler](#testler)

---

## Genel Bakış

Uygulama, HemenKirala ürün kiralama platformunun kullanıcı arayüzünü sağlar. Giriş yapan kullanıcılar ana sayfada kategorileri ve ürünleri görüntüleyebilir, ürün araması yapabilir, filtreleme ve sıralama uygulayabilir, ürünleri favorilerine veya sepete ekleyebilir. Ayrıca kendi ürünlerini yayınlayabilir, profilini güncelleyebilir ve kiralama/sipariş geçmişini görüntüleyebilir.

### Temel Özellikler

- JWT tabanlı giriş ve kullanıcı kaydı
- Kategori, marka, fiyat ve kiralama süresi filtreleri
- Metin tabanlı ürün arama ve sıralama
- Sayfalama ve grid/liste görünümü
- Ürün detaylarını, görsellerini ve yorumlarını görüntüleme
- Favori ve alışveriş sepeti yönetimi
- Ürün oluşturma, güncelleme, silme ve müsaitlik yönetimi
- Profil ve kiralama/sipariş geçmişi yönetimi
- Görselleri backend üzerinden S3'e yükleme

---

## Mimari

### Katmanlar

- **Sunum:** `App.jsx`, `components/` ve `views/` altında React bileşenleri
- **Yönlendirme:** `main.jsx` içinde React Router ve token kontrolü yapan `PrivateRoute`
- **Servis:** `services/` altında Axios tabanlı backend çağrıları
- **API istemcileri:** `services/api.jsx` içinde JWT ekleme ve 401 yönetimi
- **Stiller ve varlıklar:** CSS dosyaları ve `src/assets/`

Axios interceptor'ı `localStorage` içindeki `token` değerini `Bearer` token olarak isteklere ekler. Backend 401 döndürdüğünde token silinir ve kullanıcı `/auth` sayfasına yönlendirilir.

### Klasör Yapısı

```text
src/
├── App.jsx                         # Ana sayfa
├── main.jsx                        # Router ve uygulama başlangıcı
├── constants.jsx                   # Ortak sabitler
├── components/                     # Ortak React bileşenleri
├── services/                       # Axios servis fonksiyonları
├── views/                          # Uygulama sayfaları
└── *.css                           # Uygulama ve görünüm stilleri
```

### Sayfalar ve Route'lar

| Route | Sayfa | Erişim |
|---|---|---|
| `/auth` | Giriş ve kayıt | Herkese açık |
| `/` | Ana sayfa | Giriş gerekli |
| `/products` | Ürün listesi, arama ve filtreler | Giriş gerekli |
| `/product-detail` | Ürün detay sayfası | Giriş gerekli |
| `/favorites` | Favori ürünler | Giriş gerekli |
| `/shopping-cart` | Sepet ve sipariş | Giriş gerekli |
| `/advert` | Ürün ilanı oluşturma | Giriş gerekli |
| `/profile` | Kullanıcı profili | Giriş gerekli |
| `/rentals` | Kiralama/sipariş geçmişi | Giriş gerekli |
| `/my-products` | Kullanıcının ürünleri | Giriş gerekli |

---

## Teknolojiler

| Teknoloji | Versiyon | Kullanım Amacı |
|---|---|---|
| React | `^19.2.6` | Kullanıcı arayüzü |
| React DOM | `^19.2.6` | React'i DOM'a bağlama |
| React Router | `^7.15.0` | Sayfa yönlendirme ve route koruması |
| Axios | `^1.16.1` | REST API istekleri |
| Vite | `^8.0.12` | Geliştirme sunucusu ve production build |
| ESLint | `^10.3.0` | Kod kalite kontrolleri |
| Nginx | `stable-alpine` | Production statik dosya sunumu |
| Node.js | `22-alpine` | Docker build aşaması |

---

## API Endpoints

### Kimlik Doğrulama ve Kullanıcı

| Method | Endpoint | Açıklama | Auth |
|---|---|---|---|
| `POST` | `/auth/login` | Kullanıcı girişi ve JWT alma | Hayır |
| `POST` | `/auth/register` | Yeni kullanıcı kaydı | Hayır |
| `GET` | `/users/me` | Profil getirir | Evet |
| `PUT` | `/users/me` | Profili günceller | Evet |

### Ürün ve Kategori

| Method | Endpoint | Açıklama | Auth |
|---|---|---|---|
| `GET` | `/products` | Sayfalı ürün listesi, filtreleme ve sıralama | Evet |
| `GET` | `/products/{id}` | Ürün detayını getirir | Evet |
| `GET` | `/products/search` | Metin araması yapar | Evet |
| `GET` | `/products/brands` | Benzersiz markaları getirir | Evet |
| `GET` | `/products/user` | Kullanıcının ürünlerini listeler | Evet |
| `POST` | `/products` | Yeni ürün oluşturur | Evet |
| `PUT` | `/products/{id}` | Ürünü günceller | Evet |
| `DELETE` | `/products/{id}` | Ürünü siler | Evet |
| `GET` | `/categories` | Kategorileri listeler | Evet |
| `GET` | `/categories/{id}` | Kategori detayını getirir | Evet |

### Sepet, Sipariş ve Favoriler

| Method | Endpoint | Açıklama | Auth |
|---|---|---|---|
| `GET` | `/carts/users/{userId}` | Kullanıcının sepetini getirir | Evet |
| `POST` | `/carts` | Ürünü sepete ekler | Evet |
| `DELETE` | `/carts/{id}` | Sepet kaydını siler | Evet |
| `POST` | `/orders` | Sipariş oluşturur | Evet |
| `GET` | `/orders/user/{userId}` | Kullanıcının siparişlerini getirir | Evet |
| `GET` | `/favourites` | Tüm favorileri getirir | Evet |
| `GET` | `/favourites/{id}` | Favori detayını getirir | Evet |
| `GET` | `/favourites/user/{userId}` | Kullanıcının favorilerini getirir | Evet |
| `POST` | `/favourites` | Favori ekler | Evet |
| `PUT` | `/favourites/{id}` | Favoriyi günceller | Evet |
| `DELETE` | `/favourites/{id}` | Favoriyi siler | Evet |

### Görsel, Yorum ve Müsaitlik

| Method | Endpoint | Açıklama | Auth |
|---|---|---|---|
| `POST` | `/files/upload` | Görseli multipart form-data olarak yükler | Evet |
| `POST` | `/product-image/{productId}/images` | Ürün görsellerini kaydeder | Evet |
| `DELETE` | `/product-image` | Ürün görsellerini siler | Evet |
| `POST` | `/product-comments` | Ürün yorumu kaydeder | Evet |
| `POST` | `/product-availability` | Müsaitlik aralığı oluşturur | Evet |
| `DELETE` | `/product-availability` | Müsaitlik aralığını siler | Evet |

---

## Kurulum

### Gereksinimler

- Node.js 22 veya uyumlu güncel bir sürüm
- npm
- Çalışır durumda HemenKirala backend API'si

API adresi `src/services/api.jsx` içindeki `productApi` ve `userApi` istemcilerinde tanımlıdır. Yerel backend kullanırken bu adresler ilgili local adreslerle değiştirilmelidir.

### Çalıştırma

```bash
npm install
npm run dev
```

Geliştirme sunucusu varsayılan olarak `http://localhost:3000` adresinde çalışır.

Production build ve preview:

```bash
npm run build
npm run preview
```

Docker ile çalıştırma:

```bash
docker compose up --build
```

Docker yapılandırması uygulamayı Nginx ile sunar ve 80 numaralı portu kullanır. Compose dosyası önceden oluşturulmuş `lendmate-net` harici ağına bağlanmayı bekler.

---

## Testler

Projede ayrı bir test framework'ü veya test script'i tanımlı değildir. Kod kalite ve production derleme kontrolleri şu komutlarla çalıştırılabilir:

```bash
npm run lint
npm run build
```
