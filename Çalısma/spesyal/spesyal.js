// spesyal-cart.js – sadece spesyal.html için

function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: name, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert(`${name} sepete eklendi!`);

    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.getElementById('cart-count');
    if (badge) {
        if (cart.length > 0) {
            badge.textContent = cart.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

// Sayfa açılınca sayacı güncelle
document.addEventListener('DOMContentLoaded', updateCartCount);