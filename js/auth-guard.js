var xhrGuard = new XMLHttpRequest();
var apiPath = window.location.pathname.indexOf("/templates/") >= 0 ? "../php/api.php?action=current" : "php/api.php?action=current";
xhrGuard.open("GET", apiPath, true);
xhrGuard.onreadystatechange = function () {
  if (xhrGuard.readyState === 4) {
    var result = JSON.parse(xhrGuard.responseText);
    if (!result.success) {
      var signInPage = window.location.pathname.indexOf("/templates/") >= 0 ? "auth.html" : "templates/auth.html";
      window.location.href = signInPage;
    }
  }
};
xhrGuard.send();
