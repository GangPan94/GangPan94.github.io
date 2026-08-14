// Antigravity Workflow - Simple Password Gate
// No AES, no Web Crypto, no CDN dependencies.
// The page renders fully (all content in HTML), but JS hides everything
// from the "# Getting Started" heading onward until the password is entered.

(function() {
  // Find all elements inside the article/main content area
  var article = document.querySelector('article') || document.querySelector('.page__content') || document.querySelector('main');
  if (!article) return;

  // Collect all child elements of the article
  var children = Array.from(article.children);
  var protectedElements = [];
  var foundBoundary = false;

  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    // Check if this element contains the "Getting Started" heading
    if (!foundBoundary) {
      var h1 = el.querySelector('h1');
      if (h1 && h1.textContent.trim() === 'Getting Started') {
        foundBoundary = true;
      }
      // Also check if the element IS an h1 with that text
      if (el.tagName === 'H1' && el.textContent.trim() === 'Getting Started') {
        foundBoundary = true;
      }
    }
    if (foundBoundary) {
      protectedElements.push(el);
    }
  }

  // Hide all protected elements
  protectedElements.forEach(function(el) {
    el.style.display = 'none';
  });

  // Expose for unlock
  window.__protectedElements = protectedElements;

  // Lock scroll
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
})();

function unlockGate() {
  var password = document.getElementById('gate-password').value;
  var errorEl = document.getElementById('gate-error');
  var gateEl = document.getElementById('password-gate');

  if (password === 'ai2026') {
    // Show protected content
    if (window.__protectedElements) {
      window.__protectedElements.forEach(function(el) {
        el.style.display = '';
      });
    }
    // Hide gate
    if (gateEl) gateEl.style.display = 'none';
    // Unlock scroll
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    errorEl.style.display = 'none';
  } else {
    // Wrong password
    errorEl.style.display = 'block';
    document.getElementById('gate-password').value = '';
    document.getElementById('gate-password').focus();
  }
}

// Enter key support + auto-focus
document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('gate-password');
  if (input) {
    input.focus();
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        unlockGate();
      }
    });
  }
});