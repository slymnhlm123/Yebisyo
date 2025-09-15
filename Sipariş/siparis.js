let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = cart.reduce((sum, item) => sum + item.price, 0);
let discount = 0;

const coupons = [
  { code: 'INDIRIM10', rate: 0.10, label: '%10 İndirim' },
  { code: 'YEBISYO20', rate: 0.20, label: '%20 İndirim' },
  { code: 'WELCOME15', rate: 0.15, label: '%15 İndirim' }
];

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const discountDisplay = document.getElementById('discount');
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - ${item.price} TL <button class="text-red-600 ml-2" onclick="removeFromCart('${item.name}')">Sil</button>`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = `Toplam: ${(total - discount).toFixed(2)} TL`;
  discountDisplay.textContent = `İndirim: ${discount.toFixed(2)} TL`;
}

function removeFromCart(name) {
  const item = cart.find(i => i.name === name);
  if (item) {
    total -= item.price;
    cart = cart.filter(i => i.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
  }
}

function applyCoupon(code, rate) {
  const couponStatus = document.getElementById('coupon-status');
  const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons')) || [];
  if (!usedCoupons.includes(code)) {
    discount = total * rate;
    usedCoupons.push(code);
    localStorage.setItem('usedCoupons', JSON.stringify(usedCoupons));
    couponStatus.textContent = `${code} uygulandı! ${discount.toFixed(2)} TL indirim kazandınız.`;
    renderCoupons();
    updateCart();
  } else {
    couponStatus.textContent = 'Bu kupon zaten kullanıldı!';
  }
}

function renderCoupons() {
  const couponList = document.getElementById('coupon-list');
  couponList.innerHTML = '';
  const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons')) || [];
  coupons.forEach(coupon => {
    if (!usedCoupons.includes(coupon.code)) {
      const li = document.createElement('li');
      li.innerHTML = `<button class="w-full text-left p-2 border rounded hover:bg-gray-100" onclick="applyCoupon('${coupon.code}', ${coupon.rate})">${coupon.code} (${coupon.label})</button>`;
      couponList.appendChild(li);
    }
  });
}

document.getElementById('toggle-coupons').addEventListener('click', () => {
  const couponList = document.getElementById('coupon-list');
  const arrowIcon = document.getElementById('arrow-icon');
  couponList.classList.toggle('open');
  couponList.classList.toggle('hidden');
  arrowIcon.classList.toggle('rotate');
});

document.getElementById('confirm-cart').addEventListener('click', () => {
  document.getElementById('confirmation-area').classList.remove('hidden');
});

document.getElementById('place-order').addEventListener('click', () => {
  const address = document.getElementById('address-input').value.trim();
  const status = document.getElementById('order-status');

  if (cart.length === 0) {
    status.textContent = 'Sepetiniz boş. Sipariş verilemedi.';
    return;
  }

  if (address === '') {
    status.textContent = 'Lütfen adresinizi giriniz.';
    return;
  }

  const order = {
    items: cart,
    total: total,
    discount: discount,
    finalTotal: total - discount,
    address: address,
    date: new Date().toLocaleString('tr-TR')
  };

  console.log('Sipariş alındı:', order);

  status.textContent = `Siparişiniz başarıyla alındı! Teslimat adresi: ${address}`;

  cart = [];
  total = 0;
  discount = 0;
  localStorage.removeItem('cart');
  localStorage.removeItem('usedCoupons');
  updateCart();
  renderCoupons();
});

window.onload = () => {
  updateCart();
  renderCoupons();
};
