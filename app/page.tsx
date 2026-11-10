"use client";

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";

type Category = "fruit" | "pantry" | "tea" | "gift";

type Product = {
  id: string;
  name: string;
  region: string;
  category: Category;
  badge: string;
  detail: string;
  price: number;
  image: string;
};

type Bundle = {
  id: string;
  name: string;
  price: number;
  image: string;
  region: string;
  detail: string;
};

type CartLine = { id: string; quantity: number };

const products: Product[] = [
  { id: "mang-cau", name: "Mãng cầu sấy dẻo", region: "Tây Ninh", category: "fruit", badge: "OCOP 4 sao", detail: "100g · Sấy dẻo", price: 89000, image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80" },
  { id: "banh-trang", name: "Bánh tráng phơi sương", region: "Tây Ninh", category: "pantry", badge: "Đặc sản vùng", detail: "500g · Làm thủ công", price: 45000, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80" },
  { id: "mat-ong", name: "Mật ong hoa cà phê", region: "Tây Nguyên", category: "pantry", badge: "Từ nông hộ", detail: "500ml · Thu hoạch theo mùa", price: 120000, image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80" },
  { id: "gao-st25", name: "Gạo thơm mùa mới", region: "Kiên Giang", category: "pantry", badge: "OCOP 5 sao", detail: "1kg · Gạo ngon mỗi ngày", price: 89000, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80" },
  { id: "tra-shan", name: "Trà Shan Tuyết cổ thụ", region: "Hà Giang", category: "tea", badge: "Trà vùng cao", detail: "100g · Búp trà tuyển chọn", price: 180000, image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?auto=format&fit=crop&w=800&q=80" },
  { id: "xoai-say", name: "Xoài sấy dẻo", region: "Đồng Tháp", category: "fruit", badge: "Mùa quả chín", detail: "200g · Vị ngọt tự nhiên", price: 95000, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80" },
  { id: "nuoc-mam", name: "Nước mắm cá cơm", region: "Phú Quốc", category: "pantry", badge: "Ủ chượp truyền thống", detail: "500ml · Đậm vị biển", price: 130000, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80" },
  { id: "hop-qua", name: "Hộp quà miền nắng", region: "Tây Ninh", category: "gift", badge: "Gói quà sẵn", detail: "4 món · Thiệp viết tay", price: 299000, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80" },
];

const bundles: Bundle[] = [
  { id: "box-3", name: "Hộp quà Khởi Đầu · 3 tháng", price: 490000, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80", region: "Nắng Tây Ninh", detail: "Gói định kỳ 3 tháng" },
  { id: "box-6", name: "Hộp quà Hương Sắc · 6 tháng", price: 450000, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80", region: "Nắng Tây Ninh", detail: "Gói định kỳ 6 tháng" },
  { id: "box-12", name: "Hộp quà Tinh Hoa · 12 tháng", price: 399000, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80", region: "Nắng Tây Ninh", detail: "Gói định kỳ 12 tháng" },
];

const regions = ["Tây Ninh", "Kiên Giang", "Tây Nguyên", "Đồng Tháp", "Hà Giang", "Phú Quốc"];
const categoryLabels: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "fruit", label: "Trái cây sấy" },
  { id: "pantry", label: "Đặc sản bếp" },
  { id: "tea", label: "Trà & cà phê" },
  { id: "gift", label: "Hộp quà" },
];
const catalog = [...products, ...bundles];
const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value) + "₫";

function getItem(id: string) {
  return catalog.find((item) => item.id === id);
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [category, setCategory] = useState<"all" | Category>("all");
  const [region, setRegion] = useState("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [toast, setToast] = useState("");
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hdv-cart") || "[]");
      if (Array.isArray(saved)) {
        setCart(saved.filter((item): item is CartLine =>
          typeof item?.id === "string" && Number.isInteger(item.quantity) && item.quantity > 0,
        ));
      }
    } catch {
      localStorage.removeItem("hdv-cart");
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (cartReady) localStorage.setItem("hdv-cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const searchSuggestions = query.trim()
    ? products.filter((product) =>
      `${product.name} ${product.region} ${product.badge}`
        .toLocaleLowerCase("vi")
        .includes(query.trim().toLocaleLowerCase("vi")),
    ).slice(0, 5)
    : [];
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesRegion = region === "all" || product.region === region;
    const matchesQuery = `${product.name} ${product.region} ${product.badge}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi"));
    return matchesCategory && matchesRegion && matchesQuery;
  });
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, line) => total + (getItem(line.id)?.price ?? 0) * line.quantity, 0);

  function addToCart(id: string) {
    const item = getItem(id);
    if (!item) return;
    setCart((current) => {
      const existing = current.find((line) => line.id === id);
      return existing
        ? current.map((line) => line.id === id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { id, quantity: 1 }];
    });
    setToast(`${item.name} đã vào giỏ quà.`);
  }

  function changeQuantity(id: string, change: number) {
    setCart((current) => current
      .map((line) => line.id === id ? { ...line, quantity: line.quantity + change } : line)
      .filter((line) => line.quantity > 0));
  }

  function chooseSearchResult(product: Product) {
    setQuery(product.name);
    setCategory("all");
    setRegion("all");
    setSearchOpen(false);
    setActiveSuggestion(0);
    document.querySelector("#san-pham")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setSearchOpen(false);
      return;
    }
    if (!searchOpen || searchSuggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((current) => (current + 1) % searchSuggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((current) => (current - 1 + searchSuggestions.length) % searchSuggestions.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      chooseSearchResult(searchSuggestions[activeSuggestion]);
    }
  }

  function chooseRegion(event: React.MouseEvent<HTMLAnchorElement>, selectedRegion: string) {
    event.preventDefault();
    setCategory("all");
    setRegion(selectedRegion);
    document.querySelector("#san-pham")?.scrollIntoView({ behavior: "smooth" });
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderCode(`NTN-${Math.floor(100000 + Math.random() * 900000)}`);
    setCart([]);
  }

  return (
    <>
      <div className="announcement">
        <p>Chọn quà từ đất lành <span aria-hidden="true">·</span> Gửi trọn tình quê</p>
        <a href="#qua-doanh-nghiep">Quà tặng doanh nghiệp <span aria-hidden="true">↗</span></a>
      </div>

      <header className="site-header">
        <a className="brand" href="#dau-trang" aria-label="Nắng Tây Ninh, về đầu trang">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span className="brand-copy"><strong>Nắng Tây Ninh</strong><small>ĐẶC SẢN VÙNG MIỀN</small></span>
        </a>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <a href="#san-pham">Cửa hàng</a><a href="#vung-dat">Vùng đất</a><a href="#hop-qua">Hộp quà định kỳ</a><a href="#qua-doanh-nghiep">Quà doanh nghiệp</a>
        </nav>
        <div className="header-actions">
          <div className="search-autocomplete">
            <label className="search-box" htmlFor="search-input"><span aria-hidden="true">⌕</span><input id="search-input" type="search" placeholder="Tìm đặc sản..." autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={searchOpen && query.trim().length > 0} aria-controls="smart-search-results" aria-activedescendant={searchOpen && searchSuggestions.length > 0 ? `search-option-${searchSuggestions[activeSuggestion]?.id}` : undefined} value={query} onFocus={() => setSearchOpen(true)} onBlur={() => setSearchOpen(false)} onKeyDown={handleSearchKeyDown} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); setActiveSuggestion(0); }} /></label>
            {searchOpen && query.trim() && <div className="search-suggestions" id="smart-search-results" role="listbox" aria-label="Gợi ý sản phẩm">
              {searchSuggestions.length > 0 ? searchSuggestions.map((product, index) => <button className="search-suggestion" id={`search-option-${product.id}`} type="button" role="option" aria-selected={index === activeSuggestion} key={product.id} onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setActiveSuggestion(index)} onClick={() => chooseSearchResult(product)}>
                <img src={product.image} alt="" />
                <span className="search-suggestion-copy"><strong>{product.name}</strong><small>{product.region} · {formatPrice(product.price)}</small></span>
                <span className="search-suggestion-tag">{product.badge}</span>
              </button>) : <p className="search-empty">Chưa tìm thấy sản phẩm phù hợp.</p>}
            </div>}
          </div>
          <button className="cart-trigger" type="button" aria-label="Mở giỏ hàng" onClick={() => setCartOpen(true)}><span className="cart-symbol" aria-hidden="true">▱</span><span className="cart-label">Giỏ hàng</span><span className="cart-count">{cartCount}</span></button>
        </div>
      </header>

      <main id="dau-trang">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> TỪ NHỮNG VÙNG ĐẤT LÀNH</p>
            <h1 id="hero-title">Quà quê,<br /><em>chọn từ gốc đất.</em></h1>
            <p className="hero-description">Mỗi thức quà mang theo một miền đất, một mùa vụ và bàn tay người làm nghề. Tuyển chọn tử tế, gửi trao thật gần.</p>
            <div className="hero-actions"><a className="button button-dark" href="#san-pham">Khám phá đặc sản <span aria-hidden="true">→</span></a><a className="text-link" href="#cau-chuyen">Câu chuyện của chúng tôi <span aria-hidden="true">↗</span></a></div>
            <div className="hero-note"><span className="note-seal">OCOP</span><span><strong>Chọn lọc theo mùa</strong><small>Ưu tiên sản phẩm có nguồn gốc rõ ràng</small></span></div>
          </div>
          <div className="hero-visual"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85" alt="Mâm cơm quê với nguyên liệu tươi và món ăn truyền thống" /><div className="hero-caption"><span>01 / 03</span><span>Mùa quà từ miền nắng</span></div><a className="hero-product" href="#san-pham"><span className="product-spark" aria-hidden="true">✳</span><span><small>MÙA ĐANG VÀO</small><strong>Mãng cầu sấy dẻo</strong><small>Tây Ninh · OCOP 4 sao</small></span><b aria-hidden="true">↗</b></a></div>
        </section>

        <section className="promise-bar" aria-label="Cam kết cửa hàng">
          <div><span className="promise-icon" aria-hidden="true">✳</span><span><strong>Tuyển chọn có nguồn gốc</strong><small>Thông tin vùng trồng minh bạch</small></span></div>
          <div><span className="promise-icon" aria-hidden="true">◇</span><span><strong>Ưu tiên chuẩn OCOP</strong><small>Đồng hành cùng nhà làm nghề</small></span></div>
          <div><span className="promise-icon" aria-hidden="true">↗</span><span><strong>Gói quà chỉn chu</strong><small>Cho người thân và đối tác</small></span></div>
        </section>

        <section className="shop-section section-wrap" id="san-pham" aria-labelledby="shop-title">
          <div className="section-heading"><div><p className="eyebrow">GIAN HÀNG THEO MÙA</p><h2 id="shop-title">Đặc sản được thương</h2></div><p className="section-aside">Những món ngon mộc mạc, được tuyển từ các vùng đất Việt.</p></div>
          <div className="shop-toolbar">
            <div className="category-tabs" role="group" aria-label="Lọc theo nhóm sản phẩm">
              {categoryLabels.map((item) => <button key={item.id} type="button" className={`filter-chip ${category === item.id ? "is-active" : ""}`} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}
            </div>
            <label className="select-wrap"><span className="sr-only">Lọc theo vùng miền</span><select value={region} onChange={(event) => setRegion(event.target.value)}><option value="all">Tất cả vùng đất</option>{regions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          </div>
          <div className="product-grid" aria-live="polite">
            {filteredProducts.map((product) => <article className="product-card" key={product.id}>
              <a className="product-image" href="#san-pham" aria-label={`${product.name}, ${product.region}`}><img src={product.image} alt={product.name} loading="lazy" /><span className="product-badge">{product.badge}</span></a>
              <div className="product-info"><p className="product-origin">{product.region}</p><h3>{product.name}</h3><p className="product-meta">{product.detail}</p><div className="product-bottom"><span className="product-price">{formatPrice(product.price)} <small>/ món</small></span><button className="add-button" type="button" aria-label={`Thêm ${product.name} vào giỏ`} onClick={() => addToCart(product.id)}>＋</button></div></div>
            </article>)}
          </div>
          {filteredProducts.length === 0 && <p className="empty-state">Chưa tìm thấy món phù hợp. Thử đổi từ khóa hoặc bộ lọc nhé.</p>}
        </section>

        <section className="origin-section" id="vung-dat" aria-labelledby="origin-title">
          <div className="origin-intro"><p className="eyebrow">MỖI MÓN NGON, MỘT MIỀN ĐẤT</p><h2 id="origin-title">Đi một vòng<br /><em>qua những mùa thương.</em></h2><p>Từ miền phù sa đến cao nguyên lộng gió, hương vị quê nhà bắt đầu từ đất, nước và sự cần mẫn của người làm ra nó.</p><a className="text-link" href="#san-pham">Tìm món theo vùng <span aria-hidden="true">→</span></a></div>
          <a className="origin-tile origin-tay-ninh" href="#san-pham" onClick={(event) => chooseRegion(event, "Tây Ninh")}><img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80" alt="Cánh đồng xanh trải dài dưới nắng" /><span className="origin-label"><small>MIỀN NẮNG GIÓ</small><strong>Tây Ninh</strong><span>Vị ngọt của mùa trái chín ↗</span></span></a>
          <a className="origin-tile origin-mekong" href="#san-pham" onClick={(event) => chooseRegion(event, "Đồng Tháp")}><img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80" alt="Vùng đồng bằng trù phú ven sông" /><span className="origin-label"><small>MIỀN PHÙ SA</small><strong>Đồng bằng sông Cửu Long</strong><span>Mùa quả ngọt, cá tôm đầy ↗</span></span></a>
          <a className="origin-tile origin-highland" href="#san-pham" onClick={(event) => chooseRegion(event, "Tây Nguyên")}><img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80" alt="Hạt cà phê rang thơm của miền cao nguyên" /><span className="origin-label"><small>MIỀN CAO NGUYÊN</small><strong>Tây Nguyên</strong><span>Hương cà phê, vị mật rừng ↗</span></span></a>
        </section>

        <section className="subscription-section section-wrap" id="hop-qua" aria-labelledby="subscription-title">
          <div className="subscription-image"><img src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=85" alt="Hộp quà được gói cẩn thận với dải ruy băng" /><span className="image-stamp">GỬI<br />MỘT<br />MIỀN<br />THƯƠNG</span></div>
          <div className="subscription-copy"><p className="eyebrow">HỘP QUÀ ĐỊNH KỲ</p><h2 id="subscription-title">Mỗi tháng,<br /><em>mở một miền quê.</em></h2><p>Hộp quà theo mùa với 4–5 đặc sản tuyển chọn, câu chuyện từ nghệ nhân và tấm thiệp nhỏ gửi người nhận.</p>
            <div className="plan-list">{bundles.map((bundle) => <button className="plan-row" type="button" key={bundle.id} onClick={() => addToCart(bundle.id)}><span><strong>{bundle.name.replace(/^Hộp quà | · .*$/g, "")}</strong><small>{bundle.detail}</small></span><b>{formatPrice(bundle.price)}<small> / tháng</small></b><span aria-hidden="true">＋</span></button>)}</div>
          </div>
        </section>

        <section className="corporate-section" id="qua-doanh-nghiep" aria-labelledby="corporate-title">
          <div className="corporate-copy"><p className="eyebrow">DÀNH CHO NHỮNG DỊP ĐÁNG NHỚ</p><h2 id="corporate-title">Quà doanh nghiệp,<br /><em>đậm tình đất Việt.</em></h2><p>Chọn đặc sản theo ngân sách, đóng hộp riêng, in lời chúc và gửi đến từng người nhận.</p><a className="button button-light" href="mailto:lienhe@hondatviet.vn?subject=T%C6%B0%20v%E1%BA%A5n%20qu%C3%A0%20doanh%20nghi%E1%BB%87p">Trao đổi về đơn quà <span aria-hidden="true">↗</span></a></div>
          <div className="corporate-points"><div><span>01</span><strong>Chọn quà theo ngân sách</strong><small>Gợi ý set quà theo dịp và người nhận</small></div><div><span>02</span><strong>Cá nhân hóa hộp quà</strong><small>Thiệp, logo và cách gói riêng</small></div><div><span>03</span><strong>Hỗ trợ đơn số lượng lớn</strong><small>Phối hợp giao đến nhiều địa chỉ</small></div></div>
        </section>

        <section className="story-strip section-wrap" id="cau-chuyen"><span className="story-mark" aria-hidden="true">“</span><p>Đằng sau một món quà ngon là cả một miền đất, một mùa vụ, và những người giữ nghề bằng đôi tay của mình.</p><span className="story-signature">Nắng Tây Ninh</span></section>
      </main>

      <footer className="site-footer">
        <div className="footer-main"><a className="brand brand-footer" href="#dau-trang"><span className="brand-mark" aria-hidden="true">N</span><span className="brand-copy"><strong>Nắng Tây Ninh</strong><small>ĐẶC SẢN VÙNG MIỀN</small></span></a><p>Chọn quà từ đất lành.<br />Gửi trọn tình quê.</p><div className="footer-links"><a href="#san-pham">Cửa hàng</a><a href="#hop-qua">Hộp quà định kỳ</a><a href="#qua-doanh-nghiep">Quà doanh nghiệp</a><a href="mailto:lienhe@hondatviet.vn">Liên hệ</a></div><div className="footer-contact"><small>HỖ TRỢ KHÁCH HÀNG</small><a href="tel:1900888999">1900 888 999</a><a href="mailto:lienhe@hondatviet.vn">lienhe@hondatviet.vn</a></div></div>
        <div className="footer-bottom"><span>© 2026 Nắng Tây Ninh</span><span>Đặc sản tuyển chọn từ những vùng đất Việt Nam</span><a href="#dau-trang">Lên đầu trang ↑</a></div>
      </footer>

      <div className="drawer-backdrop" hidden={!cartOpen} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? "is-open" : ""}`} id="cart-drawer" aria-labelledby="cart-title" aria-hidden={!cartOpen}>
        <div className="drawer-heading"><div><p className="eyebrow">GIỎ QUÀ CỦA BẠN</p><h2 id="cart-title">Giỏ hàng <span>{cartCount}</span></h2></div><button className="icon-button" type="button" aria-label="Đóng giỏ hàng" onClick={() => setCartOpen(false)}>×</button></div>
        <div className="cart-items">{cart.map((line) => {
          const item = getItem(line.id);
          if (!item) return null;
          return <article className="cart-line" key={line.id}><img src={item.image} alt="" /><div className="cart-line-copy"><strong>{item.name}</strong><small>{formatPrice(item.price)} · {item.region}</small><div className="quantity-control"><button type="button" aria-label={`Giảm số lượng ${item.name}`} onClick={() => changeQuantity(item.id, -1)}>−</button><span>{line.quantity}</span><button type="button" aria-label={`Tăng số lượng ${item.name}`} onClick={() => changeQuantity(item.id, 1)}>＋</button></div></div><span className="cart-line-total">{formatPrice(item.price * line.quantity)}</span></article>;
        })}</div>
        {cartCount === 0 && <div className="cart-empty"><span aria-hidden="true">◇</span><p>Giỏ quà còn đang đợi món ngon.</p><button className="text-link" type="button" onClick={() => setCartOpen(false)}>Tiếp tục chọn quà →</button></div>}
        {cartCount > 0 && <div className="cart-footer"><div className="cart-subtotal"><span>Tạm tính</span><strong>{formatPrice(cartTotal)}</strong></div><button className="button button-dark button-full" type="button" onClick={() => { setCartOpen(false); setOrderCode(""); setCheckoutOpen(true); }}>Tiến hành đặt hàng <span aria-hidden="true">→</span></button><small>Phí giao hàng sẽ được trao đổi khi xác nhận đơn.</small></div>}
      </aside>

      {checkoutOpen && <div className="dialog-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}>
        <section className="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          {!orderCode ? <form className="checkout-form" onSubmit={submitOrder}>
            <div className="dialog-heading"><div><p className="eyebrow">THÔNG TIN NHẬN QUÀ</p><h2 id="checkout-title">Gửi món quà đi đâu?</h2></div><button className="icon-button" type="button" aria-label="Đóng" onClick={() => setCheckoutOpen(false)}>×</button></div>
            <label>Họ và tên<input name="name" autoComplete="name" required /></label><label>Số điện thoại<input name="phone" type="tel" autoComplete="tel" required /></label><label>Địa chỉ nhận hàng<textarea name="address" rows={2} autoComplete="street-address" required /></label><label>Lời nhắn <span className="optional">(không bắt buộc)</span><textarea name="note" rows={2} /></label>
            <button className="button button-dark button-full" type="submit">Gửi yêu cầu đặt hàng <span aria-hidden="true">→</span></button><p className="form-note">Bản xem trước chưa kết nối hệ thống nhận đơn hay thanh toán.</p>
          </form> : <div className="checkout-success"><span className="success-mark" aria-hidden="true">✓</span><p className="eyebrow">ĐÃ TẠO MÃ XEM TRƯỚC</p><h2 id="checkout-title">Món quà đã sẵn sàng.</h2><p>Mã xem trước {orderCode}. Thông tin chưa được gửi đến cửa hàng; cần kết nối backend để nhận đơn thật.</p><button className="button button-dark button-full" type="button" onClick={() => setCheckoutOpen(false)}>Đóng</button></div>}
        </section>
      </div>}
      <div className={`toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}