(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var counter = document.getElementById('counter');
  var bar = document.getElementById('bar');
  var fullBtn = document.getElementById('full');
  var root = document.documentElement;
  var current = 0;

  function go(n) {
    current = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, i) {
      s.classList.toggle('active', i === current);
      if (i === current) s.scrollTop = 0;
    });
    counter.textContent = (current + 1) + ' / ' + slides.length;
    bar.style.width = ((current + 1) / slides.length * 100) + '%';
    try { history.replaceState(null, '', '#' + (current + 1)); } catch (e) {}
  }

  /* Tela cheia: funciona em Android e no iPad; o iPhone não permite, então o botão some */
  function fsEnabled() {
    return !!(root.requestFullscreen || root.webkitRequestFullscreen);
  }
  function toggleFullscreen() {
    var active = document.fullscreenElement || document.webkitFullscreenElement;
    if (!active) {
      (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  }
  if (!fsEnabled()) fullBtn.hidden = true;
  else fullBtn.addEventListener('click', toggleFullscreen);

  document.getElementById('prev').addEventListener('click', function () { go(current - 1); });
  document.getElementById('next').addEventListener('click', function () { go(current + 1); });

  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); go(current + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(current - 1); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if ((k === 'f' || k === 'F') && fsEnabled()) toggleFullscreen();
  });

  /* Deslizar o dedo para os lados (ignora rolagem vertical) */
  var sx = null, sy = null;
  document.addEventListener('touchstart', function (e) {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(current + (dx < 0 ? 1 : -1));
    sx = sy = null;
  }, { passive: true });

  var start = parseInt(location.hash.slice(1), 10);
  go(isNaN(start) ? 0 : start - 1);
})();
