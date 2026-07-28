/* =========================================================
   YUUM — script.js
   =========================================================
   Todo lo que necesita editar para conectar productos reales
   está marcado con "EDITAR". El resto es lógica de la tienda
   y normalmente no necesita tocarse.
   ========================================================= */

/* ---------------------------------------------------------
   1. DATOS DE PRODUCTOS  (EDITAR AQUÍ)
   Reemplace name, price, oldPrice, category, image, code y
   description por los datos reales de cada producto.
   El descuento y el conteo del carrito se calculan solos.
   --------------------------------------------------------- */
const YUUM_PRODUCTS = [
  {
    id: "p1",
    name: "Set de maquillaje profesional 12 tonos",
    category: "Belleza",
    price: 129.90,
    oldPrice: 219.00,
    code: "YUUM-BEL-001",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=700&q=80&auto=format&fit=crop",
    description: "Paleta de maquillaje profesional con 12 tonos de larga duración, ideal para uso diario o looks de noche. Fórmula suave para todo tipo de piel, fácil de difuminar y con acabado uniforme."
  },
  {
    id: "p2",
    name: "Zapatos deportivos running unisex",
    category: "Moda",
    price: 108.69,
    oldPrice: 182.60,
    code: "YUUM-MOD-002",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80&auto=format&fit=crop",
    description: "Zapatos deportivos ligeros con suela antideslizante y amortiguación reforzada, perfectos para correr, entrenar o uso casual diario. Diseño transpirable disponible en varias tallas."
  },
  {
    id: "p3",
    name: "Teléfono celular pantalla 6.8\" 256GB",
    category: "Tecnología",
    price: 823.16,
    oldPrice: 1450.00,
    code: "YUUM-TEC-003",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&q=80&auto=format&fit=crop",
    description: "Smartphone con pantalla de 6.8 pulgadas, cámara de alta resolución, batería de larga duración y 256GB de almacenamiento. Ideal para trabajo, fotografía y entretenimiento."
  },
  {
    id: "p4",
    name: "Pantalón cargo para hombre",
    category: "Moda",
    price: 136.31,
    oldPrice: 234.53,
    code: "YUUM-MOD-004",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&q=80&auto=format&fit=crop",
    description: "Pantalón cargo resistente y liviano, con múltiples bolsillos funcionales. Tela transpirable de secado rápido, ideal para uso diario o actividades al aire libre."
  },
  {
    id: "p5",
    name: "Audífonos inalámbricos con estuche de carga",
    category: "Tecnología",
    price: 89.90,
    oldPrice: 159.00,
    code: "YUUM-TEC-005",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&q=80&auto=format&fit=crop",
    description: "Audífonos inalámbricos con cancelación de ruido, sonido de alta fidelidad y estuche de carga portátil. Autonomía prolongada, ideales para el día a día."
  }
];

/* ---------------------------------------------------------
   2. ESTADO GLOBAL
   --------------------------------------------------------- */
let currentCategory = "Todos";
let currentSearch = "";
let cart = []; // { id, qty }

/* ---------------------------------------------------------
   3. UTILIDADES
   --------------------------------------------------------- */
function formatQ(n){
  return "Q" + n.toFixed(2);
}

function discountPercent(price, oldPrice){
  if(!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function findProduct(id){
  return YUUM_PRODUCTS.find(p => p.id === id);
}

function showToast(message){
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
}

/* ---------------------------------------------------------
   4. RENDER DEL CATÁLOGO
   --------------------------------------------------------- */
function renderProducts(){
  const grid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");

  const filtered = YUUM_PRODUCTS.filter(p => {
    const matchesCategory = currentCategory === "Todos" || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = "";

  if(filtered.length === 0){
    noResults.classList.add("show");
    return;
  }
  noResults.classList.remove("show");

  filtered.forEach(p => {
    const discount = discountPercent(p.price, p.oldPrice);
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="product-media">
        ${discount > 0 ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
        <button class="wishlist-btn" aria-label="Guardar en favoritos" data-action="wishlist">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.6 5 6.2 5c2 0 3.4 1 5.8 3.6C14.4 6 15.8 5 17.8 5c3.6 0 5.7 3.4 4.2 6.9C19.5 16.4 12 21 12 21Z" stroke="currentColor" stroke-width="1.8"/></svg>
        </button>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <span class="product-name">${p.name}</span>
        <div class="product-price-row">
          <span class="price-now">${formatQ(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatQ(p.oldPrice)}</span>` : ""}
        </div>
        <div class="product-actions">
          <button class="btn-sm btn-add" data-action="add">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 6h2l1.4 10.2A2 2 0 0 0 9.4 18h8.2a2 2 0 0 0 2-1.7L21 8H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Agregar
          </button>
          <button class="btn-sm btn-view" data-action="view">Ver producto</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* Clicks dentro del grid (delegación de eventos) */
document.getElementById("productGrid").addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if(!card) return;
  const id = card.dataset.id;
  const action = e.target.closest("[data-action]")?.dataset.action;

  if(action === "add"){
    addToCart(id, 1);
    showToast("Producto agregado al carrito");
  } else if(action === "wishlist"){
    showToast("Guardado en favoritos");
  } else {
    openProductModal(id);
  }
});

/* ---------------------------------------------------------
   5. CATEGORÍAS
   --------------------------------------------------------- */
document.querySelectorAll(".cat-pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    renderProducts();
  });
});

/* ---------------------------------------------------------
   6. BÚSQUEDA
   --------------------------------------------------------- */
function handleSearch(value){
  currentSearch = value;
  renderProducts();
}

document.getElementById("searchInput").addEventListener("input", (e) => handleSearch(e.target.value));
document.getElementById("searchInputMobile").addEventListener("input", (e) => {
  document.getElementById("searchInput").value = e.target.value;
  handleSearch(e.target.value);
});

/* ---------------------------------------------------------
   7. MENÚ MÓVIL
   --------------------------------------------------------- */
const mobileNav = document.getElementById("mobileNav");
document.getElementById("hamburgerBtn").addEventListener("click", () => {
  mobileNav.classList.toggle("open");
});
mobileNav.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => mobileNav.classList.remove("open"));
});

/* ---------------------------------------------------------
   8. MODAL DE DETALLE DE PRODUCTO
   --------------------------------------------------------- */
let pdQty = 1;
let pdCurrentId = null;

function openProductModal(id){
  const p = findProduct(id);
  if(!p) return;
  pdCurrentId = id;
  pdQty = 1;

  const discount = discountPercent(p.price, p.oldPrice);
  const content = document.getElementById("pdContent");
  content.innerHTML = `
    <div class="pd-media"><img src="${p.image}" alt="${p.name}"></div>
    <div class="pd-info">
      <span class="product-category">${p.category}</span>
      <h2>${p.name}</h2>
      <div class="pd-price-row">
        <span class="price-now">${formatQ(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${formatQ(p.oldPrice)}</span>` : ""}
      </div>
      ${discount > 0 ? `<span class="pd-discount">${discount}% OFF</span>` : ""}
      <p class="pd-code">Código de producto: ${p.code}</p>
      <p class="pd-desc">${p.description}</p>
      <div class="qty-row">
        <span class="qty-label">Cantidad</span>
        <div class="qty-control">
          <button id="pdQtyMinus" aria-label="Disminuir cantidad">−</button>
          <span id="pdQtyValue">1</span>
          <button id="pdQtyPlus" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <div class="pd-actions">
        <button class="btn btn-ghost" id="pdAddCart">Agregar al carrito</button>
        <button class="btn btn-primary" id="pdBuyNow">Comprar ahora</button>
      </div>
    </div>
  `;

  document.getElementById("pdQtyMinus").addEventListener("click", () => {
    pdQty = Math.max(1, pdQty - 1);
    document.getElementById("pdQtyValue").textContent = pdQty;
  });
  document.getElementById("pdQtyPlus").addEventListener("click", () => {
    pdQty = pdQty + 1;
    document.getElementById("pdQtyValue").textContent = pdQty;
  });
  document.getElementById("pdAddCart").addEventListener("click", () => {
    addToCart(pdCurrentId, pdQty);
    showToast("Producto agregado al carrito");
    closeProductModal();
  });
  document.getElementById("pdBuyNow").addEventListener("click", () => {
    addToCart(pdCurrentId, pdQty);
    closeProductModal();
    openSellerModal();
  });

  document.getElementById("productModalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProductModal(){
  document.getElementById("productModalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
document.getElementById("productModalOverlay").addEventListener("click", (e) => {
  if(e.target.id === "productModalOverlay") closeProductModal();
});

/* ---------------------------------------------------------
   9. CARRITO DE COMPRAS
   --------------------------------------------------------- */
function addToCart(id, qty){
  const existing = cart.find(item => item.id === id);
  if(existing){
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  renderCart();
}

function updateQty(id, delta){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    cart = cart.filter(i => i.id !== id);
  }
  renderCart();
}

function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function cartTotals(){
  let subtotal = 0;
  let count = 0;
  cart.forEach(item => {
    const p = findProduct(item.id);
    if(p){
      subtotal += p.price * item.qty;
      count += item.qty;
    }
  });
  return { subtotal, count };
}

function renderCart(){
  const itemsWrap = document.getElementById("cartItems");
  const { subtotal, count } = cartTotals();

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartSubtotal").textContent = formatQ(subtotal);
  document.getElementById("cartTotal").textContent = formatQ(subtotal);

  if(cart.length === 0){
    itemsWrap.innerHTML = `<p class="cart-empty">Tu carrito está vacío. ¡Explora nuestros productos!</p>`;
    return;
  }

  itemsWrap.innerHTML = "";
  cart.forEach(item => {
    const p = findProduct(item.id);
    if(!p) return;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="cart-item-info">
        <span class="cart-item-name">${p.name}</span>
        <span class="cart-item-price">${formatQ(p.price * item.qty)}</span>
        <div class="cart-item-row">
          <div class="qty-control">
            <button data-action="minus" data-id="${p.id}" aria-label="Disminuir cantidad">−</button>
            <span>${item.qty}</span>
            <button data-action="plus" data-id="${p.id}" aria-label="Aumentar cantidad">+</button>
          </div>
          <button class="remove-btn" data-action="remove" data-id="${p.id}">Eliminar</button>
        </div>
      </div>
    `;
    itemsWrap.appendChild(row);
  });
}

document.getElementById("cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if(!btn) return;
  const id = btn.dataset.id;
  if(btn.dataset.action === "plus") updateQty(id, 1);
  if(btn.dataset.action === "minus") updateQty(id, -1);
  if(btn.dataset.action === "remove") removeFromCart(id);
});

/* Abrir / cerrar carrito */
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");

function openCart(){
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart(){
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/* ---------------------------------------------------------
   10. CÓDIGO DE VENDEDOR + CHECKOUT
   --------------------------------------------------------- */
function openSellerModal(){
  if(cart.length === 0){
    showToast("Agrega al menos un producto antes de continuar");
    return;
  }
  closeCart();
  document.getElementById("sellerError").classList.remove("show");
  document.getElementById("sellerCodeInput").value = "";
  document.getElementById("sellerModalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeSellerModal(){
  document.getElementById("sellerModalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("checkoutBtn").addEventListener("click", openSellerModal);
document.getElementById("closeSellerModal").addEventListener("click", closeSellerModal);
document.getElementById("sellerModalOverlay").addEventListener("click", (e) => {
  if(e.target.id === "sellerModalOverlay") closeSellerModal();
});

document.getElementById("confirmSellerCode").addEventListener("click", () => {
  const code = document.getElementById("sellerCodeInput").value.trim();
  const errorMsg = document.getElementById("sellerError");

  if(code === ""){
    errorMsg.classList.add("show");
    return;
  }
  errorMsg.classList.remove("show");
  closeSellerModal();
  completePurchase(code);
});

function completePurchase(sellerCode){
  const { subtotal, count } = cartTotals();
  document.getElementById("orderSummary").innerHTML = `
    <strong>${count}</strong> producto(s) · Total: <strong>${formatQ(subtotal)}</strong><br>
    Código de vendedor: <strong>${sellerCode}</strong>
  `;
  document.getElementById("confirmModalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";

  // Reiniciar carrito tras compra simulada
  cart = [];
  renderCart();
}

document.getElementById("closeConfirmModal").addEventListener("click", closeConfirmModal);
document.getElementById("continueShoppingBtn").addEventListener("click", closeConfirmModal);

function closeConfirmModal(){
  document.getElementById("confirmModalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------------------------------------------------------
   11. CERRAR MODALES CON TECLA ESC
   --------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape"){
    closeProductModal();
    closeSellerModal();
    closeConfirmModal();
    closeCart();
  }
});

/* ---------------------------------------------------------
   12. INICIALIZACIÓN
   --------------------------------------------------------- */
renderProducts();
renderCart();
