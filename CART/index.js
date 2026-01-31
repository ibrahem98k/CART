// ========================================
// PREMIUM SHOPPING CART - JAVASCRIPT
// Modern Features & Interactions
// ========================================

// === DOM ELEMENTS ===
const productList = document.getElementById("product-list");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping-price");
const totalEl = document.getElementById("total");
const discountAmountEl = document.getElementById("discount-amount");
const discountRowEl = document.getElementById("discount-row");
const addItemBtn = document.getElementById("add-item");
const checkoutBtn = document.getElementById("checkout-btn");
const stockPopup = document.getElementById("stockPopup");
const stockMessage = document.getElementById("stockMessage");
const emptyState = document.getElementById("empty-state");
const cartCountEl = document.getElementById("cart-count");
const toastContainer = document.getElementById("toast-container");
const recommendationGrid = document.getElementById("recommendation-grid");

// === STATE ===
let products = [
    {
        id: 1,
        name: "Nike Air Zoom Pegasus",
        price: 120,
        quantity: 1,
        stock: 5,
        image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8f3b1f3c-2d6e-4f4b-8f3a-2e3f5c4e6c1e/air-zoom-pegasus-39-mens-running-shoe-KLvDcj.png",
        description: "Lightweight running shoes"
    },
    {
        id: 2,
        name: "Adidas Ultraboost 22",
        price: 150,
        quantity: 1,
        stock: 3,
        image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/8f4f1e1f3c4b4f5e9c1eac1f00a3b2d6_9366/Ultraboost_22_Shoes_Black_GX0240_01_standard.jpg",
        description: "High-performance shoes"
    },
    {
        id: 3,
        name: "Puma RS-X",
        price: 100,
        quantity: 1,
        stock: 10,
        image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/371570/01/sv01/fnd/PNA/fmt/png/Rs-X-Toys.png",
        description: "Stylish streetwear sneakers"
    },
    {
        id: 4,
        name: "Apple AirPods Pro",
        price: 249,
        quantity: 1,
        stock: 8,
        image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
        description: "Active noise cancellation"
    },
    {
        id: 5,
        name: "Samsung Galaxy Watch",
        price: 279,
        quantity: 1,
        stock: 6,
        image: "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-r870nzkamea/gallery/levant-galaxy-watch4-r870-sm-r870nzkamea-478362603?$650_519_PNG$",
        description: "Smart fitness tracker"
    },
    {
        id: 6,
        name: "Sony WH-1000XM5",
        price: 399,
        quantity: 1,
        stock: 4,
        image: "https://www.sony.com/image/5d02da5a1c32e6a955eb7e8a4c725498?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF",
        description: "Premium noise-canceling headphones"
    },
    {
        id: 7,
        name: "Fitbit Charge 5",
        price: 179,
        quantity: 1,
        stock: 12,
        image: "https://www.fitbit.com/global/content/dam/fitbit/global/pdp/devices/charge5/hero-static/black/charge5-black-device-front.png",
        description: "Advanced fitness tracker"
    },
    {
        id: 8,
        name: "Kindle Paperwhite",
        price: 139,
        quantity: 1,
        stock: 15,
        image: "https://m.media-amazon.com/images/I/51QCk82iGcL._AC_SL1000_.jpg",
        description: "Waterproof e-reader"
    }

];

const recommendedProducts = [
    {
        id: 101,
        name: "Running Socks",
        price: 15,
        stock: 50,
        image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=200&h=200&fit=crop",
        description: "Comfortable athletic socks"
    },
    {
        id: 102,
        name: "Sports Watch",
        price: 85,
        stock: 20,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
        description: "Track your performance"
    },
    {
        id: 103,
        name: "Water Bottle",
        price: 25,
        stock: 100,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop",
        description: "Stay hydrated"
    },
    {
        id: 104,
        name: "Gym Bag",
        price: 45,
        stock: 30,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
        description: "Spacious and durable"
    }
];

const promoCodes = {
    SAVE10: { type: "percent", value: 10 },
    FLAT50: { type: "fixed", value: 50 },
    HOLIDAY20: { type: "percent", value: 20 }
};

let discount = { type: null, value: 0, amount: 0, code: null };
let usedPromoCodes = [];
let currentEditProduct = null;

// === TOAST NOTIFICATION SYSTEM ===
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon = type === "success" ? "✓" : type === "error" ? "✕" : "⚠";

    toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close">×</button>
  `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => removeToast(toast));

    setTimeout(() => removeToast(toast), 4000);
}

function removeToast(toast) {
    toast.style.animation = "slideInRight 0.3s ease-out reverse";
    setTimeout(() => toast.remove(), 300);
}

// === RENDER FUNCTIONS ===
function renderProducts() {
    productList.innerHTML = "";

    if (products.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("recommendations").style.display = "none";
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("recommendations").style.display = "block";

        products.forEach((p, index) => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.style.animationDelay = `${index * 0.1}s`;

            // Stock badge styling
            let stockBadgeClass = "in-stock";
            let stockText = `In Stock (${p.stock})`;
            if (p.stock === 0) {
                stockBadgeClass = "out-of-stock";
                stockText = "Out of Stock";
            } else if (p.stock <= 5) {
                stockBadgeClass = "low-stock";
                stockText = `Low Stock (${p.stock})`;
            }

            card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" class="product-image" />
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-description">${p.description || ""}</p>
          <div class="product-price">$${p.price.toFixed(2)}</div>
          <div class="stock-badge ${stockBadgeClass}">${stockText}</div>
          <div class="quantity-controls">
            <button class="quantity-btn decrease" data-id="${p.id}">−</button>
            <span class="quantity-value">${p.quantity}</span>
            <button class="quantity-btn increase" data-id="${p.id}">+</button>
          </div>
        </div>
        <div class="action-buttons">
          <button class="icon-btn save" data-id="${p.id}" title="Save for later">💾</button>
          <button class="icon-btn edit" data-id="${p.id}" title="Edit item">✎</button>
          <button class="icon-btn delete" data-id="${p.id}" title="Remove">×</button>
        </div>
      `;

            productList.appendChild(card);
        });

        // Add event listeners
        document.querySelectorAll(".increase").forEach(btn => {
            btn.addEventListener("click", (e) => handleQuantityChange(e.target.dataset.id, 1));
        });

        document.querySelectorAll(".decrease").forEach(btn => {
            btn.addEventListener("click", (e) => handleQuantityChange(e.target.dataset.id, -1));
        });

        document.querySelectorAll(".delete").forEach(btn => {
            btn.addEventListener("click", (e) => handleDelete(e.target.dataset.id));
        });

        document.querySelectorAll(".edit").forEach(btn => {
            btn.addEventListener("click", (e) => handleEdit(e.target.dataset.id));
        });

        document.querySelectorAll(".save").forEach(btn => {
            btn.addEventListener("click", (e) => handleSaveForLater(e.target.dataset.id));
        });
    }

    updateCartCount();
    saveCart();
}

function renderRecommendations() {
    recommendationGrid.innerHTML = "";

    recommendedProducts.forEach((p, index) => {
        const card = document.createElement("div");
        card.className = "recommendation-card";
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="recommendation-image" onerror="this.src='https://via.placeholder.com/200'"/>
      <h4 class="recommendation-name">${p.name}</h4>
      <div class="recommendation-price">$${p.price.toFixed(2)}</div>
    `;

        card.addEventListener("click", () => addRecommendation(p));
        recommendationGrid.appendChild(card);
    });
}

// === PRODUCT ACTIONS ===
function handleQuantityChange(id, delta) {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) return;

    const newQuantity = product.quantity + delta;

    if (newQuantity <= 0) {
        handleDelete(id);
        return;
    }

    if (newQuantity > product.stock) {
        showStockPopup(product.stock);
        showToast(`Only ${product.stock} items available`, "error");
        return;
    }

    product.quantity = newQuantity;
    renderProducts();
    updateTotals();
    showToast("Quantity updated", "success");
}

function handleDelete(id) {
    const product = products.find(p => p.id === parseInt(id));
    products = products.filter(p => p.id !== parseInt(id));
    renderProducts();
    updateTotals();
    showToast(`${product.name} removed from cart`, "success");
}

function handleEdit(id) {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) return;
    openEditPopup(product);
}

function handleSaveForLater(id) {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) return;

    products = products.filter(p => p.id !== parseInt(id));
    renderProducts();
    updateTotals();
    showToast(`${product.name} saved for later`, "success");
}

function addRecommendation(rec) {
    const newProduct = {
        id: Date.now(),
        name: rec.name,
        price: rec.price,
        quantity: 1,
        stock: rec.stock,
        image: rec.image,
        description: rec.description
    };

    products.push(newProduct);
    renderProducts();
    updateTotals();
    showToast(`${rec.name} added to cart!`, "success");
}

// === TOTALS ===
function updateTotals() {
    const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const shipping = subtotal > 0 ? 10 : 0;

    let discountAmount = 0;
    if (discount.type === "percent") {
        discountAmount = subtotal * discount.value / 100;
    } else if (discount.type === "fixed") {
        discountAmount = discount.value;
    }

    discount.amount = discountAmount;
    let total = subtotal + shipping - discountAmount;
    if (total < 0) total = 0;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = `$${shipping.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;

    if (discountAmount > 0) {
        discountRowEl.style.display = "flex";
        discountAmountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
        discountRowEl.style.display = "none";
    }

    updatePromoDisplay();
}

function updatePromoDisplay() {
    const display = document.getElementById("promo-display");
    if (discount.type) {
        display.style.display = "flex";
        const discountText = discount.type === "percent"
            ? `${discount.value}% OFF`
            : `$${discount.value} OFF`;
        display.innerHTML = `✨ <strong>${discount.code}</strong>: ${discountText} (-$${discount.amount.toFixed(2)})`;
    } else {
        display.style.display = "none";
    }
}

function updateCartCount() {
    const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
    cartCountEl.textContent = totalItems;
}

// === STOCK POPUP ===
function showStockPopup(stock) {
    stockMessage.textContent = `Not enough stock! Only ${stock} items available.`;
    stockPopup.classList.remove("hidden");
}

function closeStockPopup() {
    stockPopup.classList.add("hidden");
}
window.closeStockPopup = closeStockPopup;

// === PROMO CODE ===
document.getElementById("apply-promo").addEventListener("click", () => {
    const input = document.getElementById("promo-input");
    const code = input.value.trim().toUpperCase();
    const feedback = document.getElementById("promo-feedback");

    if (!code) {
        feedback.textContent = "Please enter a promo code";
        feedback.className = "promo-feedback error";
        return;
    }

    if (usedPromoCodes.includes(code)) {
        feedback.textContent = "Promo code already used";
        feedback.className = "promo-feedback error";
        showToast("This promo code has already been used", "error");
        return;
    }

    if (!promoCodes[code]) {
        feedback.textContent = "Invalid promo code";
        feedback.className = "promo-feedback error";
        discount = { type: null, value: 0, amount: 0, code: null };
        updateTotals();
        showToast("Invalid promo code", "error");
        return;
    }

    discount.type = promoCodes[code].type;
    discount.value = promoCodes[code].value;
    discount.code = code;
    usedPromoCodes.push(code);

    feedback.textContent = "✓ Promo code applied successfully!";
    feedback.className = "promo-feedback success";
    input.value = "";

    updateTotals();
    showToast(`Promo code ${code} applied!`, "success");
});

// === CHECKOUT ===
checkoutBtn.addEventListener("click", () => {
    if (products.length === 0) {
        showToast("Your cart is empty!", "error");
        return;
    }

    const total = totalEl.textContent;
    showToast(`Proceeding to checkout! Total: ${total}`, "success");

    setTimeout(() => {
        alert(`🎉 Order Confirmed!\n\nTotal: ${total}\n\nThank you for shopping with ShopLux!`);
    }, 500);
});

// === MODAL MANAGEMENT ===
const addItemPopup = document.getElementById("addItemPopup");
const confirmAddBtn = document.getElementById("confirmAdd");
const cancelAddBtn = document.getElementById("cancelAdd");

addItemBtn.addEventListener("click", () => {
    addItemPopup.classList.remove("hidden");
    clearForm();
});

confirmAddBtn.addEventListener("click", () => {
    saveItem();
});

cancelAddBtn.addEventListener("click", () => {
    addItemPopup.classList.add("hidden");
    clearForm();
});

function clearForm() {
    document.getElementById("itemName").value = "";
    document.getElementById("itemImage").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemQuantity").value = "";
    document.getElementById("itemStock").value = "";
    document.getElementById("itemDescription").value = "";
    confirmAddBtn.textContent = "Add to Cart";
    currentEditProduct = null;
}

function saveItem() {
    const name = document.getElementById("itemName").value.trim();
    const image = document.getElementById("itemImage").value.trim();
    const price = parseFloat(document.getElementById("itemPrice").value);
    const quantity = parseInt(document.getElementById("itemQuantity").value);
    const stock = parseInt(document.getElementById("itemStock").value);
    const description = document.getElementById("itemDescription").value.trim();

    if (!name || !image || isNaN(price) || isNaN(quantity) || isNaN(stock) || quantity <= 0 || stock <= 0) {
        showToast("Please fill all required fields correctly", "error");
        return;
    }

    if (currentEditProduct) {
        currentEditProduct.name = name;
        currentEditProduct.image = image;
        currentEditProduct.price = price;
        currentEditProduct.quantity = quantity > stock ? stock : quantity;
        currentEditProduct.stock = stock;
        currentEditProduct.description = description;
        showToast("Item updated successfully", "success");
    } else {
        products.push({
            id: Date.now(),
            name,
            image,
            price,
            quantity: quantity > stock ? stock : quantity,
            stock,
            description
        });
        showToast(`${name} added to cart!`, "success");
    }

    renderProducts();
    updateTotals();
    addItemPopup.classList.add("hidden");
    clearForm();
}

function openEditPopup(product) {
    currentEditProduct = product;
    document.getElementById("itemName").value = product.name;
    document.getElementById("itemImage").value = product.image;
    document.getElementById("itemPrice").value = product.price;
    document.getElementById("itemQuantity").value = product.quantity;
    document.getElementById("itemStock").value = product.stock;
    document.getElementById("itemDescription").value = product.description || "";
    addItemPopup.classList.remove("hidden");
    confirmAddBtn.textContent = "Save Changes";
}

// === LOCAL STORAGE ===
function saveCart() {
    localStorage.setItem("shoplux_cart", JSON.stringify(products));
    localStorage.setItem("shoplux_discount", JSON.stringify(discount));
    localStorage.setItem("shoplux_used_promos", JSON.stringify(usedPromoCodes));
}

function loadCart() {
    const savedCart = localStorage.getItem("shoplux_cart");
    const savedDiscount = localStorage.getItem("shoplux_discount");
    const savedPromos = localStorage.getItem("shoplux_used_promos");

    if (savedCart) {
        try {
            products = JSON.parse(savedCart);
        } catch (e) {
            console.error("Error loading cart:", e);
        }
    }

    if (savedDiscount) {
        try {
            discount = JSON.parse(savedDiscount);
        } catch (e) {
            console.error("Error loading discount:", e);
        }
    }

    if (savedPromos) {
        try {
            usedPromoCodes = JSON.parse(savedPromos);
        } catch (e) {
            console.error("Error loading promos:", e);
        }
    }
}

// === INITIALIZATION ===
function init() {
    loadCart();
    renderProducts();
    renderRecommendations();
    updateTotals();

    // Welcome message
    setTimeout(() => {
        if (products.length > 0) {
            showToast("Welcome back! Your cart has been restored.", "success");
        }
    }, 500);
}

// Start the app
init();
