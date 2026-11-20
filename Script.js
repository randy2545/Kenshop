// 1. Live Countdown Timer
let time = 4 * 3600 + 23 * 60 + 59;
setInterval(() => {
  if (time <= 0) return;
  time--;
  let hrs = String(Math.floor(time / 3600)).padStart(2, '0');
  let mins = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  let secs = String(time % 60).padStart(2, '0');
  document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}, 1000);

// 2. Real Shopping Cart Array
let cart = [];

function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  document.getElementById('cart-count').innerText = cart.length;
  alert(`${productName} (KSh ${price.toLocaleString()}) added to cart!`);
}

// 3. Checkout via WhatsApp (Triggered when clicking top Cart button)
document.querySelector('.cart-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let total = 0;
  let orderList = "Hello KENshop! I would like to order:\n\n";
  
  cart.forEach((item, index) => {
    orderList += `${index + 1}. ${item.name} - KSh ${item.price.toLocaleString()}\n`;
    total += item.price;
  });

  orderList += `\nTotal: KSh ${total.toLocaleString()}\nPayment: Pay on Delivery`;

  // Replace 254700000000 with your real Kenyan WhatsApp phone number
  let phone = "254700000000"; 
  let whatsappURL = `https://wa.me{phone}?text=${encodeURIComponent(orderList)}`;
  window.open(whatsappURL, '_blank');
});

// 4. Live Search Bar Filter
function searchProducts() {
  let input = document.getElementById('search-input').value.toLowerCase();
  let cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    let productName = card.getAttribute('data-name').toLowerCase();
    card.style.display = productName.includes(input) ? 'block' : 'none';
  });
}
