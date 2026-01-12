// Data
const services = [
  { id: "svc_fade", name: "Skin Fade", desc: "Precision taper, razor-finished.", price: 250 },
  { id: "svc_classic", name: "Classic Cut", desc: "Clean, timeless silhouette.", price: 200 },
  { id: "svc_beard", name: "Beard Trim & Shape", desc: "Line-up, sculpt, nourish.", price: 150 },
  { id: "svc_combo", name: "Cut + Beard Combo", desc: "Full refresh package.", price: 320 },
  { id: "svc_kid", name: "Kids Cut", desc: "Sharp and age-appropriate.", price: 160 }
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
  if (route === "services") renderServices();
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



