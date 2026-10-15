const bouquetSelect = document.getElementById('bouquet');
const totalPrice = document.getElementById('total-price');
const dateInput = document.getElementById('delivery-date');
const form = document.getElementById('booking-form');
const modal = document.getElementById('confirmation-modal');
const confirmationDetails = document.getElementById('confirmation-details');

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().split('T')[0];

dateInput.min = localToday;

let activeUser = null;
try { activeUser = JSON.parse(sessionStorage.getItem('petalBloomSignedIn') || 'null'); } catch {}
if (activeUser) {
  document.getElementById('customer-name').value = activeUser.name || '';
  document.getElementById('customer-phone').value = activeUser.phone || '';
}

function updateTotal() {
  const selected = bouquetSelect.options[bouquetSelect.selectedIndex];
  const price = selected?.dataset.price;
  totalPrice.textContent = price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Choose a bouquet';
}

bouquetSelect.addEventListener('change', updateTotal);

document.querySelectorAll('.select-button').forEach((button) => {
  button.addEventListener('click', () => {
    bouquetSelect.value = button.dataset.bouquet;
    updateTotal();
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const bouquet = bouquetSelect.value;
  const date = dateInput.value;
  const price = bouquetSelect.options[bouquetSelect.selectedIndex].dataset.price;
  const address = document.getElementById('delivery-address').value.trim();
  const message = document.getElementById('message').value.trim();
  let signedInUser = null;
  try { signedInUser = JSON.parse(sessionStorage.getItem('petalBloomSignedIn') || 'null'); } catch {}

  if (signedInUser) {
    signedInUser = { ...signedInUser, name, phone };
    sessionStorage.setItem('petalBloomSignedIn', JSON.stringify(signedInUser));
    const users = JSON.parse(localStorage.getItem('petalBloomDemoUsers') || '[]');
    const updatedUsers = users.map(user => user.email === signedInUser.email ? { ...user, name, phone } : user);
    localStorage.setItem('petalBloomDemoUsers', JSON.stringify(updatedUsers));
  }

  const orders = JSON.parse(localStorage.getItem('flowerOrders') || '[]');
  const order = {
    id: 'PB' + Date.now().toString().slice(-8),
    name,
    email: signedInUser?.email || '',
    phone,
    bouquet,
    date,
    price: Number(price),
    address,
    message,
    status: 'Booking received',
    createdAt: new Date().toLocaleString()
  };
  orders.unshift(order);
  localStorage.setItem('flowerOrders', JSON.stringify(orders));

  window.location.href = 'order.html';
});

function closeModal() {
  modal.classList.remove('show');
}

document.getElementById('close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});
