var profileRequest = new XMLHttpRequest();
profileRequest.open("GET", "../php/api.php?action=current", true);
profileRequest.onreadystatechange = function () {
  if (profileRequest.readyState === 4) {
    var current = JSON.parse(profileRequest.responseText);
    if (!current.success) return;
    var user = current.user;
    var nameInput = document.getElementById("profile-name");
    var emailInput = document.getElementById("profile-email");
    var phoneInput = document.getElementById("profile-phone");
    var message = document.getElementById("profile-message");
    nameInput.value = user.name;
    emailInput.value = user.email;
    phoneInput.value = user.phone;
    document.getElementById("profile-display-name").textContent = user.name;

    document.getElementById("profile-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "../php/api.php?action=profile", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          var result = JSON.parse(xhr.responseText);
          message.textContent = result.message;
          message.className = "auth-message show " + (result.success ? "success" : "error");
          if (result.success) {
            user = result.user;
            document.getElementById("profile-display-name").textContent = user.name;
          }
        }
      };
      xhr.send(JSON.stringify({name:nameInput.value.trim(), email:emailInput.value.trim(), phone:phoneInput.value.trim()}));
    });

    var ordersRequest = new XMLHttpRequest();
    ordersRequest.open("GET", "../php/api.php?action=orders", true);
    ordersRequest.onreadystatechange = function () {
      if (ordersRequest.readyState === 4) {
        var data = JSON.parse(ordersRequest.responseText);
        var updates = document.getElementById("profile-updates");
        if (!data.success || data.orders.length === 0) {
          updates.innerHTML = '<div class="profile-empty-state"><span class="empty-bloom">💐</span><div><strong>Your next bouquet is waiting.</strong><p>No bookings yet. Choose a bouquet to see your updates here.</p></div></div>';
        } else {
          for (var i = 0; i < data.orders.length && i < 3; i++) {
            var item = document.createElement("div");
            item.className = "profile-update-item";
            item.innerHTML = "<strong>" + data.orders[i].bouquet + "</strong><p>Order " + data.orders[i].id + " · Delivery date: " + data.orders[i].date + "</p>";
            updates.appendChild(item);
          }
        }
      }
    };
    ordersRequest.send();
  }
};
profileRequest.send();

var signOutButton = document.getElementById("sign-out-button");
if (signOutButton) {
  signOutButton.addEventListener("click", function () {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../php/api.php?action=signout", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) window.location.href = "auth.html";
    };
    xhr.send();
  });
}
