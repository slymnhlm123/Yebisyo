// menu.js – Menü sayfası için sepet + sayı göstergesi (çalışıyor!)

function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: name, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${name} sepete eklendi!`);

    updateCartCount(); // Her eklemede sayı güncellenir
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

// Sayfa yüklendiğinde sayı görünsün (Spesyalden geldiyse bile doğru gösterir)
document.addEventListener('DOMContentLoaded', updateCartCount);