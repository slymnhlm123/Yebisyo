// siparis.js - Güncellenmiş versiyon

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const discountP = document.getElementById('discount');
  const finalTotalP = document.getElementById('final-total');
  const couponStatus = document.getElementById('coupon-status');
  const toggleButton = document.getElementById('toggle-coupons');
  const couponList = document.getElementById('coupon-list');
  const confirmButton = document.getElementById('confirm-cart');
  const confirmationArea = document.getElementById('confirmation-area');
  const placeOrder = document.getElementById('place-order');
  const addressInput = document.getElementById('address-input');
  const orderStatus = document.getElementById('order-status');

  // Sample coupons
  const coupons = [
    { code: 'INDIRIM10', rate: 0.10, label: '%10 İndirim' },
    { code: 'YEBISYO20', rate: 0.20, label: '%20 İndirim' },
    { code: 'WELCOME15', rate: 0.15, label: '%15 İndirim' }
  ];

  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  let discount = 0;

  // Render cart items
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center';
    li.innerHTML = `
      ${item.name} - ${item.price} TL
      <button class="text-red-600 hover:text-red-800" onclick="removeItem(${index})">Kaldır</button>
    `;
    cartItemsList.appendChild(li);
  });

  updateTotal();

  // Function to remove item from cart
  window.removeItem = function(index) {
    cart.splice(index, 1);
    total = cart.reduce((sum, item) => sum + item.price, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); // Reload to update the list
  };

  // Update total and discount
  function updateTotal() {
    cartTotal.textContent = `Toplam: ${total.toFixed(2)} TL`;
    discountP.textContent = `İndirim: ${discount.toFixed(2)} TL`;
    finalTotalP.textContent = `Ödenecek Tutar: ${(total - discount).toFixed(2)} TL`;
  }

  // Toggle coupons list
  toggleButton.addEventListener('click', () => {
    couponList.classList.toggle('hidden');
    const arrow = document.getElementById('arrow-icon');
    arrow.classList.toggle('rotate-180');
  });

  // Render coupons
  function renderCoupons() {
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

  // Apply coupon
  window.applyCoupon = function(code, rate) {
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons')) || [];
    if (!usedCoupons.includes(code)) {
      discount = total * rate;
      usedCoupons.push(code);
      localStorage.setItem('usedCoupons', JSON.stringify(usedCoupons));
      couponStatus.textContent = `${code} uygulandı! ${discount.toFixed(2)} TL indirim kazandınız.`;
      renderCoupons();
      updateTotal();
    } else {
      couponStatus.textContent = 'Bu kupon zaten kullanıldı!';
    }
  };

  // Show confirmation area
  confirmButton.addEventListener('click', () => {
    confirmationArea.classList.remove('hidden');
  });

  // Place order
  placeOrder.addEventListener('click', () => {
    const address = addressInput.value.trim();
    if (cart.length === 0) {
      orderStatus.textContent = 'Sepetiniz boş. Sipariş verilemedi.';
      return;
    }

    if (address === '') {
      orderStatus.textContent = 'Lütfen adresinizi giriniz.';
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

    orderStatus.textContent = `Siparişiniz başarıyla alındı! Teslimat adresi: ${address}`;

    cart = [];
    total = 0;
    discount = 0;
    localStorage.removeItem('cart');
    localStorage.removeItem('usedCoupons');
    cartItemsList.innerHTML = '';
    updateTotal();
    renderCoupons();
    couponStatus.textContent = '';
  });

  // Initial render
  renderCoupons();
});