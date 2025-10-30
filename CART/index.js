const productList = document.getElementById("product-list");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping-price");
const totalEl = document.getElementById("total");
const popupElement = document.getElementById("popup");
const addItemBtn = document.getElementById("add-item");

// صور Base64 مضمنة (مثال 3 أحذية)
const images = [
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAADxPgR5AAAAk1BMVEUAAAD///+qqqqenp6jo6OdnZ2tra2cnJzZ2dnq6uqcnJyxsbG7u7vY2NidnZ3v7+/Q0NDb29vm5ubq6uq5ubm+vr6wsLDGxsbOzs7c3NxdXV3T09POzs7k5OSnp6erq6vU1NS7u7sVFRU9PT1CQkJycnKKioo5OTl3d3c1NTWkpKSUlJREWBlAAABnklEQVR4nO3X0XKCMAwA0IURXBNQld//+VqPBNpU7Mf7THl3JU+QAgY0Nu30bNf0rC0pMg2mQidv/bw4kC+IM5B8J1mAGqG7fDJXHz7VbtmF0uJX5p2/Zcxx5mK5XyMvdjKu5+R5A7ov0StpW7v9uGfbfM/n66du4rKydmXHh4ecp4VshLZqf8F3kR/2Vu79++0i9KX+XZ/TU8zEXlX0sN4P5N+mcOy6i9XX6f3zO6U2jlNm21txdZlNfTcXGqLHWcFysd5QJyy2y9qH9sF5yHsWq+1uH3Ue53SPcWwrxK5b9Yv/Tv54kqv0D+pr5ZvXr68X8Bq7/I9zOG/UQAAAABJRU5ErkJggg==",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAADxPgR5AAAArFBMVEUAAAD///+qqqqenp6jo6OdnZ2tra2cnJzZ2dnq6uqcnJyxsbG7u7vY2NidnZ3v7+/Q0NDb29vm5ubq6uq5ubm+vr6wsLDGxsbOzs7c3NxdXV3T09POzs7k5OSnp6erq6vU1NS7u7sVFRU9PT1CQkJycnKKioo5OTl3d3c1NTWkpKSUlJREWBlAAABjklEQVR4nO3XsXKCMBQA0L0MClSSuP//3V0kgGKU5oZOnuH5k2p2sk1Nd7t+KLiSLm9IZtlycAgBAgQIECBDoC/C6o0f+I1r7nkI5z/8dpYw5ln7zBq9I1r0Uu9O9XYsW8C2+zVnH3Zb3Y8i92v+oyW9mGf6t9Gf25vnHiM7b6q9+t+7W+75+L1PYF1xG2+i3JnnYbWwLbmta3sLdgs76+h7vs6fbq31uV/Nz7+vO+G7/+HufQztR+N/Lg2+/8Kiv4b5W4ef0lVg1f73WADw/PXo3L8WqYf1yO+CAAAECBAgQIECAAAECBP4A+HcB4j5osOlAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAADxPgR5AAAAk1BMVEUAAAD///+qqqqenp6jo6OdnZ2tra2cnJzZ2dnq6uqcnJyxsbG7u7vY2NidnZ3v7+/Q0NDb29vm5ubq6uq5ubm+vr6wsLDGxsbOzs7c3NxdXV3T09POzs7k5OSnp6erq6vU1NS7u7sVFRU9PT1CQkJycnKKioo5OTl3d3c1NTWkpKSUlJREWBlAAABnklEQVR4nO3X0XKCMAwA0IURXBNQld//+VqPBNpU7Mf7THl3JU+QAgY0Nu30bNf0rC0pMg2mQidv/bw4kC+IM5B8J1mAGqG7fDJXHz7VbtmF0uJX5p2/Zcxx5mK5XyMvdjKu5+R5A7ov0StpW7v9uGfbfM/n66du4rKydmXHh4ecp4VshLZqf8F3kR/2Vu79++0i9KX+XZ/TU8zEXlX0sN4P5N+mcOy6i9XX6f3zO6U2jlNm21txdZlNfTcXGqLHWcFysd5QJyy2y9qH9sF5yHsWq+1uH3Ue53SPcWwrxK5b9Yv/Tv54kqv0D+pr5ZvXr68X8Bq7/I9zOG/UQAAAABJRU5ErkJggg=="
];

// المنتجات المحلية
let products = [
  { id: 1, name: "Nike Air Zoom Pegasus", price: 120, quantity: 1, image: images[0] },
  { id: 2, name: "Adidas Ultraboost 22", price: 150, quantity: 1, image: images[1] },
  { id: 3, name: "Puma RS-X", price: 100, quantity: 1, image: images[2] }
];

function renderProducts() {
  productList.innerHTML = "";
  products.forEach(product => {
    const li = document.createElement("li");
    li.className = "flex py-4 sm:py-6 relative bg-white rounded-md shadow-sm px-4 items-center transition transform hover:scale-[1.01]";
    li.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="h-24 w-24 rounded-md object-cover shadow-sm" />
      <div class="ml-4 flex flex-1 flex-col justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-900">${product.name}</h3>
          <p class="text-gray-600 text-sm">$${product.price}</p>
        </div>
        <div class="flex items-center space-x-3 mt-2">
          <button class="decrease bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-semibold text-gray-700 transition hover:scale-105">-</button>
          <span class="font-semibold text-lg">${product.quantity}</span>
          <button class="increase bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-semibold text-gray-700 transition hover:scale-105">+</button>
        </div>
      </div>
      <button class="delete absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded-full shadow-md hover:scale-110 transition-all duration-200 ease-in-out" title="Remove item">×</button>
    `;
    productList.appendChild(li);

    li.querySelector(".increase").addEventListener("click", () => {
      product.quantity++;
      updateTotals();
      renderProducts();
    });
    li.querySelector(".decrease").addEventListener("click", () => {
      if (product.quantity > 1) product.quantity--;
      else products = products.filter(p => p.id !== product.id);
      updateTotals();
      renderProducts();
    });
    li.querySelector(".delete").addEventListener("click", () => {
      products = products.filter(p => p.id !== product.id);
      updateTotals();
      renderProducts();
    });
  });
}

function updateTotals() {
  const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${shipping.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

addItemBtn.addEventListener("click", () => {
  if (products.length >= 12) {
    popupElement.classList.remove("hidden");
    return;
  }
  const newId = Date.now();
  const newProduct = {
    id: newId,
    name: "New Nike Shoes",
    price: Math.floor(Math.random() * 200) + 100,
    quantity: 1,
    image: images[Math.floor(Math.random() * images.length)]
  };
  products.push(newProduct);
  renderProducts();
  updateTotals();
});

function hidePopover() {
  popupElement.classList.add("hidden");
}

renderProducts();
updateTotals();
