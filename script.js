// Rook & Roll — shared behavior

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav after a link is chosen
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 640) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  initDiceTile();
});

// Interactive homepage dice tile — click or press the button to roll a
// standard six-sided die. Built to be keyboard-operable and to announce
// results to assistive tech via an aria-live status region.
function initDiceTile() {
  var dieEl = document.getElementById('heroDie');
  var faceEl = document.getElementById('dieFace');
  var rollBtn = document.getElementById('rollDieBtn');
  var statusEl = document.getElementById('diceStatus');

  if (!dieEl || !faceEl || !rollBtn || !statusEl) {
    return;
  }

  // Standard pip layouts, positions numbered 1-9 left-to-right, top-to-bottom.
  var pipPatterns = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  };

  var pips = Array.prototype.slice.call(faceEl.querySelectorAll('.pip'));
  var isRolling = false;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function setDieValue(value) {
    var positions = pipPatterns[value] || [];
    pips.forEach(function (pip) {
      var pos = Number(pip.getAttribute('data-pos'));
      pip.classList.toggle('visible', positions.indexOf(pos) !== -1);
    });
    faceEl.setAttribute('data-value', String(value));
    faceEl.setAttribute('aria-label', 'Die showing ' + value);
  }

  function rollDie() {
    if (isRolling) {
      return;
    }

    var result = Math.floor(Math.random() * 6) + 1;
    isRolling = true;
    rollBtn.disabled = true;
    statusEl.textContent = 'Rolling…';

    var finish = function () {
      setDieValue(result);
      statusEl.textContent = 'You rolled a ' + result + '!';
      dieEl.classList.remove('rolling');
      rollBtn.disabled = false;
      isRolling = false;
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    dieEl.classList.add('rolling');
    window.setTimeout(finish, 600);
  }

  rollBtn.addEventListener('click', rollDie);
}
