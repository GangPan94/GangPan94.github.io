/* ============================================================ */
/*  ACCT 321 — Accounting Cycle Practice Tool                   */
/*  app.js — Init, track switching, reference panel, dark mode  */
/* ============================================================ */

var App = App || {};

/* --- State --- */
App.state = {
  currentTrack: "worked-examples",
  darkMode: false,
  referenceOpen: false
};

/* --- Initialization --- */
App.init = function () {
  /* Check for saved dark mode preference */
  var savedDark = localStorage.getItem("acct321-dark-mode");
  if (savedDark === "true") {
    App.state.darkMode = true;
    document.documentElement.setAttribute("data-theme", "dark");
  }

  /* Wire up track toggle buttons */
  var trackBtns = document.querySelectorAll(".track-btn");
  trackBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var track = this.getAttribute("data-track");
      if (track) {
        App.switchTrack(track);
      }
    });
  });

  /* Wire up dark mode toggle */
  var darkToggle = document.getElementById("dark-toggle");
  if (darkToggle) {
    darkToggle.addEventListener("click", function () {
      App.toggleDarkMode();
    });
    /* Update button text */
    darkToggle.textContent = App.state.darkMode ? "\u2600 Light" : "\u263E Dark";
  }

  /* Wire up reference panel toggle */
  var refToggle = document.getElementById("ref-toggle");
  if (refToggle) {
    refToggle.addEventListener("click", function () {
      App.toggleReference();
    });
  }

  /* Wire up reference overlay close */
  var refOverlay = document.getElementById("reference-overlay");
  if (refOverlay) {
    refOverlay.addEventListener("click", function () {
      App.closeReference();
    });
  }

  /* Wire up reference panel close button */
  var closeRef = document.getElementById("close-ref");
  if (closeRef) {
    closeRef.addEventListener("click", function () {
      App.closeReference();
    });
  }

  /* Keyboard: Escape closes reference panel */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && App.state.referenceOpen) {
      App.closeReference();
    }
  });

  /* Initialize the default track */
  App.switchTrack("worked-examples");
};

/* --- Track Switching --- */

/* Switch between worked examples and random practice tracks */
App.switchTrack = function (track) {
  App.state.currentTrack = track;

  /* Update toggle buttons */
  var trackBtns = document.querySelectorAll(".track-btn");
  trackBtns.forEach(function (btn) {
    var btnTrack = btn.getAttribute("data-track");
    if (btnTrack === track) {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    }
  });

  /* Show the selected track content, hide the other */
  var workedContent = document.getElementById("worked-examples-content");
  var randomContent = document.getElementById("random-practice-content");

  if (workedContent && randomContent) {
    if (track === "worked-examples") {
      workedContent.classList.add("active");
      randomContent.classList.remove("active");
    } else {
      workedContent.classList.remove("active");
      randomContent.classList.add("active");
    }
  }

  /* Initialize the track if not already done */
  if (track === "worked-examples" && !WorkedExamples.initialized) {
    WorkedExamples.initialized = true;
    WorkedExamples.init();
  }

  if (track === "random-practice" && !RandomPractice.initialized) {
    RandomPractice.initialized = true;
    RandomPractice.init();
  }
};

/* --- Dark Mode --- */

/* Toggle dark mode on/off */
App.toggleDarkMode = function () {
  App.state.darkMode = !App.state.darkMode;
  var darkToggle = document.getElementById("dark-toggle");

  if (App.state.darkMode) {
    document.documentElement.setAttribute("data-theme", "dark");
    if (darkToggle) {
      darkToggle.textContent = "\u2600 Light";
    }
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (darkToggle) {
      darkToggle.textContent = "\u263E Dark";
    }
  }

  localStorage.setItem("acct321-dark-mode", App.state.darkMode);
};

/* --- Reference Panel --- */

/* Toggle the reference panel open/closed */
App.toggleReference = function () {
  if (App.state.referenceOpen) {
    App.closeReference();
  } else {
    App.openReference();
  }
};

/* Open the reference panel */
App.openReference = function () {
  App.state.referenceOpen = true;
  var overlay = document.getElementById("reference-overlay");
  var panel = document.getElementById("reference-panel");

  if (overlay) {
    overlay.classList.add("open");
  }
  if (panel) {
    panel.classList.add("open");
  }

  /* Populate reference content if not already done */
  if (!App.referencePopulated) {
    App.populateReference();
    App.referencePopulated = true;
  }
};

/* Close the reference panel */
App.closeReference = function () {
  App.state.referenceOpen = false;
  var overlay = document.getElementById("reference-overlay");
  var panel = document.getElementById("reference-panel");

  if (overlay) {
    overlay.classList.remove("open");
  }
  if (panel) {
    panel.classList.remove("open");
  }
};

/* Populate the reference panel with content */
App.populateReference = function () {
  var panel = document.getElementById("reference-panel");
  if (!panel) {
    return;
  }

  var html = "";

  /* Color Legend */
  html += '<h2>Reference</h2>';
  html += '<button class="close-ref" id="close-ref" aria-label="Close reference panel">&times;</button>';

  html += '<h3 style="font-size:0.95rem;margin-top:0.5rem">Color Legend</h3>';
  html += '<div class="ref-color-legend">';
  html += '<span class="legend-item"><span class="legend-swatch" style="background:var(--debit-color)"></span> Debits</span>';
  html += '<span class="legend-item"><span class="legend-swatch" style="background:var(--credit-color)"></span> Credits</span>';
  html += '<span class="legend-item"><span class="legend-swatch" style="background:var(--asset-color)"></span> Assets</span>';
  html += '<span class="legend-item"><span class="legend-swatch" style="background:var(--liability-color)"></span> Liabilities</span>';
  html += '<span class="legend-item"><span class="legend-swatch" style="background:var(--equity-color)"></span> Equity</span>';
  html += '</div>';

  /* Pacioli — placed right after color legend for visibility */
  html += '<div class="ref-pacioli">';
  html += '<img src="assets/Luca_Pacioli.jpg" alt="Portrait of Luca Pacioli" />';
  html += '<div><p><strong>Luca Pacioli</strong> (1445\u20131517) documented double-entry accounting in 1494. His work "Summa de Arithmetica" became the foundation of modern accounting.</p></div>';
  html += '</div>';

  /* Account Type Cards */
  html += '<h3 style="font-size:0.95rem">Account Type Rules</h3>';

  var types = [
    {
      name: "Assets",
      color: "var(--asset-color)",
      inc: "Debit",
      dec: "Credit",
      examples: "Cash, Accounts Receivable, Supplies, Equipment, Inventory"
    },
    {
      name: "Liabilities",
      color: "var(--liability-color)",
      inc: "Credit",
      dec: "Debit",
      examples: "Accounts Payable, Notes Payable, Unearned Revenue"
    },
    {
      name: "Equity",
      color: "var(--equity-color)",
      inc: "Credit",
      dec: "Debit",
      examples: "Owner's Capital, Common Stock, Retained Earnings"
    },
    {
      name: "Revenue",
      color: "var(--equity-color)",
      inc: "Credit",
      dec: "Debit",
      examples: "Service Revenue, Sales Revenue, Interest Revenue",
      statement: "(Income Statement)"
    },
    {
      name: "Expenses",
      color: "var(--asset-color)",
      inc: "Debit",
      dec: "Credit",
      examples: "Rent Expense, Salaries Expense, Utilities Expense",
      statement: "(Income Statement)"
    }
  ];

  types.forEach(function (t) {
    html += '<div class="ref-account-card">';
    html += '<h3 style="color:' + t.color + '">' + t.name + (t.statement ? ' <span style="font-size:0.75rem;font-weight:normal;color:var(--text-secondary)">' + t.statement + '</span>' : '') + '</h3>';
    html += '<p class="rule">Increase with <span class="rule-' + t.inc.toLowerCase() + '">' + t.inc.toUpperCase() + '</span></p>';
    html += '<p class="rule">Decrease with <span class="rule-' + t.dec.toLowerCase() + '">' + t.dec.toUpperCase() + '</span></p>';
    html += '<p class="examples">Examples: ' + t.examples + '</p>';
    html += '</div>';
  });

  panel.innerHTML = html;

  /* Re-wire close button since we replaced the innerHTML */
  var closeRef = document.getElementById("close-ref");
  if (closeRef) {
    closeRef.addEventListener("click", function () {
      App.closeReference();
    });
  }
};

/* --- Document Ready --- */
document.addEventListener("DOMContentLoaded", function () {
  App.init();

  /* --- Cheat code: Shift+number to skip to a phase (for instructor testing) --- */
  /* Works on whichever track is currently active (Demo or Random Practice) */
  document.addEventListener("keydown", function (e) {
    /* Only trigger on Shift+1 through Shift+6 */
    if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      /* Shift+0: Show all correct answers for the current phase (instructor review) */
      if ((e.key === ")" || e.key === "0") && App.state.currentTrack === "random-practice" && RandomPractice.state.exerciseSet) {
        RandomPractice.showPhaseAnswers(RandomPractice.state.currentPhaseIndex);
        return;
      }

      var phaseIdx = -1;
      if (e.key === "!" || e.key === "1") { phaseIdx = 0; }
      else if (e.key === "@" || e.key === "2") { phaseIdx = 1; }
      else if (e.key === "#" || e.key === "3") { phaseIdx = 2; }
      else if (e.key === "$" || e.key === "4") { phaseIdx = 3; }
      else if (e.key === "%" || e.key === "5") { phaseIdx = 4; }
      else if (e.key === "^" || e.key === "6") { phaseIdx = 5; }

      if (phaseIdx < 0) { return; }

      /* Route to the active track */
      if (App.state.currentTrack === "random-practice" && RandomPractice.state.exerciseSet) {
        /* --- Exercise track cheat code --- */
        if (phaseIdx >= RandomPractice.state.exerciseSet.phases.length) { return; }

        /* Auto-complete all prior phases (fill in correct answers) */
        for (var i = 0; i < phaseIdx; i++) {
          if (!RandomPractice.state.phaseComplete[i]) {
            RandomPractice.autoCompletePhase(i);
          }
        }
        RandomPractice.state.currentPhaseIndex = phaseIdx;
        RandomPractice.state.currentTxIndex = 0;
        RandomPractice.saveProgress();
        RandomPractice.renderPhaseCards();
        RandomPractice.loadPhase(phaseIdx);

      } else if (App.state.currentTrack === "worked-examples" && WorkedExamples.state.phases.length > 0) {
        /* --- Demo track cheat code (existing) --- */
        if (phaseIdx >= WorkedExamples.state.phases.length) { return; }

        /* Mark all prior phases as complete */
        for (var i = 0; i < phaseIdx; i++) {
          WorkedExamples.state.phaseComplete[i] = true;
        }
        WorkedExamples.state.currentPhaseIndex = phaseIdx;
        WorkedExamples.state.currentTransactionIndex = 0;
        WorkedExamples.saveProgress();
        WorkedExamples.renderPhaseCards();

        /* Load the target phase */
        var phase = WorkedExamples.state.phases[phaseIdx];
        if (phase && phase.meta && phase.meta.signals && (!phase.transactions || phase.transactions.length === 0)) {
          WorkedExamples.renderRecognitionPhase();
        } else if (phase && phase.meta && phase.meta.income_statement && (!phase.transactions || phase.transactions.length === 0)) {
          WorkedExamples.renderFlowAnimation();
        } else if (phase && phase.meta && phase.meta.balance_sheet && phase.meta.trial_balance && (!phase.transactions || phase.transactions.length === 0)) {
          WorkedExamples.renderBalanceSheetFlow();
        } else {
          WorkedExamples.renderTransaction(0);
        }
      }
    }
  });
});
