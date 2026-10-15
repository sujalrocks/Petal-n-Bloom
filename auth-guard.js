(function () {
  let user = null;
  try { user = JSON.parse(sessionStorage.getItem('petalBloomSignedIn') || 'null'); } catch (_) {}
  if (!user || !user.email) {
    const next = encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
    window.location.replace('auth.html?next=' + next);
  }
})();
