const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const signinTab = document.getElementById('signin-tab');
const signupTab = document.getElementById('signup-tab');
const messageBox = document.getElementById('auth-message');

function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.className = `auth-message show ${type}`;
}

function clearMessage() {
  messageBox.textContent = '';
  messageBox.className = 'auth-message';
}

function showForm(which) {
  const signup = which === 'signup';
  signinForm.hidden = signup;
  signupForm.hidden = !signup;
  signinTab.classList.toggle('active', !signup);
  signupTab.classList.toggle('active', signup);
  signinTab.setAttribute('aria-selected', String(!signup));
  signupTab.setAttribute('aria-selected', String(signup));
  clearMessage();
}

signinTab.addEventListener('click', () => showForm('signin'));
signupTab.addEventListener('click', () => showForm('signup'));
document.querySelectorAll('[data-show]').forEach((button) => {
  button.addEventListener('click', () => showForm(button.dataset.show));
});

const USERS_KEY = 'petalBloomDemoUsers';
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const phone = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  if (password !== confirm) {
    showMessage('Your passwords do not match. Please try again.', 'error');
    return;
  }

  const users = getUsers();
  if (users.some((user) => user.email === email)) {
    showMessage('An account with this email already exists. Please sign in.', 'error');
    return;
  }

  users.push({ name, email, phone, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  sessionStorage.setItem('petalBloomSignedIn', JSON.stringify({ name, email, phone }));
  window.location.href = 'index.html';
});

signinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('signin-email').value.trim().toLowerCase();
  const password = document.getElementById('signin-password').value;
  const user = getUsers().find((item) => item.email === email && item.password === password);

  if (!user) {
    showMessage('We could not find a matching account. Check your details or sign up first.', 'error');
    return;
  }

  sessionStorage.setItem('petalBloomSignedIn', JSON.stringify({ name: user.name, email: user.email, phone: user.phone || '' }));
  window.location.href = 'index.html';
});
