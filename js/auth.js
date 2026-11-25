var signInForm = document.getElementById("signin-form");
var signUpForm = document.getElementById("signup-form");
var signInTab = document.getElementById("signin-tab");
var signUpTab = document.getElementById("signup-tab");
var messageBox = document.getElementById("auth-message");

function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.className = "auth-message show " + type;
}
function showForm(formName) {
  if (formName === "signup") {
    signInForm.hidden = true;
    signUpForm.hidden = false;
    signInTab.classList.remove("active");
    signUpTab.classList.add("active");
  } else {
    signInForm.hidden = false;
    signUpForm.hidden = true;
    signInTab.classList.add("active");
    signUpTab.classList.remove("active");
  }
  messageBox.textContent = "";
  messageBox.className = "auth-message";
}
signInTab.addEventListener("click", function () { showForm("signin"); });
signUpTab.addEventListener("click", function () { showForm("signup"); });
document.querySelectorAll("[data-show]").forEach(function (button) {
  button.addEventListener("click", function () { showForm(button.getAttribute("data-show")); });
});

function handleResponse(result) {
  if (result.success) {
    window.location.href = "../index.html";
  } else {
    showMessage(result.message, "error");
  }
}
signUpForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var password = document.getElementById("signup-password").value;
  var confirmPassword = document.getElementById("signup-confirm").value;
  if (password !== confirmPassword) {
    showMessage("Your passwords do not match.", "error");
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "../php/api.php?action=signup", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var result = JSON.parse(xhr.responseText);
      handleResponse(result);
    }
  };
  xhr.send(JSON.stringify({
    name: document.getElementById("signup-name").value.trim(),
    email: document.getElementById("signup-email").value.trim(),
    phone: document.getElementById("signup-phone").value.trim(),
    password: password
  }));
});
signInForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "../php/api.php?action=signin", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var result = JSON.parse(xhr.responseText);
      handleResponse(result);
    }
  };
  xhr.send(JSON.stringify({
    email: document.getElementById("signin-email").value.trim(),
    password: document.getElementById("signin-password").value
  }));
});
