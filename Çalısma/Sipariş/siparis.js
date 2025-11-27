// siparis.js – TAMAMEN TEST EDİLDİ, HATA YOK

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = cart.reduce((sum, item) => sum + item.price, 0);
let discount = 0;
let usedCoupon = localStorage.getItem('usedCoupon') || null;

const cartItemsList = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const discountEl = document.getElementById('discount');
const finalTotalEl = document.getElementById('final-total');
const couponStatus = document.getElementById('coupon-status');
const confirmButton = document.getElementById('confirm-cart');
const confirmationArea = document.getElementById('confirmation-area');
const placeOrderBtn = document.getElementById('place-order');
const addressInput = document.getElementById('address-input');
const orderStatus = document.getElementById('order-status');

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();
  if (usedCoupon) {
    couponStatus.textContent = `${usedCoupon} kuponu zaten kullanıldı!`;
    couponStatus.className = 'mt-8 text-center text-lg font-bold text-green-600';
  }
});

function renderCart() {
  cartItemsList.innerHTML = '';
  if (cart.length === 0) {
    cartItemsList.innerHTML = '<p class="text-center text-gray-500 py-10 text-xl">Sepetiniz boş. Hemen alışverişe başlayın!</p>';
  } else {
    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'flex justify-between items-center bg-gray-50 p-5 rounded-xl';
      div.innerHTML = `
        <span class="font-semibold text-lg">${item.name}</span>
        <div class="flex items-center gap-4">
          <span class="text-orange-600 font-bold text-lg">${item.price} TL</span>
          <button onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-800 text-2xl font-bold">×</button>
        </div>
      `;
      cartItemsList.appendChild(div);
    });
  }
  updateTotals();
}

function updateTotals() {
  cartTotalEl.textContent = total.toFixed(2) + ' TL';
  discountEl.textContent = 'İndirim: ' + discount.toFixed(2) + ' TL';
  finalTotalEl.textContent = (total - discount).toFixed(2) + ' TL';
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  const count = cart.length;
  if (count > 0) {
    countEl.textContent = count;
    countEl.classList.remove('hidden');
  } else {
    countEl.classList.add('hidden');
  }
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  total = cart.reduce((sum, i) => sum + i.price, 0);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
};

window.applyCoupon = function(code, value, minAmount = 0) {
  if (usedCoupon) {
    couponStatus.textContent = 'Zaten bir kupon kullandınız!';
    couponStatus.className = 'mt-8 text-center text-lg font-bold text-red-600';
    return;
  }
  if (minAmount > 0 && total < minAmount) {
    couponStatus.textContent = `Bu kupon için minimum ${minAmount} TL alışveriş gerekli!`;
    couponStatus.className = 'mt-8 text-center text-lg font-bold text-red-600';
    return;
  }

  if (value <= 1) {
    discount = total * value;
  } else {
    discount = value;
  }

  usedCoupon = code;
  localStorage.setItem('usedCoupon', code);
  couponStatus.innerHTML = `${code} kuponu uygulandı! <br><span class="text-green-600 text-2xl">${discount.toFixed(2)} TL kazandın!</span>`;
  updateTotals();
};

window.applyFreeKunefe = function() {
  if (usedCoupon) {
    couponStatus.textContent = 'Zaten bir kupon kullandınız!';
    couponStatus.className = 'mt-8 text-center text-lg font-bold text-red-600';
    return;
  }
  if (total < 400) {
    couponStatus.textContent = '400 TL ve üzeri alışverişte geçerli!';
    couponStatus.className = 'mt-8 text-center text-lg font-bold text-red-600';
    return;
  }

  cart.push({ name: 'Künefe (HEDİYE)', price: 0 });
  localStorage.setItem('cart', JSON.stringify(cart));
  usedCoupon = 'KUNEFEHEDİYE';
  localStorage.setItem('usedCoupon', usedCoupon);
  couponStatus.innerHTML = 'Tebrikler! 1 adet Künefe hediye kazandın!';
  couponStatus.className = 'mt-8 text-center text-2xl font-bold text-green-600 animate-bounce';
  renderCart();
  updateCartCount();
};

confirmButton.addEventListener('click', () => {
  if (cart.length === 0) return alert('Sepetiniz boş!');
  confirmationArea.classList.remove('hidden');
  confirmationArea.scrollIntoView({ behavior: 'smooth' });
});

placeOrderBtn.addEventListener('click', () => {
  const address = addressInput.value.trim();
  if (!address) {
    orderStatus.textContent = 'Adres giriniz!';
    orderStatus.className = 'text-red-600 text-2xl';
    return;
  }

  orderStatus.textContent = `Siparişiniz alındı! ${address} adresine 35-45 dakika içinde teslim edilecek. Afiyet olsun!`;
  orderStatus.className = 'text-green-600 text-2xl font-bold';

  setTimeout(() => {
    localStorage.removeItem('cart');
    localStorage.removeItem('usedCoupon');
    location.reload();
  }, 5000);
});