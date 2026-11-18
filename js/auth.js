var signInForm = document.getElementById('signin-form');
var signUpForm = document.getElementById('signup-form');
var signInTab = document.getElementById('signin-tab');
var signUpTab = document.getElementById('signup-tab');
var messageBox = document.getElementById('auth-message');
function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.className = 'auth-message show ' + type;
}
function showForm(formName) {
  if (formName === 'signup') {
    signInForm.hidden = true;
    signUpForm.hidden = false;
    signInTab.classList.remove('active');
    signUpTab.classList.add('active');
  } else {
    signInForm.hidden = false;
    signUpForm.hidden = true;
    signInTab.classList.add('active');
    signUpTab.classList.remove('active');
  }

  messageBox.textContent = '';
  messageBox.className = 'auth-message';
}

signInTab.addEventListener('click', function () {
  showForm('signin');
});

signUpTab.addEventListener('click', function () {
  showForm('signup');
});

document.querySelectorAll('[data-show]').forEach(function (button) {
  button.addEventListener('click', function () {
    showForm(button.dataset.show);
  });
});
function getUsers() {
  var users = localStorage.getItem('petalBloomDemoUsers');
  return users ? JSON.parse(users) : [];
}
signUpForm.addEventListener('submit', function (event) {
  event.preventDefault();

  var name = document.getElementById('signup-name').value.trim();
  var email = document.getElementById('signup-email').value.trim().toLowerCase();
  var phone = document.getElementById('signup-phone').value.trim();
  var password = document.getElementById('signup-password').value;
  var confirmPassword = document.getElementById('signup-confirm').value;

  if (password !== confirmPassword) {
    showMessage('Your passwords do not match.', 'error');
    return;
  }

  var users = getUsers();

  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      showMessage('This email already has an account. Please sign in.', 'error');
      return;
    }
  }

  users.push({
    name: name,
    email: email,
    phone: phone,
    password: password
  });

  localStorage.setItem('petalBloomDemoUsers', JSON.stringify(users));
  sessionStorage.setItem('petalBloomSignedIn', JSON.stringify({
    name: name,
    email: email,
    phone: phone
  }));

  window.location.href = '../index.html';
});
signInForm.addEventListener('submit', function (event) {
  event.preventDefault();

  var email = document.getElementById('signin-email').value.trim().toLowerCase();
  var password = document.getElementById('signin-password').value;
  var users = getUsers();
  var foundUser = null;

  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      foundUser = users[i];
      break;
    }
  }

  if (foundUser === null) {
    showMessage('Account not found. Check your details or sign up.', 'error');
    return;
  }

  sessionStorage.setItem('petalBloomSignedIn', JSON.stringify({
    name: foundUser.name,
    email: foundUser.email,
    phone: foundUser.phone
  }));

  window.location.href = '../index.html';
});
