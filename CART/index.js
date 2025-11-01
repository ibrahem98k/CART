const productList=document.getElementById("product-list");
const subtotalEl=document.getElementById("subtotal");
const shippingEl=document.getElementById("shipping-price");
const totalEl=document.getElementById("total");
const addItemBtn=document.getElementById("add-item");
const checkoutBtn=document.getElementById("checkout-btn");
const stockPopup=document.getElementById("stockPopup");
const stockMessage=document.getElementById("stockMessage");

let products=[
{id:1,name:"Nike Air Zoom Pegasus",price:120,quantity:1,stock:5,image:"https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8f3b1f3c-2d6e-4f4b-8f3a-2e3f5c4e6c1e/air-zoom-pegasus-39-mens-running-shoe-KLvDcj.png",description:"Lightweight running shoes"},
{id:2,name:"Adidas Ultraboost 22",price:150,quantity:1,stock:3,image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/8f4f1e1f3c4b4f5e9c1eac1f00a3b2d6_9366/Ultraboost_22_Shoes_Black_GX0240_01_standard.jpg",description:"High-performance shoes"},
{id:3,name:"Puma RS-X",price:100,quantity:1,stock:10,image:"https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/371570/01/sv01/fnd/PNA/fmt/png/Rs-X-Toys.png",description:"Stylish streetwear sneakers"}
];

const promoCodes={SAVE10:{type:"percent",value:10},FLAT50:{type:"fixed",value:50},HOLIDAY20:{type:"percent",value:20}};
let discount={type:null,value:0,amount:0,code:null};
let usedPromoCodes=[];
let currentEditProduct=null;

function renderProducts(){
productList.innerHTML="";
products.forEach(p=>{
const li=document.createElement("li");
li.className="flex py-4 sm:py-6 relative bg-white rounded-md shadow-sm px-4 items-center transition transform hover:scale-[1.01]";
li.innerHTML=`
<img src="${p.image}" alt="${p.name}" class="h-24 w-24 rounded-md object-cover shadow-sm" />
<div class="ml-4 flex flex-1 flex-col justify-between">
<div>
<h3 class="text-sm font-medium text-gray-900">${p.name}</h3>
<p class="text-gray-600 text-sm">$${p.price}</p>
<p class="text-gray-500 text-xs mt-1">Stock: ${p.stock}</p>
${p.description? `<p class="text-gray-500 text-xs mt-1">${p.description}</p>` : ""}
</div>
<div class="flex items-center space-x-3 mt-2">
<button class="decrease bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-semibold text-gray-700 transition hover:scale-105">-</button>
<span class="font-semibold text-lg">${p.quantity}</span>
<button class="increase bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-semibold text-gray-700 transition hover:scale-105">+</button>
</div>
</div>
<div class="absolute top-2 right-2 flex gap-2">
<button class="edit bg-yellow-400 hover:bg-yellow-500 text-white w-7 h-7 rounded-full text-sm font-bold shadow-md">✎</button>
<button class="delete bg-red-600 hover:bg-red-700 text-white w-7 h-7 rounded-full text-sm font-bold shadow-md">×</button>
</div>
`;
productList.appendChild(li);
li.querySelector(".increase").addEventListener("click", ()=>{
if(p.quantity<p.stock){p.quantity++;updateTotals();renderProducts();}else{showStockPopup(p.stock);}});
li.querySelector(".decrease").addEventListener("click", ()=>{
if(p.quantity>1)p.quantity--;else products=products.filter(x=>x.id!==p.id);updateTotals();renderProducts();});
li.querySelector(".delete").addEventListener("click", ()=>{
products=products.filter(x=>x.id!==p.id);updateTotals();renderProducts();});
li.querySelector(".edit").addEventListener("click", ()=>{openEditPopup(p);});
});
}

function updateTotals(){
const subtotal=products.reduce((s,p)=>s+p.price*p.quantity,0);
const shipping=subtotal>0?10:0;
let discountAmount=0;
if(discount.type==="percent") discountAmount=subtotal*discount.value/100;
else if(discount.type==="fixed") discountAmount=discount.value;
discount.amount=discountAmount;
let total=subtotal+shipping-discountAmount;
if(total<0) total=0;
subtotalEl.textContent=`$${subtotal.toFixed(2)}`;
shippingEl.textContent=`$${shipping.toFixed(2)}`;
totalEl.textContent=`$${total.toFixed(2)}`;
document.getElementById("promo-display").textContent=discount.type?`Applied: -$${discount.amount.toFixed(2)} (${discount.type==="percent"?discount.value+"%":"$"+discount.value})`:"";
}

function showStockPopup(stock){stockMessage.textContent="Not enough stock! Available: "+stock;stockPopup.classList.remove("hidden");}
function closeStockPopup(){stockPopup.classList.add("hidden");}

document.getElementById("apply-promo").addEventListener("click", ()=>{
const input=document.getElementById("promo-input");
const code=input.value.trim().toUpperCase();
const feedback=document.getElementById("promo-feedback");
if(usedPromoCodes.includes(code)){feedback.textContent="Already used this promo code";return;}
if(!promoCodes[code]){feedback.textContent="Invalid promo code";discount={type:null,value:0,amount:0,code:null};updateTotals();return;}
discount.type=promoCodes[code].type;
discount.value=promoCodes[code].value;
discount.code=code;
usedPromoCodes.push(code);
feedback.textContent="Promo applied!";
updateTotals();
});

checkoutBtn.addEventListener("click", ()=>{alert("Proceeding to checkout! Total: "+totalEl.textContent);});

const addItemPopup=document.getElementById("addItemPopup");
const confirmAddBtn=document.getElementById("confirmAdd");
const cancelAddBtn=document.getElementById("cancelAdd");
addItemBtn.addEventListener("click", ()=>{addItemPopup.classList.remove("hidden");clearForm();});
confirmAddBtn.addEventListener("click", ()=>{saveItem();});
cancelAddBtn.addEventListener("click", ()=>{addItemPopup.classList.add("hidden");clearForm();});

function clearForm(){
document.getElementById("itemName").value="";
document.getElementById("itemImage").value="";
document.getElementById("itemPrice").value="";
document.getElementById("itemQuantity").value="";
document.getElementById("itemStock").value="";
document.getElementById("itemDescription").value="";
confirmAddBtn.textContent="Add";
currentEditProduct=null;
}

function saveItem(){
const name=document.getElementById("itemName").value.trim();
const image=document.getElementById("itemImage").value.trim();
const price=parseFloat(document.getElementById("itemPrice").value);
const quantity=parseInt(document.getElementById("itemQuantity").value);
const stock=parseInt(document.getElementById("itemStock").value);
const description=document.getElementById("itemDescription").value.trim();
if(!name||!image||isNaN(price)||isNaN(quantity)||isNaN(stock)||quantity<=0) return;
if(currentEditProduct){
currentEditProduct.name=name;
currentEditProduct.image=image;
currentEditProduct.price=price;
currentEditProduct.quantity=quantity>stock?stock:quantity;
currentEditProduct.stock=stock;
currentEditProduct.description=description;
}else{
products.push({id:Date.now(),name,image,price,quantity:quantity>stock?stock:quantity,stock,description});
}
renderProducts();updateTotals();addItemPopup.classList.add("hidden");clearForm();
}

function openEditPopup(product){
currentEditProduct=product;
document.getElementById("itemName").value=product.name;
document.getElementById("itemImage").value=product.image;
document.getElementById("itemPrice").value=product.price;
document.getElementById("itemQuantity").value=product.quantity;
document.getElementById("itemStock").value=product.stock;
document.getElementById("itemDescription").value=product.description;
addItemPopup.classList.remove("hidden");confirmAddBtn.textContent="Save";
}

renderProducts();
updateTotals();
