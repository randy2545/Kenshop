import { initializeApp } from "https://gstatic.com";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://gstatic.com";

// ==========================================
// 1. LIVE PRODUCT SEARCH & CATEGORY FILTER
// ==========================================
const searchInput = document.getElementById('searchInput');
const productCards = document.querySelectorAll('.product-card');
const noResultsMsg = document.getElementById('noResultsMsg');
const categoryButtons = document.querySelectorAll('.cat-item');

let activeCategory = 'all';

function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const cardCategory = card.getAttribute('data-category');
    const matchesSearch = text.includes(query);
    const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;

    if (matchesSearch && matchesCategory) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
}

if (searchInput) {
  searchInput.addEventListener('input', filterProducts);
}

categoryButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.getAttribute('data-category');
    filterProducts();
  });
});

// ==========================================
// 2. LIVE FLASH SALE COUNTDOWN TIMER
// ==========================================
let secondsLeft = 9919; // ~2 hrs 45 mins
const flashTimer = document.getElementById('flashTimer');

setInterval(() => {
  if (secondsLeft > 0) secondsLeft--;
  const hrs = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const mins = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  if (flashTimer) flashTimer.textContent = `${hrs} : ${mins} : ${secs}`;
}, 1000);

// ==========================================
// 3. INTERACTIVE CART COUNTER
// ==========================================
let cartItems = [];
const cartCountEl = document.getElementById('cartCount');
const buyButtons = document.querySelectorAll('.btn-buy');

buyButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('data-name');
    const price = Number(btn.getAttribute('data-price'));
    cartItems.push({ name, price });
    cartCountEl.textContent = cartItems.length;

    const originalText = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 900);
  });
});

document.getElementById('cartNavBtn').addEventListener('click', () => {
  if (cartItems.length === 0) {
    alert('Your KENshop cart is empty!');
  } else {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const list = cartItems.map((item, i) => `${i + 1}. ${item.name} - KSh ${item.price.toLocaleString()}`).join('\n');
    alert(`Your KENshop Cart (${cartItems.length} items):\n\n${list}\n\nTotal: KSh ${total.toLocaleString()}`);
  }
});

// ==========================================
// 4. MODAL & FIREBASE AUTHENTICATION
// ==========================================
const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const accountNavBtn = document.getElementById('accountNavBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const authMessage = document.getElementById('authMessage');

function openModal() {
  authMessage.textContent = '';
  authModal.style.display = 'flex';
}

openAuthBtn.addEventListener('click', openModal);
accountNavBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', () => { authModal.style.display = 'none'; });

window.addEventListener('click', (e) => {
  if (e.target === authModal) authModal.style.display = 'none';
});

// PASTE YOUR FIREBASE CONFIG KEYS HERE
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById('authEmail');
const passwordInput = document.getElementById('authPassword');
const signUpBtn = document.getElementById('signUpBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');

signUpBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || password.length < 6) {
    authMessage.style.color = '#e62e04';
    authMessage.textContent = 'Enter a valid email and password (6+ characters).';
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    authMessage.style.color = '#059669';
    authMessage.textContent = 'Account created! Welcome to KENshop.';
    setTimeout(() => { authModal.style.display = 'none'; }, 900);
  } catch (error) {
    authMessage.style.color = '#e62e04';
    authMessage.textContent = error.message;
  }
});

loginBtn.addEventListener('click', async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    authMessage.style.color = '#059669';
    authMessage.textContent = 'Logged in!';
    setTimeout(() => { authModal.style.display = 'none'; }, 700);
  } catch (error) {
    authMessage.style.color = '#e62e04';
    authMessage.textContent = 'Invalid email or password.';
  }
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    userGreeting.textContent = `Hi, ${user.email.split('@')}`;
    openAuthBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    userGreeting.textContent = '';
    openAuthBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
});
