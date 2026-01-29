document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();

  // Show confirmation
  const confirmation = document.getElementById("contact-confirmation");
  confirmation.textContent = "✅ Thanks! Your message has been sent.";
  confirmation.classList.remove("hidden");

  // Optionally clear the form
  e.target.reset();
});

document.getElementById("booking-form").addEventListener("submit", e => {
  e.preventDefault();
  const confirmation = document.getElementById("booking-confirmation");
  confirmation.textContent = "✅ Your appointment has been booked!";
  confirmation.classList.remove("hidden");
  e.target.reset();
});






