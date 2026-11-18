var user = JSON.parse(sessionStorage.getItem('petalBloomSignedIn') || 'null');

if (user) {
  var nameInput = document.getElementById('profile-name');
  var emailInput = document.getElementById('profile-email');
  var phoneInput = document.getElementById('profile-phone');
  var message = document.getElementById('profile-message');

  nameInput.value = user.name || '';
  emailInput.value = user.email || '';
  phoneInput.value = user.phone || '';

  document.getElementById('profile-display-name').textContent = user.name;
  document.getElementById('profile-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var newName = nameInput.value.trim();
    var newEmail = emailInput.value.trim().toLowerCase();
    var newPhone = phoneInput.value.trim();

    var users = JSON.parse(localStorage.getItem('petalBloomDemoUsers') || '[]');

    for (var i = 0; i < users.length; i++) {
      if (users[i].email === newEmail && users[i].email !== user.email) {
        message.textContent = 'This email is already used by another account.';
        message.className = 'auth-message show error';
        return;
      }
    }
    for (var j = 0; j < users.length; j++) {
      if (users[j].email === user.email) {
        users[j].name = newName;
        users[j].email = newEmail;
        users[j].phone = newPhone;
      }
    }

    localStorage.setItem('petalBloomDemoUsers', JSON.stringify(users));

    user.name = newName;
    user.email = newEmail;
    user.phone = newPhone;
    sessionStorage.setItem('petalBloomSignedIn', JSON.stringify(user));

    document.getElementById('profile-display-name').textContent = newName;
    message.textContent = 'Your profile has been updated.';
    message.className = 'auth-message show success';
  });
  var allOrders = JSON.parse(localStorage.getItem('flowerOrders') || '[]');
  var myOrders = [];

  for (var k = 0; k < allOrders.length; k++) {
    if (allOrders[k].email === user.email) {
      myOrders.push(allOrders[k]);
    }
  }

  var updates = document.getElementById('profile-updates');

  if (myOrders.length === 0) {
    updates.innerHTML = '<div class="profile-empty-state"><span class="empty-bloom">💐</span><div><strong>Your next bouquet is waiting.</strong><p>No bookings yet. Choose a bouquet to see your updates here.</p></div></div>';
  } else {
    for (var m = 0; m < myOrders.length && m < 3; m++) {
      var item = document.createElement('div');
      item.className = 'profile-update-item';
      item.innerHTML = '<strong>' + myOrders[m].bouquet + '</strong><p>Order ' +
        myOrders[m].id + ' · Delivery date: ' + myOrders[m].date + '</p>';
      updates.appendChild(item);
    }
  }
}
var signOutButton = document.getElementById('sign-out-button');

if (signOutButton) {
  signOutButton.addEventListener('click', function () {
    sessionStorage.removeItem('petalBloomSignedIn');
    window.location.href = 'auth.html';
  });
}
