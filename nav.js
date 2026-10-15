
(function () {
  const slot = document.getElementById('account-nav');
  if (!slot) return;
  let user = null;
  try { user = JSON.parse(sessionStorage.getItem('petalBloomSignedIn') || 'null'); } catch {}
  if (!user) {
    slot.innerHTML = '<a href="auth.html">Sign in</a>';
    return;
  }
  const firstName = (user.name || 'Profile').trim().split(/\\s+/)[0];
  slot.innerHTML = '<a class="profile-nav-link" href="profile.html" aria-label="My profile">👤 ' +
    escapeText(firstName) + '</a>';
  function escapeText(value) {
    return value.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
})();
