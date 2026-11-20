import { initializeApp } from "https://gstatic.com";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://gstatic.com";

// ==========================================
// 1. LIVE PRODUCT SEARCH FUNCTIONALITY
// ==========================================
const searchInput = document.getElementById('searchInput');
const productCards = document.querySelectorAll('.product-card');
const noResultsMsg = document.getElementById('noResultsMsg');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    productCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      if (cardText.includes(query)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
  });
}

// ==========================================
// 2. MODAL POPUP CONTROLS
// ==========================================
const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const authMessage = document.getElementById('authMessage');

openAuthBtn.addEventListener('click', () => {
  authMessage.textContent = '';
  authModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
  authModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.style.display = 'none';
  }
});

// ==========================================
// 3. FIREBASE SIGN UP & LOG IN
// ==========================================
// REPLACE THIS OBJECT WITH YOUR FIREBASE CONFIG FROM ://google.com
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

// Create Account (Sign Up)
signUpBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || password.length < 6) {
    authMessage.style.color = '#dc2626';
    authMessage.textContent = 'Enter a valid email and a password of at least 6 characters.';
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    authMessage.style.color = '#059669';
    authMessage.textContent = 'Account created! Logging you in...';
    setTimeout(() => { authModal.style.display = 'none'; }, 1000);
  } catch (error) {
    authMessage.style.color = '#dc2626';
    authMessage.textContent = error.message;
  }
});

// Log In
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    authMessage.style.color = '#059669';
    authMessage.textContent = 'Welcome back!';
    setTimeout(() => { authModal.style.display = 'none'; }, 800);
  } catch (error) {
    authMessage.style.color = '#dc2626';
    authMessage.textContent = 'Invalid email or password.';
  }
});

// Log Out
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

// Listen for Login State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    userGreeting.textContent = `Hi, ${user.email.split('@')[0]}`;
    openAuthBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    userGreeting.textContent = '';
    openAuthBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
});
