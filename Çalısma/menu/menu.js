// menu.js - Updated to add to cart without redirecting

function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name: name, price: price });
  localStorage.setItem('cart', JSON.stringify(cart));
  // Optionally, show a notification or update UI to indicate item added
  alert(`${name} sepete eklendi!`); // Simple alert for feedback
}