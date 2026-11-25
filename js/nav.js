var accountArea = document.getElementById("account-nav");
var pageFolder = window.location.pathname.indexOf("/templates/") === -1 ? "templates/" : "";
if (accountArea) {
  var xhrNav = new XMLHttpRequest();
  var apiPathNav = pageFolder ? "php/api.php?action=current" : "../php/api.php?action=current";
  xhrNav.open("GET", apiPathNav, true);
  xhrNav.onreadystatechange = function () {
    if (xhrNav.readyState === 4) {
      var result = JSON.parse(xhrNav.responseText);
      if (result.success) {
        var firstName = result.user.name.split(" ")[0];
        accountArea.innerHTML = '<a class="profile-nav-link" href="' + pageFolder + 'profile.html">👤 ' + firstName + '</a>';
      } else {
        accountArea.innerHTML = '<a href="' + pageFolder + 'auth.html">Sign in</a>';
      }
    }
  };
  xhrNav.send();
}
