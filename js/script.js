var bouquetSelect = document.getElementById('bouquet');
var totalPrice = document.getElementById('total-price');
var dateInput = document.getElementById('delivery-date');
var bookingForm = document.getElementById('booking-form');
var today = new Date();
var year = today.getFullYear();
var month = String(today.getMonth() + 1).padStart(2, '0');
var day = String(today.getDate()).padStart(2, '0');
dateInput.min = year + '-' + month + '-' + day;
var activeUser = sessionStorage.getItem('petalBloomSignedIn');

if (activeUser) {
  activeUser = JSON.parse(activeUser);
  document.getElementById('customer-name').value = activeUser.name;
  document.getElementById('customer-phone').value = activeUser.phone;
}
function updateTotal() {
  var selectedOption = bouquetSelect.options[bouquetSelect.selectedIndex];
  var price = selectedOption.getAttribute('data-price');

  if (price) {
    totalPrice.textContent = '₹' + Number(price).toLocaleString('en-IN');
  } else {
    totalPrice.textContent = 'Choose a bouquet';
  }
}

bouquetSelect.addEventListener('change', updateTotal);
var bookButtons = document.querySelectorAll('.select-button');

bookButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    bouquetSelect.value = button.getAttribute('data-bouquet');
    updateTotal();
    document.getElementById('booking').scrollIntoView();
  });
});
bookingForm.addEventListener('submit', function (event) {
  event.preventDefault();

  var name = document.getElementById('customer-name').value.trim();
  var phone = document.getElementById('customer-phone').value.trim();
  var bouquet = bouquetSelect.value;
  var date = dateInput.value;
  var address = document.getElementById('delivery-address').value.trim();
  var giftMessage = document.getElementById('message').value.trim();

  var selectedOption = bouquetSelect.options[bouquetSelect.selectedIndex];
  var price = selectedOption.getAttribute('data-price');

  var user = sessionStorage.getItem('petalBloomSignedIn');
  var email = '';

  if (user) {
    user = JSON.parse(user);
    email = user.email;
    user.name = name;
    user.phone = phone;
    sessionStorage.setItem('petalBloomSignedIn', JSON.stringify(user));
  }
  var order = {
    id: 'PB' + Date.now(),
    name: name,
    email: email,
    phone: phone,
    bouquet: bouquet,
    date: date,
    price: Number(price),
    address: address,
    message: giftMessage,
    status: 'Booking received'
  };
  var orders = JSON.parse(localStorage.getItem('flowerOrders') || '[]');
  orders.unshift(order);
  localStorage.setItem('flowerOrders', JSON.stringify(orders));
  window.location.href = 'templates/order.html';
});
