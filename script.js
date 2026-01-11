// Data
const services = [
  { id: "svc_fade", name: "Skin Fade", desc: "Precision taper, razor-finished.", price: 250 },
  { id: "svc_classic", name: "Classic Cut", desc: "Clean, timeless silhouette.", price: 200 },
  { id: "svc_beard", name: "Beard Trim & Shape", desc: "Line-up, sculpt, nourish.", price: 150 },
  { id: "svc_combo", name: "Cut + Beard Combo", desc: "Full refresh package.", price: 320 },
  { id: "svc_kid", name: "Kids Cut", desc: "Sharp and age-appropriate.", price: 160 }
];

const products = [
  { id: "prd_pomade", name: "Matte Pomade", cat: "styling", price: 180, img: "https://images.unsplash.com/photo-1603252109303-2751441dd157" },
  { id: "prd_clay", name: "Texture Clay", cat: "styling", price: 190, img: "https://images.unsplash.com/photo-1512496015851-a80348e3fcff" },
  { id: "prd_oil", name: "Cedar Beard Oil", cat: "beard", price: 220, img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f" },
  { id: "prd_balm", name: "Beard Balm Medium Hold", cat: "beard", price: 210, img: "https://images.unsplash.com/photo-1542831371-dfce06d2fc37" },
  { id: "prd_shampoo", name: "Gentle Shampoo", cat: "care", price: 160, img: "https://images.unsplash.com/photo-1585650258291-839f94ca2db0" },
  { id: "prd_conditioner", name: "Hydrate Conditioner", cat: "care", price: 170, img: "https://images.unsplash.com/photo-1604881987511-cb155ab8ecb3" }
];

// State
const state = {
  route: "home",
  cart: JSON.parse(localStorage.getItem("cart") || "[]")
};

// Utils
const formatR = (n) => `R${n.toFixed(2)}`;
const saveCart = () => localStorage.setItem("cart", JSON.stringify(state.cart));
const setRoute = (route) => {
  state.route = route;
  document.querySelectorAll(".view").forEach(v => v.classList.remove("show"));
  document.getElementById(route).classList.add("show");
  document.querySelectorAll(".nav-link").forEach(b => {
    b.classList.toggle("active", b.dataset.route === route);
  });
  if (route === "cart") renderCart();
  if (route === "services") renderServices();
  if (route === "shop") renderProducts();
  if (route === "booking") renderBookingServices();
};

// Render services
function renderServices() {
  const wrap = document.getElementById("services-list");
  wrap.innerHTML = services.map(s => `
    <div class="card">
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <p class="price">${formatR(s.price)}</p>
      <button class="btn" onclick="prefillBooking('${s.id}')">Book this</button>
    </div>
  `).join("");
}

// Render products
function productCard(p) {
  return `
    <div class="product card">
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="muted">Category: ${p.cat}</p>
      <p class="price">${formatR(p.price)}</p>
      <button class="btn primary" onclick="addToCart('${p.id}')">Add to cart</button>
    </div>
  `;
}
function renderProducts() {
  const q = document.getElementById("shop-search").value.trim().toLowerCase();
  const cat = document.getElementById("shop-filter").value;
  const list = products.filter(p =>
    (cat === "all" || p.cat === cat) &&
    (q === "" || p.name.toLowerCase().includes(q))
  );
  document.getElementById("products-grid").innerHTML =
    list.map(productCard).join("") || `<p>No products match your search.</p>`;
}

// Cart logic
function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existing = state.cart.find(c => c.id === id);
  if (existing) existing.qty += 1;
  else state.cart.push({ id, name: item.name, price: item.price, img: item.img, qty: 1 });
  saveCart();
  renderCart();
  setRoute("cart");
}

function changeQty(id, delta) {
  const target = state.cart.find(c => c.id === id);
  if (!target) return;
  target.qty = Math.max(1, target.qty + delta);
  saveCart();
  renderCart();
}

function removeItem(id) {
  state.cart = state.cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const wrap = document.getElementById("cart-items");
  if (state.cart.length === 0) {
    wrap.innerHTML = `<p>Your cart is empty.</p>`;
  } else {
    wrap.innerHTML = state.cart.map(c => `
      <div class="cart-item">
        <img src="${c.img}" alt="${c.name}" />
        <div>
          <strong>${c.name}</strong>
          <p>${formatR(c.price)} each</p>
          <div class="qty">
            <button class="btn" onclick="changeQty('${c.id}', -1)">−</button>
            <span>${c.qty}</span>
            <button class="btn" onclick="changeQty('${c.id}', 1)">+</button>
            <button class="btn" onclick="removeItem('${c.id}')">Remove</button>
          </div>
        </div>
        <div><strong>${formatR(c.price * c.qty)}</strong></div>
      </div>
    `).join("");
  }
  const subtotal = state.cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const shipping = state.cart.length ? 50 : 0;
  document.getElementById("cart-subtotal").textContent = formatR(subtotal);
  document.getElementById("cart-shipping").textContent = formatR(shipping);
  document.getElementById("cart-total").textContent = formatR(subtotal + shipping);
}

// Booking logic
function renderBookingServices() {
  const select = document.getElementById("booking-service");
  select.innerHTML = `<option value="">Select a service</option>` +
    services.map(s => `<option value="${s.id}">${s.name} — ${formatR(s.price)}</option>`).join("");
}

function prefillBooking(serviceId) {
  setRoute("booking");
  renderBookingServices();
  const select = document.getElementById("booking-service");
  select.value = serviceId;
}

function confirmBooking(evt) {
  evt.preventDefault();
  const form = evt.target;
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.name || !data.phone || !data.email || !data.date || !data.time || !data.service) {
    alert("Please complete all required fields.");
    return;
  }
  const chosen = services.find(s => s.id === data.service);
  const booking = { ...data, serviceName: chosen?.name, createdAt: new Date().toISOString() };
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  const conf = document.getElementById("booking-confirmation");
  conf.classList.remove("hidden");
  conf.textContent = `Booking confirmed for ${booking.serviceName} on ${booking.date} at ${booking.time}. We’ll contact you to confirm.`;
  form.reset();
}

// Contact logic
function submitContact(evt) {
  evt.preventDefault();
  const conf = document.getElementById("contact-confirmation");
  conf.classList.remove("hidden");
  conf.textContent = "Thanks for reaching out! We’ll get back to you soon.";
  evt.target.reset();
}

// Nav
document.querySelectorAll(".nav-link, .cta .btn").forEach(btn => {
  btn.addEventListener("click", () => setRoute(btn.dataset.route));
});

// Inputs
document.getElementById("shop-search").addEventListener("input", renderProducts);
document.getElementById("shop-filter").addEventListener("change", renderProducts);
document.getElementById("cart-clear").addEventListener("click", () => {
  state.cart = [];
  saveCart();
  renderCart();
});
document.getElementById("cart-checkout").addEventListener("click", () => {
  if (!state.cart.length) return alert("Your cart is empty.");
  alert("Demo checkout complete. Integrate PayFast/Yoco for real payments.");
  state.cart = [];
  saveCart();
  renderCart();
});
document.getElementById("booking-form").addEventListener("submit", confirmBooking);
document.getElementById("contact-form").addEventListener("submit", submitContact);

const hours = {
  Sunday: ["09:00", "10:00", "11:00", "12:00"],
  Monday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  Tuesday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  Wednesday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  Thursday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  Friday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  Saturday: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"]
};

document.getElementById("date").addEventListener("change", function () {
  const selectedDate = new Date(this.value);
  const day = selectedDate.toLocaleDateString("en-ZA", { weekday: "long" });
  const timeSelect = document.getElementById("time");
  timeSelect.innerHTML = "";

  if (hours[day]) {
    hours[day].forEach(time => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    });
  } else {
    const option = document.createElement("option");
    option.textContent = "Closed";
    timeSelect.appendChild(option);
  }
});

document.getElementById("booking-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  document.getElementById("confirmation").textContent = `Thanks ${name}, your appointment is booked for ${date} at ${time}.`;
});

// Misc
document.getElementById("year").textContent = new Date().getFullYear();

// Initial render
setRoute("home");
renderServices();
renderProducts();

