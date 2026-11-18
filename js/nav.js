var accountArea = document.getElementById('account-nav');
var pageFolder = '';

if (window.location.pathname.indexOf('/templates/') === -1) {
  pageFolder = 'templates/';
}

if (accountArea) {
  var savedUser = sessionStorage.getItem('petalBloomSignedIn');

  if (savedUser) {
    var user = JSON.parse(savedUser);
    var firstName = user.name.split(' ')[0];

    accountArea.innerHTML = '<a class="profile-nav-link" href="' +
      pageFolder + 'profile.html">👤 ' + firstName + '</a>';
  } else {
    accountArea.innerHTML = '<a href="' + pageFolder + 'auth.html">Sign in</a>';
  }
}
