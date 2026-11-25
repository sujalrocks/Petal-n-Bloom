var bouquetSelect = document.getElementById("bouquet");
var totalPrice = document.getElementById("total-price");
var dateInput = document.getElementById("delivery-date");
var bookingForm = document.getElementById("booking-form");
var today = new Date();
var year = today.getFullYear();
var month = String(today.getMonth() + 1).padStart(2, "0");
var day = String(today.getDate()).padStart(2, "0");
dateInput.min = year + "-" + month + "-" + day;

var userRequest = new XMLHttpRequest();
userRequest.open("GET", "php/api.php?action=current", true);
userRequest.onreadystatechange = function () {
  if (userRequest.readyState === 4) {
    var result = JSON.parse(userRequest.responseText);
    if (result.success) {
      document.getElementById("customer-name").value = result.user.name;
      document.getElementById("customer-phone").value = result.user.phone;
    }
  }
};
userRequest.send();

function updateTotal() {
  var selectedOption = bouquetSelect.options[bouquetSelect.selectedIndex];
  var price = selectedOption.getAttribute("data-price");
  totalPrice.textContent = price ? "₹" + Number(price).toLocaleString("en-IN") : "Choose a bouquet";
}
bouquetSelect.addEventListener("change", updateTotal);
var bookButtons = document.querySelectorAll(".select-button");
bookButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    bouquetSelect.value = button.getAttribute("data-bouquet");
    updateTotal();
    document.getElementById("booking").scrollIntoView();
  });
});
bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var selectedOption = bouquetSelect.options[bouquetSelect.selectedIndex];
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "php/api.php?action=book", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var result = JSON.parse(xhr.responseText);
      if (result.success) {
        window.location.href = "templates/order.html";
      } else {
        alert(result.message);
      }
    }
  };
  xhr.send(JSON.stringify({
    name: document.getElementById("customer-name").value.trim(),
    phone: document.getElementById("customer-phone").value.trim(),
    bouquet: bouquetSelect.value,
    date: dateInput.value,
    address: document.getElementById("delivery-address").value.trim(),
    message: document.getElementById("message").value.trim(),
    price: selectedOption.getAttribute("data-price")
  }));
});
