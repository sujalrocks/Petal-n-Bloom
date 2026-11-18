var signedInUser = sessionStorage.getItem('petalBloomSignedIn');

if (!signedInUser) {
  var signInPage = window.location.pathname.indexOf('/templates/') >= 0
    ? 'auth.html'
    : 'templates/auth.html';

  window.location.href = signInPage;
}
