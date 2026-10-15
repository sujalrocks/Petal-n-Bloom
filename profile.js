const signedInUser = (() => {
  try { return JSON.parse(sessionStorage.getItem('petalBloomSignedIn') || 'null'); } catch { return null; }
})();
if (!signedInUser) {
  window.location.replace('auth.html');
} else {
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const phoneInput = document.getElementById('profile-phone');
  const message = document.getElementById('profile-message');
  nameInput.value = signedInUser.name || '';
  const displayName = document.getElementById('profile-display-name');
  if (displayName) displayName.textContent = signedInUser.name || 'Your account';
  emailInput.value = signedInUser.email || '';
  phoneInput.value = signedInUser.phone || ''; 

  document.getElementById('profile-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    if (!name || !email || !phone) return;
    let users = [];
    try { users = JSON.parse(localStorage.getItem('petalBloomDemoUsers') || '[]'); } catch {}
    const duplicate = users.some(user => user.email === email && user.email !== signedInUser.email);
    if (duplicate) {
      message.textContent = 'That email is already associated with another account.';
      message.className = 'auth-message show error';
      message.focus();
      return;
    }
    users = users.map(user => user.email === signedInUser.email
      ? { ...user, name, email, phone } : user);
    localStorage.setItem('petalBloomDemoUsers', JSON.stringify(users));
    const updated = { name, email, phone };
    sessionStorage.setItem('petalBloomSignedIn', JSON.stringify(updated));
    message.textContent = 'Your profile has been updated.';
    message.className = 'auth-message show success';
    document.querySelector('.profile-nav-link')?.replaceChildren(document.createTextNode('👤 ' + name.split(/\\s+/)[0]));
  });

  const updates = document.getElementById('profile-updates');
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('flowerOrders') || '[]'); } catch {}
  const mine = orders.filter(order => order.email && order.email.toLowerCase() === signedInUser.email.toLowerCase()).slice(0, 3);
  if (!mine.length) {
    updates.innerHTML = '<div class="profile-empty-state"><span class="empty-bloom">💐</span><div><strong>Your next bouquet is waiting.</strong><p>No bookings yet — choose a bouquet below and your order updates will appear here automatically.</p></div></div>';
  } else {
    mine.forEach(order => {
      const item = document.createElement('div');
      item.className = 'profile-update-item';
      const title = document.createElement('strong');
      title.textContent = order.bouquet || 'Flower booking';
      const status = document.createElement('span');
      status.className = 'order-status';
      status.textContent = order.status || 'Booking received';
      const detail = document.createElement('p');
      detail.textContent = 'Order ' + order.id + ' · Delivery date: ' + order.date;
      item.append(title, status, detail);
      updates.appendChild(item);
    });
  }
}

const signOutButton = document.getElementById('sign-out-button');
signOutButton?.addEventListener('click', () => {
  sessionStorage.removeItem('petalBloomSignedIn');
  window.location.replace('auth.html');
});
