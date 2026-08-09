/* ============================================================ */
/*  ACCT 321 — Accounting Cycle Practice Tool                   */
/*  worked-examples.js — Track 1: Dress Right 3-Phase Exercise  */
/*  Phase progression, sequential transactions, trial balance   */
/* ============================================================ */

var WorkedExamples = WorkedExamples || {};

/* --- State --- */
WorkedExamples.state = {
  phases: [],           /* Array of 3 phase data objects */
  currentPhaseIndex: 0,
  currentTransactionIndex: 0,
  accounts: [],
  accountMap: {},
  step1Complete: {},
  step2Complete: {},
  feedbackShown: {},
  scoreData: {},
  checked: false,
  phaseComplete: [false, false, false, false, false, false],
  trialBalanceShown: [false, false, false],
  reasoningOpen: false,
  /* --- Cycle Timer --- */
  timerStarted: false,      /* true once counting has begun */
  timerStopped: false,      /* true when Phase 3.5 BS animation completes */
  timerStartTs: 0,          /* epoch ms when counting began */
  timerElapsed: 0,          /* accumulated ms (excluding paused/refresh gaps) */
  timerInterval: null      /* setInterval handle for display updates */
};

/* --- Progress Save/Restore (localStorage) --- */
WorkedExamples.PROGRESS_KEY = "acct321_we_progress";

WorkedExamples.saveProgress = function () {
  try {
    var data = {
      currentPhaseIndex: WorkedExamples.state.currentPhaseIndex,
      currentTransactionIndex: WorkedExamples.state.currentTransactionIndex,
      phaseComplete: WorkedExamples.state.phaseComplete,
      step1Complete: WorkedExamples.state.step1Complete,
      step2Complete: WorkedExamples.state.step2Complete,
      feedbackShown: WorkedExamples.state.feedbackShown,
      scoreData: WorkedExamples.state.scoreData,
      /* Cycle timer persistence */
      timerStarted: WorkedExamples.state.timerStarted,
      timerStopped: WorkedExamples.state.timerStopped,
      timerStartTs: WorkedExamples.state.timerStartTs,
      timerElapsed: WorkedExamples.state.timerElapsed
    };
    localStorage.setItem(WorkedExamples.PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    /* localStorage may be unavailable — fail silently */
  }
};

WorkedExamples.loadProgress = function () {
  try {
    var raw = localStorage.getItem(WorkedExamples.PROGRESS_KEY);
    if (!raw) {
      return false;
    }
    var data = JSON.parse(raw);
    WorkedExamples.state.currentPhaseIndex = data.currentPhaseIndex || 0;
    WorkedExamples.state.currentTransactionIndex = data.currentTransactionIndex || 0;
    /* Ensure phaseComplete always has 6 elements (migration from old formats) */
    var savedPC = data.phaseComplete || [false, false, false, false, false, false];
    while (savedPC.length < 6) { savedPC.push(false); }
    WorkedExamples.state.phaseComplete = savedPC;
    WorkedExamples.state.step1Complete = data.step1Complete || {};
    WorkedExamples.state.step2Complete = data.step2Complete || {};
    WorkedExamples.state.feedbackShown = data.feedbackShown || {};
    WorkedExamples.state.scoreData = data.scoreData || {};
    /* Restore cycle timer state */
    WorkedExamples.state.timerStarted = !!data.timerStarted;
    WorkedExamples.state.timerStopped = !!data.timerStopped;
    WorkedExamples.state.timerStartTs = data.timerStartTs || 0;
    WorkedExamples.state.timerElapsed = data.timerElapsed || 0;
    return true;
  } catch (e) {
    return false;
  }
};

WorkedExamples.clearProgress = function () {
  try {
    localStorage.removeItem(WorkedExamples.PROGRESS_KEY);
  } catch (e) {
    /* fail silently */
  }
};

/* --- Cycle Timer --- */
/* Starts counting when the demo loads; stops when Phase 3.5 BS animation completes. */
WorkedExamples.timerStart = function () {
  if (WorkedExamples.state.timerStopped) { return; }      /* finished, don't restart */
  /* If already started (e.g. restored from localStorage on page reload),
     just re-establish the display interval without resetting the timestamp. */
  if (!WorkedExamples.state.timerStarted) {
    WorkedExamples.state.timerStarted = true;
    WorkedExamples.state.timerStartTs = Date.now();
    WorkedExamples.saveProgress();
  }
  /* Tick the display every second */
  if (WorkedExamples.state.timerInterval) { clearInterval(WorkedExamples.state.timerInterval); }
  WorkedExamples.state.timerInterval = setInterval(function () {
    WorkedExamples.timerUpdateDisplay();
  }, 1000);
  WorkedExamples.timerUpdateDisplay();
};

/* Stops the timer — called when Phase 3.5 balance sheet animation completes */
WorkedExamples.timerStop = function () {
  if (!WorkedExamples.state.timerStarted || WorkedExamples.state.timerStopped) { return; }
  WorkedExamples.state.timerStopped = true;
  /* Accumulate the final slice */
  if (WorkedExamples.state.timerStartTs) {
    WorkedExamples.state.timerElapsed += Date.now() - WorkedExamples.state.timerStartTs;
    WorkedExamples.state.timerStartTs = 0;
  }
  if (WorkedExamples.state.timerInterval) {
    clearInterval(WorkedExamples.state.timerInterval);
    WorkedExamples.state.timerInterval = null;
  }
  WorkedExamples.saveProgress();
  WorkedExamples.timerUpdateDisplay();
};

/* Resets the timer to zero — called on Reset All Progress */
WorkedExamples.timerReset = function () {
  if (WorkedExamples.state.timerInterval) {
    clearInterval(WorkedExamples.state.timerInterval);
    WorkedExamples.state.timerInterval = null;
  }
  WorkedExamples.state.timerStarted = false;
  WorkedExamples.state.timerStopped = false;
  WorkedExamples.state.timerStartTs = 0;
  WorkedExamples.state.timerElapsed = 0;
  /* Clear the stopped styling so the display looks fresh */
  var el = document.getElementById("we-cycle-timer");
  if (el) { el.classList.remove("stopped"); }
  var label = document.getElementById("we-cycle-timer-label");
  if (label) { label.textContent = "Cycle Time"; }
  WorkedExamples.timerUpdateDisplay();
};

/* Returns total elapsed ms across start/stop segments */
WorkedExamples.timerGetElapsed = function () {
  var elapsed = WorkedExamples.state.timerElapsed;
  if (WorkedExamples.state.timerStarted && !WorkedExamples.state.timerStopped && WorkedExamples.state.timerStartTs) {
    elapsed += Date.now() - WorkedExamples.state.timerStartTs;
  }
  return elapsed;
};

/* Formats ms as MM:SS */
WorkedExamples.timerFormat = function (ms) {
  if (!ms || ms < 0) { ms = 0; }
  var totalSec = Math.floor(ms / 1000);
  var m = Math.floor(totalSec / 60);
  var s = totalSec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
};

/* Updates the timer display element if present in the DOM */
WorkedExamples.timerUpdateDisplay = function () {
  var el = document.getElementById("we-cycle-timer");
  if (!el) { return; }
  var ms = WorkedExamples.timerGetElapsed();
  el.textContent = WorkedExamples.timerFormat(ms);
  if (WorkedExamples.state.timerStopped) {
    el.classList.add("stopped");
    var label = document.getElementById("we-cycle-timer-label");
    if (label) { label.textContent = "Final Time"; }
  }
};

/* --- Phase Configuration --- */
WorkedExamples.PHASE_FILES = [
  "data/dress-right-phase1-daily-ops.json",
  "data/dress-right-phase1.5-recognition.json",
  "data/dress-right-phase2-adjusting.json",
  "data/dress-right-phase2.5-flow.json",
  "data/dress-right-phase3-closing.json",
  "data/dress-right-phase3.5-balance-sheet.json"
];

/* --- Initialization --- */
WorkedExamples.init = function () {
  var container = document.getElementById("worked-examples-content");
  if (!container) {
    return;
  }

  /* Load chart of accounts first, then phase data */
  Utils.loadChartOfAccounts().then(function (coaData) {
    WorkedExamples.state.accounts = Utils.sortAccounts(coaData.accounts || []);
    WorkedExamples.state.accountMap = Utils.buildAccountMap(WorkedExamples.state.accounts);

    /* Build the initial HTML structure */
    container.innerHTML =
      '<div id="we-phase-cards" class="we-phase-cards"></div>' +
      '<div id="we-progress" class="we-progress" aria-live="polite"></div>' +
      '<div id="we-description" class="we-description" aria-live="polite"></div>' +
      '<div id="we-equation" class="we-equation-section"></div>' +
      '<div id="we-journal" class="we-journal"></div>' +
      '<div id="we-explain" class="we-explain-toggle"></div>' +
      '<div id="we-nav" class="we-nav"></div>' +
      '<div id="we-trial-balance" class="we-trial-balance-section"></div>' +
      '<div id="we-summary" class="we-summary"></div>';

    /* Load all 3 phase JSON files */
    return WorkedExamples.loadAllPhases();
  }).then(function (phases) {
    WorkedExamples.state.phases = phases;

    /* Restore saved progress if available */
    var restored = WorkedExamples.loadProgress();

    WorkedExamples.renderPhaseCards();
    /* Start the cycle timer (resumes from saved elapsed time if restored) */
    WorkedExamples.timerStart();
    if (restored) {
      /* Jump to the saved phase and transaction, keeping saved per-transaction state */
      WorkedExamples.loadPhase(WorkedExamples.state.currentPhaseIndex, true);
      WorkedExamples.renderPhaseCards();
      if (WorkedExamples.state.currentTransactionIndex > 0) {
        var curPhase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
        if (curPhase && curPhase.meta && curPhase.meta.signals) {
          WorkedExamples.renderRecognitionPhase();
        } else if (curPhase && curPhase.meta && curPhase.meta.income_statement) {
          WorkedExamples.renderFlowAnimation();
        } else if (curPhase && curPhase.meta && curPhase.meta.balance_sheet && curPhase.meta.trial_balance) {
          WorkedExamples.renderBalanceSheetFlow();
        } else {
          WorkedExamples.renderTransaction(WorkedExamples.state.currentTransactionIndex);
        }
      } else {
        var curPhase2 = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
        if (curPhase2 && curPhase2.meta && curPhase2.meta.signals) {
          WorkedExamples.renderRecognitionPhase();
        } else if (curPhase2 && curPhase2.meta && curPhase2.meta.income_statement) {
          WorkedExamples.renderFlowAnimation();
        } else if (curPhase2 && curPhase2.meta && curPhase2.meta.balance_sheet && curPhase2.meta.trial_balance) {
          WorkedExamples.renderBalanceSheetFlow();
        } else {
          WorkedExamples.renderTransaction(0);
        }
      }
    } else {
      WorkedExamples.loadPhase(0);
    }
  }).catch(function (err) {
    container.innerHTML = '<div class="card"><p>Error loading worked examples. Please ensure the data files are available.</p><p style="font-size:0.85rem;color:var(--text-secondary)">' + err.message + '</p></div>';
  });
};

/* Load all 3 phase JSON files */
WorkedExamples.loadAllPhases = function () {
  return Promise.all(WorkedExamples.PHASE_FILES.map(Utils.loadJSON));
};

/* --- Phase Cards --- */
WorkedExamples.renderPhaseCards = function () {
  var el = document.getElementById("we-phase-cards");
  if (!el) {
    return;
  }

  var html = "";
  WorkedExamples.state.phases.forEach(function (phase, idx) {
    var meta = phase.meta || {};
    var phaseNum = meta.phase || (idx + 1);
    var phaseName = meta.phase_name || ("Phase " + phaseNum);
    var txCount = (phase.transactions || []).length;
    var isComplete = WorkedExamples.state.phaseComplete[idx];
    var isUnlocked = idx === 0 || WorkedExamples.state.phaseComplete[idx - 1];
    var isActive = idx === WorkedExamples.state.currentPhaseIndex;
    var completedCount = 0;

    /* Count completed transactions in this phase */
    if (isComplete) {
      completedCount = txCount;
    } else {
      /* Count how many transactions have been completed (all 10 checks passed) */
      for (var t = 0; t < txCount; t++) {
        var sd = WorkedExamples.state.scoreData[idx + "-" + t];
        if (sd && sd.totalScore && sd.totalScore.passed === sd.totalScore.total) {
          completedCount++;
        }
      }
    }

    var cardClass = "we-phase-card";
    if (isActive) { cardClass += " active"; }
    if (isComplete) { cardClass += " complete"; }
    if (!isUnlocked) { cardClass += " locked"; }

    html += '<div class="' + cardClass + '" data-phase="' + idx + '">';
    html += '<div class="we-phase-card-header">';
    html += '<span class="we-phase-num">Phase ' + phaseNum + '</span>';
    if (!isUnlocked) {
      html += '<span class="we-phase-lock-icon" aria-label="Locked">&#x1F512;</span>';
    } else if (isComplete) {
      html += '<span class="we-phase-check-icon" aria-label="Complete">&#x2713;</span>';
    }
    html += '</div>';
    html += '<div class="we-phase-card-name">' + Utils.escapeHtml(phaseName) + '</div>';
    html += '<div class="we-phase-card-count">' + txCount + ' transaction' + (txCount !== 1 ? "s" : "") + '</div>';
    html += '<div class="we-phase-card-progress">' + completedCount + '/' + txCount + ' complete</div>';
    html += '</div>';
  });

  el.innerHTML = html;

  /* Add reset button and cycle timer below phase cards */
  var resetHtml = '<div class="we-reset-area">' +
    '<div class="we-cycle-timer-wrap" id="we-cycle-timer-wrap">' +
      '<span class="we-cycle-timer-label" id="we-cycle-timer-label">Cycle Time</span>' +
      '<span class="we-cycle-timer" id="we-cycle-timer">00:00</span>' +
    '</div>' +
    '<button class="we-reset-btn" id="we-reset-btn" title="Erase all saved progress and start over">&#x21bb; Reset All Progress</button>' +
    '</div>';
  el.insertAdjacentHTML("beforeend", resetHtml);

  /* Wire up click handlers for unlocked phase cards */
  var cards = el.querySelectorAll(".we-phase-card:not(.locked)");
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      var idx = parseInt(this.getAttribute("data-phase"), 10);
      /* Save current phase progress before switching */
      WorkedExamples.saveProgress();
      /* Restore saved progress (per-transaction state for all phases) */
      WorkedExamples.loadProgress();
      /* Now switch to the target phase without wiping per-transaction state */
      WorkedExamples.state.currentPhaseIndex = idx;
      WorkedExamples.saveProgress();
      WorkedExamples.renderPhaseCards();
      /* Render the current transaction for the target phase */
      var phase = WorkedExamples.state.phases[idx];
      if (phase && phase.meta && phase.meta.signals && (!phase.transactions || phase.transactions.length === 0)) {
        WorkedExamples.renderRecognitionPhase();
      } else if (phase && phase.meta && phase.meta.income_statement && (!phase.transactions || phase.transactions.length === 0)) {
        WorkedExamples.renderFlowAnimation();
      } else if (phase && phase.meta && phase.meta.balance_sheet && phase.meta.trial_balance && (!phase.transactions || phase.transactions.length === 0)) {
        WorkedExamples.renderBalanceSheetFlow();
      } else if (WorkedExamples.state.currentTransactionIndex > 0 && WorkedExamples.state.currentPhaseIndex === idx) {
        WorkedExamples.renderTransaction(WorkedExamples.state.currentTransactionIndex);
      } else {
        WorkedExamples.state.currentTransactionIndex = 0;
        WorkedExamples.renderTransaction(0);
      }
    });
  });

  /* Wire up reset button */
  var resetBtn = document.getElementById("we-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      /* Confirmation dialog to prevent accidental reset */
      var confirmed = window.confirm(
        "This will erase ALL saved progress across all phases and cannot be undone.\n\n" +
        "Are you sure you want to reset?"
      );
      if (confirmed) {
        WorkedExamples.clearProgress();
        /* Reset all state */
        WorkedExamples.state.currentPhaseIndex = 0;
        WorkedExamples.state.currentTransactionIndex = 0;
        WorkedExamples.state.phaseComplete = [false, false, false, false, false, false];
        WorkedExamples.state.step1Complete = {};
        WorkedExamples.state.step2Complete = {};
        WorkedExamples.state.feedbackShown = {};
        WorkedExamples.state.scoreData = {};
        WorkedExamples.state.checked = false;
        WorkedExamples.state.trialBalanceShown = [false, false, false, false];
        WorkedExamples.state.reasoningOpen = false;
        /* Reset and restart the cycle timer */
        WorkedExamples.timerReset();
        /* Reload Phase 1 from scratch */
        WorkedExamples.renderPhaseCards();
        WorkedExamples.loadPhase(0);
        WorkedExamples.timerStart();
      }
    });
  }
};

/* --- Phase Loading --- */
WorkedExamples.loadPhase = function (index, skipReset) {
  if (index > 0 && !WorkedExamples.state.phaseComplete[index - 1]) {
    return; /* Phase is locked */
  }

  WorkedExamples.state.currentPhaseIndex = index;
  if (!skipReset) {
    WorkedExamples.state.currentTransactionIndex = 0;
    WorkedExamples.state.checked = false;
    WorkedExamples.state.step1Complete = {};
    WorkedExamples.state.step2Complete = {};
    WorkedExamples.state.feedbackShown = {};
    WorkedExamples.state.scoreData = {};
  }
  WorkedExamples.state.reasoningOpen = false;

  /* Hide trial balance section */
  var tbEl = document.getElementById("we-trial-balance");
  if (tbEl) {
    tbEl.innerHTML = "";
  }

  /* Hide summary */
  var summaryEl = document.getElementById("we-summary");
  if (summaryEl) {
    summaryEl.classList.remove("open");
  }

  WorkedExamples.renderPhaseCards();
  if (!skipReset) {
    /* Check if this is a special phase (no transactions) */
    var phase = WorkedExamples.state.phases[index];
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
  WorkedExamples.saveProgress();
};

/* --- Transaction Rendering --- */
WorkedExamples.renderTransaction = function (index) {
  var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
  if (!phase) {
    return;
  }

  var transactions = phase.transactions || [];
  if (index < 0 || index >= transactions.length) {
    /* Show phase complete */
    WorkedExamples.renderPhaseComplete();
    return;
  }

  WorkedExamples.state.currentTransactionIndex = index;
  WorkedExamples.saveProgress();
  var tx = transactions[index];
  var total = transactions.length;
  var phaseIdx = WorkedExamples.state.currentPhaseIndex;
  var scoreKey = phaseIdx + "-" + index;

  /* Reset per-transaction state */
  if (WorkedExamples.state.step1Complete[index] === undefined) {
    WorkedExamples.state.step1Complete[index] = false;
  }
  if (WorkedExamples.state.step2Complete[index] === undefined) {
    WorkedExamples.state.step2Complete[index] = false;
  }
  if (WorkedExamples.state.feedbackShown[index] === undefined) {
    WorkedExamples.state.feedbackShown[index] = false;
  }
  if (WorkedExamples.state.scoreData[scoreKey] === undefined) {
    WorkedExamples.state.scoreData[scoreKey] = null;
  }

  /* Update progress */
  WorkedExamples.renderProgress(index, total);

  /* Update description */
  var descEl = document.getElementById("we-description");
  if (descEl) {
    descEl.textContent = tx.description || "";
  }

  /* Update equation analysis (Step 1) */
  WorkedExamples.renderEquationAnalysis(tx, index);

  /* Update journal entry (Step 2) */
  WorkedExamples.renderJournal(tx, index);

  /* Clear explanation area */
  var explainEl = document.getElementById("we-explain");
  if (explainEl) {
    explainEl.innerHTML = "";
  }

  /* Update navigation */
  WorkedExamples.renderNav(index, total);

  /* Hide summary */
  var summaryEl = document.getElementById("we-summary");
  if (summaryEl) {
    summaryEl.classList.remove("open");
  }

  /* Hide trial balance section when navigating within a phase */
  var tbEl = document.getElementById("we-trial-balance");
  if (tbEl) {
    tbEl.innerHTML = "";
  }
};

/* Render progress dots and text */
WorkedExamples.renderProgress = function (current, total) {
  var el = document.getElementById("we-progress");
  if (!el) {
    return;
  }

  var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
  var meta = phase ? phase.meta : {};
  var phaseName = meta.phase_name || ("Phase " + (WorkedExamples.state.currentPhaseIndex + 1));

  var dotsHtml = "";
  for (var i = 0; i < total; i++) {
    var activeClass = i === current ? "active" : "";
    dotsHtml += '<span class="we-progress-dot ' + activeClass + '" aria-label="Transaction ' + (i + 1) + '"></span>';
  }

  el.innerHTML =
    '<div class="we-progress-dots">' + dotsHtml + '</div>' +
    '<span class="we-progress-text">' + Utils.escapeHtml(phaseName) + ' &mdash; Transaction ' + (current + 1) + ' of ' + total + '</span>';
};
/* --- Flow Animation Phase (Phase 2.5) --- */
WorkedExamples.renderFlowAnimation = function () {
  var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
  if (!phase || !phase.meta) { return; }

  var meta = phase.meta;
  var tb = meta.trial_balance || [];
  var isData = meta.income_statement || {};

  /* Only IS accounts fly to the right */
  var isAccounts = tb.filter(function (r) { return r.statement === "income_statement"; });
  var bsAccounts = tb.filter(function (r) { return r.statement === "balance_sheet"; });

  /* Hide regular transaction elements */
  ["we-progress", "we-equation", "we-journal", "we-explain", "we-nav"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) { el.innerHTML = ""; }
  });

  var container = document.getElementById("we-description") || document.getElementById("worked-examples-content");
  if (!container) { return; }

  var html = "";
  html += '<div class="we-flow">';
  html += '<div class="we-flow-header">';
  html += '<h3>Income Statement Flow</h3>';
  html += '<p class="we-flow-instructions">Watch how revenue and expense accounts from the adjusted trial balance flow to the Income Statement.</p>';
  html += '<button class="btn btn-primary" id="we-flow-play-btn">&#9658; Play</button>';
  html += '</div>';

  /* Two-column layout: TB on left, IS template on right */
  html += '<div class="we-flow-two-col">';
  /* Left: Trial Balance */
  html += '<div class="we-flow-tb-col">';
  html += '<div class="we-flow-col-header">Adjusted Trial Balance</div>';
  html += '<div class="we-flow-tb-list" id="we-flow-tb-list">';
  html += '<div class="we-flow-tb-item we-flow-tb-header"><span class="we-flow-item-name">Account</span><span class="we-flow-item-dr">Debit</span><span class="we-flow-item-cr">Credit</span></div>';
  tb.forEach(function (row, idx) {
    var isIS = row.statement === "income_statement";
    var dr = row.debit || 0;
    var cr = row.credit || 0;
    var amount = dr > 0 ? dr : cr;
    html += '<div class="we-flow-tb-item ' + (isIS ? "is-acct" : "bs-acct") + '" id="we-flow-item-' + idx + '" data-idx="' + idx + '" data-is="' + isIS + '">';
    html += '<span class="we-flow-item-name">' + Utils.escapeHtml(row.account) + '</span>';
    html += '<span class="we-flow-item-dr">' + (dr > 0 ? Utils.formatCurrency(dr) : '') + '</span>';
    html += '<span class="we-flow-item-cr">' + (cr > 0 ? Utils.formatCurrency(cr) : '') + '</span>';
    html += '</div>';
  });
  html += '</div>';
  html += '</div>';

  /* Right: Income Statement template (empty until animated) */
  html += '<div class="we-flow-is-col">';
  html += '<div class="we-flow-col-header is-header">Income Statement <span class="we-flow-temp-badge">Temporary</span></div>';
  html += '<div class="we-flow-is-template" id="we-flow-is-template">';
  html += '<div class="we-is-section">Revenue</div>';
  html += '<div class="we-is-line" id="we-is-rev-0"><span>Sales Revenue</span><span class="we-is-amt" id="we-is-rev-amt-0"></span></div>';
  html += '<div class="we-is-line" id="we-is-rev-1"><span>Rent Revenue</span><span class="we-is-amt" id="we-is-rev-amt-1"></span></div>';
  html += '<div class="we-is-line we-is-subtotal"><span>Total Revenue</span><span class="we-is-amt" id="we-is-total-rev"></span></div>';
  html += '<div class="we-is-section">Expenses</div>';
  isData.expenses.forEach(function (e, i) {
    html += '<div class="we-is-line" id="we-is-exp-' + i + '"><span>' + Utils.escapeHtml(e.account) + '</span><span class="we-is-amt" id="we-is-exp-amt-' + i + '"></span></div>';
  });
  html += '<div class="we-is-line we-is-subtotal"><span>Total Expenses</span><span class="we-is-amt" id="we-is-total-exp"></span></div>';
  html += '<div class="we-is-line we-is-netincome"><span>Net Income</span><span class="we-is-amt" id="we-is-netincome"></span></div>';
  html += '</div>';
  html += '</div>';
  html += '</div>'; /* two-col */

  /* Summary (shown after animation) */
  html += '<div class="we-flow-summary" id="we-flow-summary" style="display:none">';
  html += '<p><strong>Income Statement accounts are TEMPORARY</strong> &#8212; they will be closed to Retained Earnings in Phase 3.</p>';
  html += '<p>The remaining ' + bsAccounts.length + ' accounts are PERMANENT and carry forward to the Balance Sheet.</p>';
  html += '<button class="btn btn-primary" id="we-flow-proceed-btn">Proceed to Closing Entries &rarr;</button>';
  html += '</div>';

  html += '</div>';

  container.innerHTML = html;

  /* Wire play button */
  var playBtn = document.getElementById("we-flow-play-btn");
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      playBtn.disabled = true;
      playBtn.textContent = "Playing...";
      WorkedExamples.animateFlowToIS(tb, isData);
    });
  }
};

/* Animate each IS account flying from TB to the income statement */
WorkedExamples.animateFlowToIS = function (tb, isData) {
  var isAccounts = tb.filter(function (r) { return r.statement === "income_statement"; });
  var delay = 600;
  var runningRevTotal = 0;
  var runningExpTotal = 0;
  var revCount = 0;
  var expCount = 0;

  isAccounts.forEach(function (row, i) {
    /* Capture target index synchronously before the timeout fires */
    var myRevIdx = -1;
    var myExpIdx = -1;
    if (row.section === "revenue") {
      myRevIdx = revCount;
      revCount++;
    } else {
      myExpIdx = expCount;
      expCount++;
    }

    setTimeout(function () {
      /* Find the TB item element */
      var tbRow = document.getElementById("we-flow-item-" + tb.indexOf(row));
      if (!tbRow) { return; }

      /* Clone the TB row to create a flying element */
      var rect = tbRow.getBoundingClientRect();
      var clone = tbRow.cloneNode(true);
      clone.className = "we-flow-flying";
      clone.style.position = "fixed";
      clone.style.left = rect.left + "px";
      clone.style.top = rect.top + "px";
      clone.style.width = rect.width + "px";
      clone.style.zIndex = "9999";
      clone.style.pointerEvents = "none";
      document.body.appendChild(clone);

      /* Dim the original TB row */
      tbRow.style.opacity = "0.2";

      /* Find target position in the IS template */
      var targetId;
      var amount = (row.debit || 0) > 0 ? row.debit : row.credit;

      if (myRevIdx >= 0) {
        targetId = "we-is-rev-amt-" + myRevIdx;
        runningRevTotal += amount;
      } else {
        targetId = "we-is-exp-amt-" + myExpIdx;
        runningExpTotal += amount;
      }

      var targetEl = document.getElementById(targetId);
      var targetRect = targetEl ? targetEl.getBoundingClientRect() : null;

      if (targetRect) {
        /* Animate the clone flying to the target */
        clone.style.transition = "left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease";
        requestAnimationFrame(function () {
          clone.style.left = targetRect.left + "px";
          clone.style.top = targetRect.top + "px";
          clone.style.opacity = "0.3";
        });

        /* After flight, fill in the target and remove clone */
        setTimeout(function () {
          targetEl.textContent = Utils.formatCurrency(amount);
          targetEl.parentElement.classList.add("filled");
          if (clone.parentNode) { clone.remove(); }

          /* Update subtotals when all revenues or all expenses are done */
          if (myRevIdx >= 0 && myRevIdx === isData.revenues.length - 1) {
            document.getElementById("we-is-total-rev").textContent = Utils.formatCurrency(runningRevTotal);
            document.getElementById("we-is-total-rev").parentElement.classList.add("filled");
          } else if (myExpIdx >= 0 && myExpIdx === isData.expenses.length - 1) {
            document.getElementById("we-is-total-exp").textContent = Utils.formatCurrency(runningExpTotal);
            document.getElementById("we-is-total-exp").parentElement.classList.add("filled");
            /* Show net income */
            setTimeout(function () {
              document.getElementById("we-is-netincome").textContent = Utils.formatCurrency(runningRevTotal - runningExpTotal);
              document.getElementById("we-is-netincome").parentElement.classList.add("filled");

              /* Show summary after net income appears */
              setTimeout(function () {
                var summary = document.getElementById("we-flow-summary");
                if (summary) { summary.style.display = "block"; }
                var proceedBtn = document.getElementById("we-flow-proceed-btn");
                if (proceedBtn) {
                  proceedBtn.addEventListener("click", function () {
                    WorkedExamples.state.phaseComplete[WorkedExamples.state.currentPhaseIndex] = true;
                    WorkedExamples.saveProgress();
                    WorkedExamples.renderPhaseComplete();
                  });
                }
              }, 1000);
            }, 500);
          }
        }, 850);
      }
    }, delay * i);
  });
};

/* --- Balance Sheet Flow Phase (Phase 3.5) --- */
WorkedExamples.renderBalanceSheetFlow = function () {
  var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
  if (!phase || !phase.meta) { return; }

  var meta = phase.meta;
  var tb = meta.trial_balance || [];
  var bsData = meta.balance_sheet || {};

  /* Hide regular transaction elements */
  ["we-progress", "we-equation", "we-journal", "we-explain", "we-nav"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) { el.innerHTML = ""; }
  });

  var container = document.getElementById("we-description") || document.getElementById("worked-examples-content");
  if (!container) { return; }

  var html = "";
  html += '<div class="we-flow">';
  html += '<div class="we-flow-header">';
  html += '<h3>Balance Sheet Flow</h3>';
  html += '<p class="we-flow-instructions">Watch how permanent accounts from the post-closing trial balance flow to the Balance Sheet. Beginning balances are zero (first period).</p>';
  html += '<button class="btn btn-primary" id="we-bs-flow-play-btn">&#9658; Play</button>';
  html += '</div>';

  /* Two-column layout: TB on left, BS template on right */
  html += '<div class="we-flow-two-col">';
  /* Left: Post-closing Trial Balance */
  html += '<div class="we-flow-tb-col">';
  html += '<div class="we-flow-col-header">Post-Closing Trial Balance</div>';
  html += '<div class="we-flow-tb-list" id="we-bs-tb-list">';
  html += '<div class="we-flow-tb-item we-flow-tb-header"><span class="we-flow-item-name">Account</span><span class="we-flow-item-dr">Debit</span><span class="we-flow-item-cr">Credit</span></div>';
  tb.forEach(function (row, idx) {
    var dr = row.debit || 0;
    var cr = row.credit || 0;
    html += '<div class="we-flow-tb-item bs-acct" id="we-bs-item-' + idx + '" data-idx="' + idx + '">';
    html += '<span class="we-flow-item-name">' + Utils.escapeHtml(row.account) + '</span>';
    html += '<span class="we-flow-item-dr">' + (dr > 0 ? Utils.formatCurrency(dr) : '') + '</span>';
    html += '<span class="we-flow-item-cr">' + (cr > 0 ? Utils.formatCurrency(cr) : '') + '</span>';
    html += '</div>';
  });
  html += '</div>';
  html += '</div>';

  /* Right: Balance Sheet template with Beginning, Change, Ending columns */
  html += '<div class="we-flow-bs-col">';
  html += '<div class="we-flow-col-header bs-header">Balance Sheet <span class="we-flow-perm-badge">Permanent</span></div>';
  html += '<div class="we-flow-bs-template" id="we-flow-bs-template">';

  /* Column header row */
  html += '<div class="we-bs-line we-bs-col-header"><span>Account</span><span>Beginning</span><span>Change</span><span>Ending</span></div>';

  var allAccounts = [].concat(bsData.assets, bsData.liabilities, bsData.equity);
  var acctIdx = 0;
  function renderSection(title, items, sectionKey) {
    html += '<div class="we-is-section">' + title + '</div>';
    items.forEach(function (item) {
      var isNeg = item.change < 0;
      html += '<div class="we-bs-line" id="we-bs-line-' + acctIdx + '" data-acct="' + Utils.escapeHtml(item.account) + '">';
      html += '<span class="we-bs-acct-name">' + Utils.escapeHtml(item.account) + '</span>';
      html += '<span class="we-bs-beg">' + Utils.formatCurrency(item.beginning) + '</span>';
      html += '<span class="we-bs-change" id="we-bs-change-' + acctIdx + '"></span>';
      html += '<span class="we-bs-end" id="we-bs-end-' + acctIdx + '"></span>';
      html += '</div>';
      acctIdx++;
    });
    /* Subtotal row */
    var totalKey = sectionKey;
    var totalVal = 0;
    if (sectionKey === "assets") { totalVal = bsData.total_assets; }
    else if (sectionKey === "liabilities") { totalVal = bsData.total_liabilities; }
    else if (sectionKey === "equity") { totalVal = bsData.total_equity; }
    html += '<div class="we-bs-line we-bs-subtotal"><span>Total ' + title + '</span><span></span><span></span><span id="we-bs-total-' + sectionKey + '"></span></div>';
  }

  renderSection("Assets", bsData.assets, "assets");
  renderSection("Liabilities", bsData.liabilities, "liabilities");
  renderSection("Equity", bsData.equity, "equity");
  html += '<div class="we-bs-line we-bs-grand-total"><span>Total Liabilities + Equity</span><span></span><span></span><span id="we-bs-grand-total"></span></div>';
  html += '</div>';
  html += '</div>';
  html += '</div>'; /* two-col */

  /* Summary */
  html += '<div class="we-flow-summary" id="we-bs-flow-summary" style="display:none">';
  html += '<p><strong>Balance Sheet accounts are PERMANENT</strong> &#8212; they carry forward to the next accounting period.</p>';
  html += '<p>Total Assets ($143,500) = Total Liabilities ($81,583) + Total Equity ($61,917) &#8212; the accounting equation balances!</p>';
  html += '</div>';

  html += '</div>';

  container.innerHTML = html;

  /* Wire play button */
  var playBtn = document.getElementById("we-bs-flow-play-btn");
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      playBtn.disabled = true;
      playBtn.textContent = "Playing...";
      WorkedExamples.animateBSToBS(tb, bsData, allAccounts);
    });
  }
};

/* Animate each BS account flying from TB to the balance sheet */
WorkedExamples.animateBSToBS = function (tb, bsData, allAccounts) {
  var delay = 400;
  var assetTotal = 0;
  var liabTotal = 0;
  var equityTotal = 0;

  allAccounts.forEach(function (item, i) {
    /* Find the matching TB row */
    var tbRow = null;
    var tbIdx = -1;
    for (var j = 0; j < tb.length; j++) {
      var tbAccount = tb[j].account;
      /* Handle "Less: " prefix in BS items */
      var cleanName = item.account.replace(/^Less:\s*/, "");
      if (tbAccount === cleanName || tbAccount === item.account) {
        tbRow = tb[j];
        tbIdx = j;
        break;
      }
    }

    setTimeout(function () {
      /* Find the TB item element */
      var tbEl = document.getElementById("we-bs-item-" + tbIdx);
      if (!tbEl) { return; }

      /* Clone the TB row to create a flying element */
      var rect = tbEl.getBoundingClientRect();
      var clone = tbEl.cloneNode(true);
      clone.className = "we-flow-flying";
      clone.style.position = "fixed";
      clone.style.left = rect.left + "px";
      clone.style.top = rect.top + "px";
      clone.style.width = rect.width + "px";
      clone.style.zIndex = "9999";
      clone.style.pointerEvents = "none";
      document.body.appendChild(clone);

      /* Dim the original TB row */
      tbEl.style.opacity = "0.2";

      /* Find target position in the BS template */
      var changeEl = document.getElementById("we-bs-change-" + i);
      var endEl = document.getElementById("we-bs-end-" + i);
      var targetRect = changeEl ? changeEl.getBoundingClientRect() : null;

      if (targetRect) {
        clone.style.transition = "left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease";
        requestAnimationFrame(function () {
          clone.style.left = targetRect.left + "px";
          clone.style.top = targetRect.top + "px";
          clone.style.opacity = "0.3";
        });

        setTimeout(function () {
          /* Fill in the change and ending values */
          var changeAmount = item.change;
          var displayChange = changeAmount < 0 ? "(" + Utils.formatCurrency(Math.abs(changeAmount)) + ")" : Utils.formatCurrency(changeAmount);
          if (changeEl) { changeEl.textContent = displayChange; }
          if (endEl) {
            endEl.textContent = item.ending < 0 ? "(" + Utils.formatCurrency(Math.abs(item.ending)) + ")" : Utils.formatCurrency(item.ending);
          }
          var lineEl = document.getElementById("we-bs-line-" + i);
          if (lineEl) { lineEl.classList.add("filled"); }
          if (clone.parentNode) { clone.remove(); }

          /* Track totals */
          var absEnding = Math.abs(item.ending);
          if (item.change < 0) { absEnding = -absEnding; }
          /* Determine section by checking which array this item belongs to */
          var section = "";
          for (var a = 0; a < bsData.assets.length; a++) {
            if (bsData.assets[a].account === item.account) { section = "assets"; break; }
          }
          if (!section) {
            for (var l = 0; l < bsData.liabilities.length; l++) {
              if (bsData.liabilities[l].account === item.account) { section = "liabilities"; break; }
            }
          }
          if (!section) { section = "equity"; }

          if (section === "assets") { assetTotal += absEnding; }
          else if (section === "liabilities") { liabTotal += absEnding; }
          else { equityTotal += absEnding; }

          /* Update subtotals after last item in each section */
          var assetCount = bsData.assets.length;
          var liabCount = bsData.liabilities.length;
          var equityCount = bsData.equity.length;

          if (i === assetCount - 1) {
            var ta = document.getElementById("we-bs-total-assets");
            if (ta) { ta.textContent = Utils.formatCurrency(bsData.total_assets); ta.parentElement.classList.add("filled"); }
          } else if (i === assetCount + liabCount - 1) {
            var tl = document.getElementById("we-bs-total-liabilities");
            if (tl) { tl.textContent = Utils.formatCurrency(bsData.total_liabilities); tl.parentElement.classList.add("filled"); }
          } else if (i === allAccounts.length - 1) {
            var te = document.getElementById("we-bs-total-equity");
            if (te) { te.textContent = Utils.formatCurrency(bsData.total_equity); te.parentElement.classList.add("filled"); }
            var gt = document.getElementById("we-bs-grand-total");
            if (gt) { gt.textContent = Utils.formatCurrency(bsData.total_liabilities_equity); gt.parentElement.classList.add("filled"); }

            /* Show summary */
            setTimeout(function () {
              var summary = document.getElementById("we-bs-flow-summary");
              if (summary) { summary.style.display = "block"; }
              /* Mark phase complete */
              WorkedExamples.state.phaseComplete[WorkedExamples.state.currentPhaseIndex] = true;
              WorkedExamples.saveProgress();
              /* Stop the cycle timer — Phase 3.5 balance sheet is now complete */
              WorkedExamples.timerStop();
              /* Launch the grand finale celebration with the final time */
              var finalTime = WorkedExamples.timerFormat(WorkedExamples.timerGetElapsed());
              if (typeof Celebration !== "undefined" && Celebration.grandFinale) {
                Celebration.grandFinale(finalTime);
              }
            }, 1000);
          }
        }, 650);
      }
    }, delay * i);
  });
};

/* --- Recognition Phase (Phase 1.5) --- */
WorkedExamples.renderRecognitionPhase = function () {
  var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
  if (!phase || !phase.meta) {
    return;
  }

  var meta = phase.meta;
  var phaseName = meta.phase_name || "Adjustment Recognition";
  var tb = meta.trial_balance || [];
  var signals = meta.signals || [];

  /* Hide regular transaction elements */
  var progressEl = document.getElementById("we-progress");
  var descEl = document.getElementById("we-description");
  var eqEl = document.getElementById("we-equation");
  var journalEl = document.getElementById("we-journal");
  var explainEl = document.getElementById("we-explain");
  var navEl = document.getElementById("we-nav");
  if (progressEl) { progressEl.innerHTML = ""; }
  if (descEl) { descEl.innerHTML = ""; }
  if (eqEl) { eqEl.innerHTML = ""; }
  if (journalEl) { journalEl.innerHTML = ""; }
  if (explainEl) { explainEl.innerHTML = ""; }
  if (navEl) { navEl.innerHTML = ""; }

  /* Render the recognition UI in the description area */
  var container = descEl || document.getElementById("worked-examples-content");
  if (!container) { return; }

  var html = "";
  html += '<div class="we-recognition">';
  html += '<div class="we-recognition-header">';
  html += '<h3>' + Utils.escapeHtml(phaseName) + '</h3>';
  html += '<p class="we-recognition-instructions">Review the unadjusted trial balance below. For each account that needs an adjusting entry, click the flag icon. Then select the adjustment type and reason.</p>';
  html += '</div>';

  /* Trial balance table with flags */
  html += '<div class="we-recognition-tb">';
  html += '<table class="we-tb-table">';
  html += '<thead><tr><th></th><th>Account</th><th class="we-tb-debit">Debit</th><th class="we-tb-credit">Credit</th><th>Adjustment Type</th><th>Reason</th></tr></thead>';
  html += '<tbody>';

  tb.forEach(function (row, idx) {
    var account = row.account;
    var isSignal = signals.some(function (s) { return s.account === account; });
    html += '<tr class="we-recog-row" id="we-recog-row-' + idx + '" data-account="' + Utils.escapeHtml(account) + '" data-is-signal="' + isSignal + '">';
    html += '<td class="we-flag-cell"><button class="we-flag-btn" id="we-flag-' + idx + '" data-idx="' + idx + '" aria-label="Flag ' + Utils.escapeHtml(account) + ' for adjustment">&#9873;</button></td>';
    html += '<td class="we-tb-account">' + Utils.escapeHtml(account) + '</td>';
    var dr = row.debit || 0;
    var cr = row.credit || 0;
    html += '<td class="we-tb-debit">' + (dr > 0 ? Utils.formatCurrency(dr) : '') + '</td>';
    html += '<td class="we-tb-credit">' + (cr > 0 ? Utils.formatCurrency(cr) : '') + '</td>';
    html += '<td class="we-recog-type"><select class="we-recog-select" id="we-recog-type-' + idx + '" disabled aria-label="Adjustment type for ' + Utils.escapeHtml(account) + '"><option value="">—</option>';
    html += '<option value="asset_to_expense">Asset → Expense</option>';
    html += '<option value="liability_to_revenue">Liability → Revenue</option>';
    html += '<option value="accrued_expense">Accrued Expense</option>';
    html += '<option value="depreciation">Depreciation</option>';
    html += '</select></td>';
    html += '<td class="we-recog-reason"><select class="we-recog-select" id="we-recog-reason-' + idx + '" disabled aria-label="Reason for adjusting ' + Utils.escapeHtml(account) + '"><option value="">—</option></select></td>';
    html += '</tr>';
  });

  html += '</tbody>';
  html += '</table>';
  html += '</div>';

  /* Check button */
  html += '<div class="we-recognition-actions">';
  html += '<button class="btn btn-success" id="we-recog-check-btn">Check Recognition</button>';
  html += '</div>';

  /* Feedback area */
  html += '<div class="we-recognition-feedback" id="we-recog-feedback"></div>';

  html += '</div>';

  container.innerHTML = html;

  /* Wire up flag buttons */
  tb.forEach(function (row, idx) {
    var flagBtn = document.getElementById("we-flag-" + idx);
    if (flagBtn) {
      flagBtn.addEventListener("click", function () {
        var isFlagged = flagBtn.classList.contains("flagged");
        var typeSelect = document.getElementById("we-recog-type-" + idx);
        var reasonSelect = document.getElementById("we-recog-reason-" + idx);
        var rowEl = document.getElementById("we-recog-row-" + idx);

        if (isFlagged) {
          /* Unflag */
          flagBtn.classList.remove("flagged");
          flagBtn.setAttribute("aria-label", "Flag " + row.account + " for adjustment");
          if (typeSelect) { typeSelect.disabled = true; typeSelect.value = ""; }
          if (reasonSelect) { reasonSelect.disabled = true; reasonSelect.innerHTML = '<option value="">—</option>'; }
          if (rowEl) { rowEl.classList.remove("flagged"); }
        } else {
          /* Flag */
          flagBtn.classList.add("flagged");
          if (typeSelect) { typeSelect.disabled = false; }
          if (reasonSelect) { reasonSelect.disabled = false; }
          if (rowEl) { rowEl.classList.add("flagged"); }

          /* Populate reason options based on selected type */
          if (typeSelect) {
            typeSelect.addEventListener("change", function () {
              WorkedExamples.populateReasonOptions(idx, typeSelect.value, signals);
            });
          }
        }
      });
    }
  });

  /* Wire up check button */
  var checkBtn = document.getElementById("we-recog-check-btn");
  if (checkBtn) {
    checkBtn.addEventListener("click", function () {
      WorkedExamples.checkRecognition();
    });
  }
};

/* Populate reason dropdown based on adjustment type */
WorkedExamples.populateReasonOptions = function (idx, typeValue, signals) {
  var reasonSelect = document.getElementById("we-recog-reason-" + idx);
  if (!reasonSelect) { return; }

  /* Find matching signal for this account and type */
  var tb = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex].meta.trial_balance || [];
  var account = tb[idx] ? tb[idx].account : "";

  reasonSelect.innerHTML = '<option value="">— Select Reason —</option>';

  /* Offer all signal reasons as options (student must pick the right one) */
  signals.forEach(function (s) {
    var opt = document.createElement("option");
    opt.value = s.reason;
    opt.textContent = s.reason;
    reasonSelect.appendChild(opt);
  });
};

/* Check the student's recognition answers */
WorkedExamples.checkRecognition = function () {
  var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
  if (!phase || !phase.meta) { return; }

  var tb = phase.meta.trial_balance || [];
  var signals = phase.meta.signals || [];
  var signalAccounts = signals.map(function (s) { return s.account; });

  var studentFlags = [];
  var correctFlags = 0;
  var wrongFlags = 0;
  var missedFlags = 0;
  var typeCorrect = 0;
  var typeWrong = 0;
  var reasonCorrect = 0;
  var reasonWrong = 0;

  var feedbackHtml = '<div class="we-recog-feedback-content">';
  var allCorrect = true;

  tb.forEach(function (row, idx) {
    var flagBtn = document.getElementById("we-flag-" + idx);
    var typeSelect = document.getElementById("we-recog-type-" + idx);
    var reasonSelect = document.getElementById("we-recog-reason-" + idx);
    var isFlagged = flagBtn && flagBtn.classList.contains("flagged");
    var isSignal = signalAccounts.indexOf(row.account) !== -1;
    var signal = signals.filter(function (s) { return s.account === row.account; })[0];

    if (isFlagged && isSignal) {
      /* Correctly flagged */
      correctFlags++;
      var typeMatch = typeSelect && typeSelect.value === signal.adjustment_type;
      var reasonMatch = reasonSelect && reasonSelect.value === signal.reason;

      if (typeMatch) { typeCorrect++; } else { typeWrong++; allCorrect = false; }
      if (reasonMatch) { reasonCorrect++; } else { reasonWrong++; allCorrect = false; }

      feedbackHtml += '<div class="we-recog-fb-row correct">';
      feedbackHtml += '<strong>&#10003; ' + Utils.escapeHtml(row.account) + ' — correctly flagged</strong>';
      if (!typeMatch) { feedbackHtml += '<div class="fb-err">&#10007; Adjustment type: you selected "' + Utils.escapeHtml(typeSelect ? typeSelect.value : '') + '", should be "' + Utils.escapeHtml(signal.type_label) + '"</div>'; }
      if (!reasonMatch) { feedbackHtml += '<div class="fb-err">&#10007; Reason: you selected the wrong reason. Correct: ' + Utils.escapeHtml(signal.reason) + '</div>'; }
      if (typeMatch && reasonMatch) { feedbackHtml += '<div class="fb-ok">Type and reason both correct!</div>'; }
      feedbackHtml += '</div>';
    } else if (isFlagged && !isSignal) {
      /* Incorrectly flagged */
      wrongFlags++;
      allCorrect = false;
      feedbackHtml += '<div class="we-recog-fb-row incorrect">';
      feedbackHtml += '<strong>&#10007; ' + Utils.escapeHtml(row.account) + ' — does NOT need adjustment</strong>';
      feedbackHtml += '<div class="fb-err">This account balance is already correct. No adjusting entry needed.</div>';
      feedbackHtml += '</div>';
    } else if (!isFlagged && isSignal) {
      /* Missed a signal */
      missedFlags++;
      allCorrect = false;
      feedbackHtml += '<div class="we-recog-fb-row incorrect">';
      feedbackHtml += '<strong>&#10007; ' + Utils.escapeHtml(row.account) + ' — MISSED! This account needs adjustment</strong>';
      feedbackHtml += '<div class="fb-err">Type: ' + Utils.escapeHtml(signal.type_label) + ' — ' + Utils.escapeHtml(signal.reason) + '</div>';
      feedbackHtml += '<div class="fb-hint">Hint: ' + Utils.escapeHtml(signal.hint) + '</div>';
      feedbackHtml += '</div>';
    }
  });

  /* Score summary */
  var totalSignals = signals.length;
  feedbackHtml = '<div class="we-recog-score"><strong>Recognition Score: ' + correctFlags + '/' + totalSignals + ' accounts correctly flagged</strong>' +
    (wrongFlags > 0 ? ' &middot; ' + wrongFlags + ' false alarm' + (wrongFlags > 1 ? 's' : '') : '') +
    (missedFlags > 0 ? ' &middot; ' + missedFlags + ' missed' : '') +
    (typeCorrect + reasonCorrect > 0 ? ' &middot; Type: ' + typeCorrect + '/' + totalSignals + ' &middot; Reason: ' + reasonCorrect + '/' + totalSignals : '') +
    '</div>' + feedbackHtml;

  if (allCorrect) {
    feedbackHtml = '<div class="we-recog-perfect"><strong>&#10003; Perfect! You identified all adjustments correctly.</strong></div>' + feedbackHtml;
    /* Launch celebration fireworks */
    if (typeof Celebration !== "undefined") {
      Celebration.celebrate();
    }
  }

  feedbackHtml += '</div>';

  var feedbackEl = document.getElementById("we-recog-feedback");
  if (feedbackEl) {
    feedbackEl.innerHTML = feedbackHtml;
    feedbackEl.classList.add("open");
  }

  /* Save progress */
  var scoreKey = WorkedExamples.state.currentPhaseIndex + "-recognition";
  WorkedExamples.state.scoreData[scoreKey] = { totalScore: { passed: allCorrect ? totalSignals : correctFlags, total: totalSignals } };
  WorkedExamples.saveProgress();

  /* If all correct, show proceed button */
  if (allCorrect) {
    var actionsEl = document.querySelector(".we-recognition-actions");
    if (actionsEl) {
      actionsEl.innerHTML += '<button class="btn btn-primary" id="we-recog-proceed-btn">Proceed to Adjusting Entries &rarr;</button>';
      var proceedBtn = document.getElementById("we-recog-proceed-btn");
      if (proceedBtn) {
        proceedBtn.addEventListener("click", function () {
          WorkedExamples.state.phaseComplete[WorkedExamples.state.currentPhaseIndex] = true;
          WorkedExamples.saveProgress();
          WorkedExamples.renderPhaseComplete();
        });
      }
    }
  }
};

/* --- Equation Analysis (Step 1) --- */
WorkedExamples.renderEquationAnalysis = function (tx, txIndex) {
  var el = document.getElementById("we-equation");
  if (!el) {
    return;
  }

  if (!tx || !tx.analysis || !tx.analysis.accounts_affected) {
    el.innerHTML = "";
    return;
  }

  var numAccounts = tx.analysis.accounts_affected.length;

  var html = "";
  html += '<div class="we-step" id="we-step1-' + txIndex + '">';
  html += '<div class="we-step-header">';
  html += '<span class="we-step-badge step1-badge">Step 1</span>';
  html += '<span class="we-step-title">Accounting Equation Analysis</span>';
  html += '<span class="we-step-status" id="we-step1-status-' + txIndex + '"></span>';
  html += '</div>';
  html += '<div class="we-step-body" id="we-step1-body-' + txIndex + '">';

  /* Generate account rows dynamically based on numAccounts */
  for (var i = 1; i <= numAccounts; i++) {
    html += '<div class="we-eq-account">';
    html += '<div class="we-eq-account-label">Account ' + i + '</div>';
    html += '<div class="we-eq-field">';
    html += '<label>Account</label>';
    html += '<select class="we-eq-select" id="we-eq-acc' + i + '-' + txIndex + '" aria-label="Select account ' + i + '">';
    html += '<option value="">-- Select Account --</option>';
    WorkedExamples.state.accounts.forEach(function (acc) {
      if (Utils.isUsedAccount(acc.name) && WorkedExamples.isAccountVisibleInPhase(acc.name)) {
        html += '<option value="' + Utils.escapeHtml(acc.name) + '">' + Utils.escapeHtml(acc.number + " \u2014 " + acc.name) + '</option>';
      }
    });
    html += '</select>';
    html += '</div>';
    html += '<div class="we-eq-field">';
    html += '<label>Category</label>';
    html += '<select class="we-eq-category" id="we-eq-cat' + i + '-' + txIndex + '" aria-label="Category for account ' + i + '">';
    html += '<option value="">-- Select --</option>';
    html += '<option value="Asset">Asset</option>';
    html += '<option value="Liability">Liability</option>';
    html += '<option value="Equity">Equity</option>';
    html += '<option value="Revenue">Revenue</option>';
    html += '<option value="Expense">Expense</option>';
    html += '</select>';
    html += '</div>';
    html += '<div class="we-eq-field">';
    html += '<label>Direction</label>';
    html += '<select class="we-eq-direction" id="we-eq-dir' + i + '-' + txIndex + '" aria-label="Direction for account ' + i + '">';
    html += '<option value="">-- Select --</option>';
    html += '<option value="increase">Increase</option>';
    html += '<option value="decrease">Decrease</option>';
    html += '</select>';
    html += '</div>';
    html += '<div class="we-eq-field">';
    html += '<label>Amount ($)</label>';
    html += '<input type="number" class="we-eq-amount" id="we-eq-amt' + i + '-' + txIndex + '" placeholder="0.00" min="0" step="0.01" aria-label="Amount for account ' + i + '">';
    html += '</div>';
    html += '</div>';
  }

  /* Equation visual (live) */
  html += '<div class="we-eq-visual-container" id="we-eq-visual-' + txIndex + '">';
  html += Utils.renderEquationVisual({ totalAssets: 0, totalLiabilities: 0, totalEquity: 0, isBalanced: true });
  html += '</div>';

  /* Continue button */
  html += '<button class="btn btn-primary we-continue-btn" id="we-continue-' + txIndex + '" disabled>Continue to Journal Entry</button>';

  html += '</div>'; /* step-body */
  html += '</div>'; /* step1 */

  el.innerHTML = html;

  /* Wire up equation inputs */
  WorkedExamples.wireEquationInputs(txIndex, numAccounts);
  WorkedExamples.wireContinueButton(txIndex);
};

/* --- Journal Entry (Step 2) --- */
WorkedExamples.renderJournal = function (tx, txIndex) {
  var el = document.getElementById("we-journal");
  if (!el) {
    return;
  }

  if (!tx || !tx.entries || tx.entries.length === 0) {
    el.innerHTML = "";
    return;
  }

  var numEntries = tx.entries.length;

  var html = "";
  html += '<div class="we-step we-step-locked" id="we-step2-' + txIndex + '">';
  html += '<div class="we-step-header">';
  html += '<span class="we-step-badge step2-badge">Step 2</span>';
  html += '<span class="we-step-title">Journal Entry</span>';
  html += '<span class="we-step-status" id="we-step2-status-' + txIndex + '"></span>';
  html += '</div>';
  html += '<div class="we-step-body" id="we-step2-body-' + txIndex + '" style="display:none">';

  /* Step 1 summary (collapsible) */
  html += '<div class="we-step1-summary" id="we-step1-summary-' + txIndex + '" style="display:none">';
  html += '<span class="we-step1-summary-text" id="we-step1-summary-text-' + txIndex + '"></span>';
  html += '<button class="we-edit-link" id="we-edit-step1-' + txIndex + '">Edit</button>';
  html += '</div>';

  /* Entry form — pre-populate correct number of rows */
  html += '<div class="we-entry-form" id="we-form-' + txIndex + '">';
  for (var i = 0; i < numEntries; i++) {
    html += '<div class="we-entry-row" id="we-row-' + txIndex + '-' + i + '">';
    html += '<select class="we-account-select" id="we-account-' + txIndex + '-' + i + '" aria-label="Select account for row ' + (i + 1) + '">';
    html += '<option value="">-- Select Account --</option>';
    WorkedExamples.state.accounts.forEach(function (acc) {
      if (Utils.isUsedAccount(acc.name) && WorkedExamples.isAccountVisibleInPhase(acc.name)) {
        html += '<option value="' + Utils.escapeHtml(acc.name) + '">' + Utils.escapeHtml(acc.number + " \u2014 " + acc.name) + '</option>';
      }
    });
    html += '</select>';
    html += '<input type="number" id="we-debit-' + txIndex + '-' + i + '" class="we-debit-input" placeholder="Debit $" min="0" step="0.01" aria-label="Debit amount">';
    html += '<input type="number" id="we-credit-' + txIndex + '-' + i + '" class="we-credit-input" placeholder="Credit $" min="0" step="0.01" aria-label="Credit amount">';
    html += '<button class="we-remove-btn" id="we-remove-' + txIndex + '-' + i + '" aria-label="Remove row" style="visibility:hidden">&times;</button>';
    html += '</div>';
  }
  html += '</div>';

  /* Add row button (hidden — we pre-populate the correct count) */
  html += '<button class="we-add-row-btn" id="we-add-' + txIndex + '" data-tx="' + txIndex + '" style="display:none">+ Add Row</button>';

  html += '</div>'; /* step-body */
  html += '</div>'; /* step2 */

  /* Feedback area */
  html += '<div class="we-feedback" id="we-feedback-' + txIndex + '"></div>';

  el.innerHTML = html;

  /* Wire up event handlers */
  WorkedExamples.wireEditButton(txIndex);
};

/* --- Equation Input Wiring --- */
WorkedExamples.wireEquationInputs = function (txIndex, numAccounts) {
  var inputs = [];
  for (var i = 1; i <= numAccounts; i++) {
    inputs.push("we-eq-acc" + i + "-" + txIndex);
    inputs.push("we-eq-cat" + i + "-" + txIndex);
    inputs.push("we-eq-dir" + i + "-" + txIndex);
    inputs.push("we-eq-amt" + i + "-" + txIndex);
  }

  var updateFn = function () {
    WorkedExamples.updateEquationVisual(txIndex);
    WorkedExamples.updateContinueButton(txIndex, numAccounts);
  };

  inputs.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", updateFn);
      el.addEventListener("input", updateFn);
    }
  });
};

/* Update the live equation visual */
WorkedExamples.updateEquationVisual = function (txIndex) {
  var accounts = WorkedExamples.collectEquationAccounts(txIndex);
  var totals = Utils.computeEquationTotals(accounts);
  var container = document.getElementById("we-eq-visual-" + txIndex);
  if (container) {
    container.innerHTML = Utils.renderEquationVisual(totals);
  }
};

/* Update the continue button enabled/disabled state */
WorkedExamples.updateContinueButton = function (txIndex, numAccounts) {
  var accounts = WorkedExamples.collectEquationAccounts(txIndex);
  var allFilled = accounts.length === numAccounts;
  if (allFilled) {
    for (var i = 0; i < accounts.length; i++) {
      if (!accounts[i].account || !accounts[i].type || !accounts[i].change || accounts[i].amount <= 0) {
        allFilled = false;
        break;
      }
    }
  }

  var btn = document.getElementById("we-continue-" + txIndex);
  if (btn) {
    btn.disabled = !allFilled;
  }
};

/* Collect equation analysis accounts from the form */
WorkedExamples.collectEquationAccounts = function (txIndex) {
  var accounts = [];
  var maxAccounts = 10; /* Safety limit */

  for (var i = 1; i <= maxAccounts; i++) {
    var accEl = document.getElementById("we-eq-acc" + i + "-" + txIndex);
    if (!accEl) {
      break; /* No more account rows */
    }
    var catEl = document.getElementById("we-eq-cat" + i + "-" + txIndex);
    var dirEl = document.getElementById("we-eq-dir" + i + "-" + txIndex);
    var amtEl = document.getElementById("we-eq-amt" + i + "-" + txIndex);

    var account = accEl ? accEl.value : "";
    var type = catEl ? catEl.value : "";
    var change = dirEl ? dirEl.value : "";
    var amount = amtEl ? parseFloat(amtEl.value) || 0 : 0;

    if (account) {
      accounts.push({
        account: account,
        type: type,
        change: change,
        amount: amount
      });
    }
  }

  return accounts;
};

/* Wire the continue button to lock Step 1 and unlock Step 2 */
WorkedExamples.wireContinueButton = function (txIndex) {
  var btn = document.getElementById("we-continue-" + txIndex);
  if (!btn) {
    return;
  }

  btn.addEventListener("click", function () {
    WorkedExamples.state.step1Complete[txIndex] = true;
    WorkedExamples.saveProgress();

    /* Show Step 1 summary */
    var accounts = WorkedExamples.collectEquationAccounts(txIndex);
    var summaryText = "Equation: " + accounts.map(function (a) {
      return a.account + " (" + a.type + ", " + a.change + ", $" + a.amount + ")";
    }).join("; ");

    var summaryEl = document.getElementById("we-step1-summary-" + txIndex);
    var summaryTextEl = document.getElementById("we-step1-summary-text-" + txIndex);
    if (summaryEl) { summaryEl.style.display = "block"; }
    if (summaryTextEl) { summaryTextEl.textContent = summaryText; }

    /* Collapse Step 1 body */
    var bodyEl = document.getElementById("we-step1-body-" + txIndex);
    if (bodyEl) { bodyEl.style.display = "none"; }

    /* Update Step 1 status */
    var statusEl = document.getElementById("we-step1-status-" + txIndex);
    if (statusEl) { statusEl.textContent = "\u2713 Complete"; statusEl.className = "we-step-status step-done"; }

    /* Unlock Step 2 */
    var step2El = document.getElementById("we-step2-" + txIndex);
    var step2Body = document.getElementById("we-step2-body-" + txIndex);
    if (step2El) { step2El.classList.remove("we-step-locked"); }
    if (step2Body) { step2Body.style.display = "block"; }

    /* Update Step 2 status */
    var status2El = document.getElementById("we-step2-status-" + txIndex);
    if (status2El) { status2El.textContent = "In Progress"; status2El.className = "we-step-status step-active"; }

    /* Re-render nav to enable the Check button */
    var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
    var total = (phase && phase.transactions) ? phase.transactions.length : 0;
    WorkedExamples.renderNav(WorkedExamples.state.currentTransactionIndex, total);
  });
};

/* Wire the Edit button to re-expand Step 1 */
WorkedExamples.wireEditButton = function (txIndex) {
  var btn = document.getElementById("we-edit-step1-" + txIndex);
  if (!btn) {
    return;
  }

  btn.addEventListener("click", function () {
    var bodyEl = document.getElementById("we-step1-body-" + txIndex);
    if (bodyEl) { bodyEl.style.display = "block"; }

    var summaryEl = document.getElementById("we-step1-summary-" + txIndex);
    if (summaryEl) { summaryEl.style.display = "none"; }

    WorkedExamples.state.step1Complete[txIndex] = false;

    var statusEl = document.getElementById("we-step1-status-" + txIndex);
    if (statusEl) { statusEl.textContent = "Editing"; statusEl.className = "we-step-status step-editing"; }

    var step2El = document.getElementById("we-step2-" + txIndex);
    var step2Body = document.getElementById("we-step2-body-" + txIndex);
    if (step2El) { step2El.classList.add("we-step-locked"); }
    if (step2Body) { step2Body.style.display = "none"; }

    var status2El = document.getElementById("we-step2-status-" + txIndex);
    if (status2El) { status2El.textContent = "Locked"; status2El.className = "we-step-status step-locked"; }

    var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
    var total = (phase && phase.transactions) ? phase.transactions.length : 0;
    WorkedExamples.renderNav(WorkedExamples.state.currentTransactionIndex, total);

    var feedbackEl = document.getElementById("we-feedback-" + txIndex);
    if (feedbackEl) {
      feedbackEl.className = "we-feedback";
      feedbackEl.innerHTML = "";
    }

    var explainEl = document.getElementById("we-explain");
    if (explainEl) {
      explainEl.innerHTML = "";
    }
  });
};

/* --- Answer Collection --- */
WorkedExamples.collectStudentEntries = function (txIndex) {
  var form = document.getElementById("we-form-" + txIndex);
  if (!form) {
    return [];
  }

  var rows = form.querySelectorAll(".we-entry-row");
  var entries = [];

  rows.forEach(function (row) {
    var select = row.querySelector(".we-account-select");
    var debitInput = row.querySelector(".we-debit-input");
    var creditInput = row.querySelector(".we-credit-input");

    var account = select ? select.value : "";
    var debit = debitInput ? parseFloat(debitInput.value) || 0 : 0;
    var credit = creditInput ? parseFloat(creditInput.value) || 0 : 0;

    if (!account) {
      return;
    }

    if (debit > 0) {
      entries.push({
        account: account,
        side: "debit",
        amount: debit
      });
    }
    if (credit > 0) {
      entries.push({
        account: account,
        side: "credit",
        amount: credit
      });
    }
  });

  return entries;
};

/* --- Checking --- */
WorkedExamples.checkCurrentTransaction = function () {
  var idx = WorkedExamples.state.currentTransactionIndex;
  var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
  if (!phase) {
    return;
  }

  var transactions = phase.transactions || [];
  var tx = transactions[idx];
  if (!tx) {
    return;
  }

  if (!WorkedExamples.state.step1Complete[idx]) {
    return;
  }

  var equationAccounts = WorkedExamples.collectEquationAccounts(idx);
  var journalEntries = WorkedExamples.collectStudentEntries(idx);
  var answerKey = tx;

  if (!answerKey.analysis || !answerKey.analysis.accounts_affected) {
    return;
  }

  var result = Checker.checkBothSteps({
    equationAccounts: equationAccounts,
    journalEntries: journalEntries
  }, answerKey);

  var scoreKey = WorkedExamples.state.currentPhaseIndex + "-" + idx;
  WorkedExamples.state.scoreData[scoreKey] = result;
  WorkedExamples.state.feedbackShown[idx] = true;
  WorkedExamples.saveProgress();

  /* Render feedback */
  WorkedExamples.renderFeedback(idx, result, tx.explanation || "");

  /* Update navigation */
  WorkedExamples.renderNav(idx, transactions.length);
};

/* Render feedback for a single transaction */
WorkedExamples.renderFeedback = function (txIndex, result, explanationText) {
  var feedbackEl = document.getElementById("we-feedback-" + txIndex);
  if (!feedbackEl) {
    return;
  }

  var allPassed = result.totalScore.passed === result.totalScore.total;
  feedbackEl.className = "we-feedback open " + (allPassed ? "correct" : "incorrect");

  var html = "";
  html += '<div class="we-feedback-header">';
  html += '<strong>' + (allPassed ? "\u2713 All checks passed!" : "\u2717 Some checks failed") + '</strong>';
  html += ' <span class="we-feedback-score">' + result.totalScore.passed + '/' + result.totalScore.total + '</span>';
  html += '</div>';

  /* Step 1 feedback */
  html += '<div class="we-feedback-step">';
  html += '<div class="we-feedback-step-title">Step 1: Equation Analysis</div>';
  html += '<ul>';
  result.equation.checks.forEach(function (check) {
    var icon = check.passed ? "\u2713" : "\u2717";
    var cls = check.passed ? "fb-ok" : "fb-err";
    html += '<li class="' + cls + '">' + icon + ' ' + Utils.escapeHtml(check.label) + (check.hint ? ': <span class="fb-hint">' + Utils.escapeHtml(check.hint) + '</span>' : "") + '</li>';
  });
  html += '</ul>';

  var totals = Utils.computeEquationTotals(WorkedExamples.collectEquationAccounts(txIndex));
  if (!totals.isBalanced) {
    html += '<div class="fb-err">\u26A0 Your equation does not balance. Left side: $' + Utils.formatAmount(totals.totalAssets) + ', Right side: $' + Utils.formatAmount(totals.totalLiabilities + totals.totalEquity) + '</div>';
  }
  html += '</div>';

  /* Step 2 feedback */
  html += '<div class="we-feedback-step">';
  html += '<div class="we-feedback-step-title">Step 2: Journal Entry</div>';
  html += '<ul>';
  result.journal.checks.forEach(function (check) {
    var icon = check.passed ? "\u2713" : "\u2717";
    var cls = check.passed ? "fb-ok" : "fb-err";
    html += '<li class="' + cls + '">' + icon + ' ' + Utils.escapeHtml(check.label) + (check.hint ? ': <span class="fb-hint">' + Utils.escapeHtml(check.hint) + '</span>' : "") + '</li>';
  });
  html += '</ul>';
  html += '</div>';

  /* STRICT mode: if all passed, show Next Transaction + Show Reasoning */
  if (allPassed) {
    html += '<div style="margin-top:0.5rem;display:flex;gap:0.5rem;flex-wrap:wrap">';
    html += '<button class="btn btn-primary" id="we-next-tx-btn-' + txIndex + '">Next Transaction \u2192</button>';
    html += '<button class="btn btn-secondary" id="we-show-reasoning-btn-' + txIndex + '">Show Reasoning</button>';
    html += '</div>';
  } else {
    /* Try Again button */
    html += '<button class="btn btn-secondary we-try-again-btn" id="we-try-again-' + txIndex + '">Try Again</button>';
  }

  feedbackEl.innerHTML = html;

  /* Wire Next Transaction button */
  var nextBtn = document.getElementById("we-next-tx-btn-" + txIndex);
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      var next = WorkedExamples.state.currentTransactionIndex + 1;
      var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
      if (phase && next < (phase.transactions || []).length) {
        WorkedExamples.renderTransaction(next);
      } else {
        WorkedExamples.renderPhaseComplete();
      }
      /* Re-render phase cards to update progress counter */
      WorkedExamples.renderPhaseCards();
      WorkedExamples.saveProgress();
    });
  }

  /* Wire Show Reasoning button */
  var reasonBtn = document.getElementById("we-show-reasoning-btn-" + txIndex);
  if (reasonBtn) {
    reasonBtn.addEventListener("click", function () {
      WorkedExamples.state.reasoningOpen = !WorkedExamples.state.reasoningOpen;
      if (WorkedExamples.state.reasoningOpen) {
        reasonBtn.textContent = "Hide Reasoning";
        WorkedExamples.renderExplanation(explanationText);
      } else {
        reasonBtn.textContent = "Show Reasoning";
        var explainEl = document.getElementById("we-explain");
        if (explainEl) {
          explainEl.innerHTML = "";
        }
      }
    });
  }

  /* Wire Try Again button */
  var tryAgainBtn = document.getElementById("we-try-again-" + txIndex);
  if (tryAgainBtn) {
    tryAgainBtn.addEventListener("click", function () {
      WorkedExamples.resetForRetry(txIndex);
    });
  }
};

/* Render the explanation */
WorkedExamples.renderExplanation = function (explanationText) {
  var el = document.getElementById("we-explain");
  if (!el) {
    return;
  }

  if (!explanationText) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML =
    '<div class="we-explain-content open" id="we-explain-content">' +
      '<h4 style="margin:0 0 0.3rem 0;font-family:var(--ui-font);font-size:0.85rem;color:var(--text-secondary)">Explanation</h4>' +
      '<p style="margin:0;font-size:0.9rem;line-height:1.5">' + explanationText + '</p>' +
    '</div>';
};

/* Reset a transaction for retry */
WorkedExamples.resetForRetry = function (txIndex) {
  var feedbackEl = document.getElementById("we-feedback-" + txIndex);
  if (feedbackEl) {
    feedbackEl.className = "we-feedback";
    feedbackEl.innerHTML = "";
  }

  var explainEl = document.getElementById("we-explain");
  if (explainEl) {
    explainEl.innerHTML = "";
  }

  var scoreKey = WorkedExamples.state.currentPhaseIndex + "-" + txIndex;
  WorkedExamples.state.scoreData[scoreKey] = null;
  WorkedExamples.state.feedbackShown[txIndex] = false;
  WorkedExamples.state.reasoningOpen = false;

  var bodyEl = document.getElementById("we-step1-body-" + txIndex);
  if (bodyEl) { bodyEl.style.display = "block"; }

  var summaryEl = document.getElementById("we-step1-summary-" + txIndex);
  if (summaryEl) { summaryEl.style.display = "none"; }

  WorkedExamples.state.step1Complete[txIndex] = false;

  var statusEl = document.getElementById("we-step1-status-" + txIndex);
  if (statusEl) { statusEl.textContent = "Editing"; statusEl.className = "we-step-status step-editing"; }

  var step2El = document.getElementById("we-step2-" + txIndex);
  var step2Body = document.getElementById("we-step2-body-" + txIndex);
  if (step2El) { step2El.classList.add("we-step-locked"); }
  if (step2Body) { step2Body.style.display = "none"; }

  var status2El = document.getElementById("we-step2-status-" + txIndex);
  if (status2El) { status2El.textContent = "Locked"; status2El.className = "we-step-status step-locked"; }

  var phase = WorkedExamples.state.phases[WorkedExamples.state.currentPhaseIndex];
  WorkedExamples.renderNav(WorkedExamples.state.currentTransactionIndex,
    (phase && phase.transactions) ? phase.transactions.length : 0);
};

/* --- Navigation --- */
WorkedExamples.renderNav = function (current, total) {
  var el = document.getElementById("we-nav");
  if (!el) {
    return;
  }

  var hasPrev = current > 0;
  var feedbackShown = WorkedExamples.state.feedbackShown[current];
  var step1Complete = WorkedExamples.state.step1Complete[current];
  var step2Unlocked = step1Complete && !WorkedExamples.state.step2Complete[current];

  el.innerHTML =
    '<div class="we-nav-row">' +
      '<button class="btn btn-secondary" id="we-prev-btn"' + (hasPrev ? "" : " disabled") + ' aria-label="Previous transaction">' +
        '\u2190 Previous' +
      '</button>' +
      '<button class="btn btn-success" id="we-check-btn"' + (step2Unlocked ? "" : " disabled") + ' aria-label="Check both steps">' +
        'Check Both Steps' +
      '</button>' +
    '</div>';

  var prevBtn = document.getElementById("we-prev-btn");
  var checkBtn = document.getElementById("we-check-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      if (WorkedExamples.state.currentTransactionIndex > 0) {
        WorkedExamples.renderTransaction(WorkedExamples.state.currentTransactionIndex - 1);
      }
    });
  }

  if (checkBtn) {
    checkBtn.addEventListener("click", function () {
      WorkedExamples.checkCurrentTransaction();
    });
  }
};

/* --- Phase Complete --- */
WorkedExamples.renderPhaseComplete = function () {
  var phaseIdx = WorkedExamples.state.currentPhaseIndex;
  var phase = WorkedExamples.state.phases[phaseIdx];
  if (!phase) {
    return;
  }

  var meta = phase.meta || {};
  var phaseName = meta.phase_name || ("Phase " + (phaseIdx + 1));

  /* Mark phase as complete */
  WorkedExamples.state.phaseComplete[phaseIdx] = true;
  WorkedExamples.saveProgress();

  /* Hide transaction view elements */
  var descEl = document.getElementById("we-description");
  var equationEl = document.getElementById("we-equation");
  var journalEl = document.getElementById("we-journal");
  var explainEl = document.getElementById("we-explain");
  var navEl = document.getElementById("we-nav");
  var progressEl = document.getElementById("we-progress");

  if (descEl) { descEl.textContent = ""; }
  if (equationEl) { equationEl.innerHTML = ""; }
  if (journalEl) { journalEl.innerHTML = ""; }
  if (explainEl) { explainEl.innerHTML = ""; }
  if (navEl) { navEl.innerHTML = ""; }
  if (progressEl) { progressEl.innerHTML = ""; }

  /* Update phase cards */
  WorkedExamples.renderPhaseCards();

  /* Show phase complete message */
  var summaryEl = document.getElementById("we-summary");
  if (!summaryEl) {
    return;
  }

  var isLastPhase = phaseIdx === WorkedExamples.state.phases.length - 1;
  var allComplete = WorkedExamples.state.phaseComplete.every(function (c) { return c; });

  var html = '<div class="card">';
  if (allComplete) {
    html += '<h2>\u2713 Exercise Complete!</h2>';
    html += '<p style="font-size:0.9rem;color:var(--text-secondary)">You have completed all three phases of the Dress Right Clothing Corp. accounting cycle exercise.</p>';
  } else {
    html += '<h2>\u2713 ' + Utils.escapeHtml(phaseName) + ' Complete!</h2>';
    html += '<p style="font-size:0.9rem;color:var(--text-secondary)">You have completed all transactions in this phase.</p>';
  }
  html += '</div>';

  /* Generate Trial Balance button */
  if (!WorkedExamples.state.trialBalanceShown[phaseIdx]) {
    html += '<div style="margin-top:1rem;text-align:center">';
    html += '<button class="btn btn-primary" id="we-gen-tb-btn">Generate Trial Balance</button>';
    html += '</div>';
  }

  /* Trial balance container */
  html += '<div id="we-tb-container" class="we-tb-container" style="margin-top:1rem"></div>';

  /* If not last phase, show button to go to next phase */
  if (!isLastPhase && !allComplete) {
    html += '<div style="margin-top:1rem;text-align:center">';
    html += '<button class="btn btn-primary" id="we-next-phase-btn">Proceed to ' + Utils.escapeHtml(WorkedExamples.state.phases[phaseIdx + 1].meta.phase_name) + ' \u2192</button>';
    html += '</div>';
  }

  summaryEl.innerHTML = html;
  summaryEl.classList.add("open");

  /* Wire Generate Trial Balance button */
  var genBtn = document.getElementById("we-gen-tb-btn");
  if (genBtn) {
    genBtn.addEventListener("click", function () {
      WorkedExamples.renderTrialBalance(phaseIdx);
      WorkedExamples.state.trialBalanceShown[phaseIdx] = true;
      genBtn.style.display = "none";
    });
  }

  /* Wire Next Phase button */
  var nextPhaseBtn = document.getElementById("we-next-phase-btn");
  if (nextPhaseBtn) {
    nextPhaseBtn.addEventListener("click", function () {
      WorkedExamples.loadPhase(phaseIdx + 1);
    });
  }
};

/* --- Trial Balance --- */
WorkedExamples.renderTrialBalance = function (phaseIdx) {
  var phase = WorkedExamples.state.phases[phaseIdx];
  if (!phase || !phase.meta || !phase.meta.trial_balance) {
    return;
  }

  var container = document.getElementById("we-tb-container");
  if (!container) {
    return;
  }

  var tbData = phase.meta.trial_balance;

  /* Filter to non-zero balance accounts */
  var nonZero = tbData.filter(function (row) {
    return (row.debit || 0) > 0 || (row.credit || 0) > 0;
  });

  /* Sort in chart-of-accounts order: Assets, Liabilities, Equity, Revenue, Expenses */
  var typeOrder = {
    "Asset": 1,
    "Asset (Contra)": 1,
    "Liability": 2,
    "Equity": 3,
    "Equity (Contra)": 3,
    "Equity (Temporary)": 3,
    "Revenue": 4,
    "Expense": 5
  };

  var typeColorClass = {
    "Asset": "eq-assets",
    "Asset (Contra)": "eq-assets",
    "Liability": "eq-liabilities",
    "Equity": "eq-equity",
    "Equity (Contra)": "eq-equity",
    "Equity (Temporary)": "eq-equity",
    "Revenue": "eq-equity",
    "Expense": "eq-assets"
  };

  nonZero.sort(function (a, b) {
    var aType = WorkedExamples.getAccountTypeFromName(a.account);
    var bType = WorkedExamples.getAccountTypeFromName(b.account);
    var aOrder = typeOrder[aType] || 99;
    var bOrder = typeOrder[bType] || 99;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return a.account.localeCompare(b.account);
  });

  /* Calculate totals */
  var totalDebits = 0;
  var totalCredits = 0;
  nonZero.forEach(function (row) {
    totalDebits += row.debit || 0;
    totalCredits += row.credit || 0;
  });
  var isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  var html = "";
  html += '<div class="we-tb-card card">';
  html += '<div class="we-tb-header" id="we-tb-header">';
  html += '<h3>Trial Balance &mdash; ' + Utils.escapeHtml(phase.meta.phase_name || ("Phase " + (phaseIdx + 1))) + '</h3>';
  html += '<button class="we-tb-toggle" id="we-tb-toggle">\u25BC Hide</button>';
  html += '</div>';
  html += '<div class="we-tb-body" id="we-tb-body">';
  html += '<table class="we-tb-table" role="table" aria-label="Trial balance">';
  html += '<thead><tr><th>Account</th><th class="amount-header term-debit">Debit</th><th class="amount-header term-credit">Credit</th></tr></thead>';
  html += '<tbody>';

  nonZero.forEach(function (row) {
    var accType = WorkedExamples.getAccountTypeFromName(row.account);
    var colorClass = typeColorClass[accType] || "";
    html += '<tr>' +
      '<td class="' + colorClass + '">' + Utils.escapeHtml(row.account) + '</td>' +
      '<td class="amount-cell number-debit">' + (row.debit > 0 ? Utils.formatAmount(row.debit) : "") + '</td>' +
      '<td class="amount-cell number-credit">' + (row.credit > 0 ? Utils.formatAmount(row.credit) : "") + '</td>' +
    '</tr>';
  });

  /* Totals row */
  html += '<tr class="we-tb-totals-row">' +
    '<td><strong>Totals</strong></td>' +
    '<td class="amount-cell number-debit"><strong>' + Utils.formatAmount(totalDebits) + '</strong></td>' +
    '<td class="amount-cell number-credit"><strong>' + Utils.formatAmount(totalCredits) + '</strong></td>' +
  '</tr>';

  html += '</tbody></table>';

  /* Balance check */
  html += '<div class="we-tb-balance-check ' + (isBalanced ? "tb-balanced" : "tb-unbalanced") + '">';
  html += isBalanced ? "\u2713 Trial balance is balanced (Debits = Credits)" : "\u26A0 Trial balance is NOT balanced";
  html += '</div>';

  html += '</div>'; /* tb-body */
  html += '</div>'; /* tb-card */

  container.innerHTML = html;

  /* Wire toggle */
  var toggleBtn = document.getElementById("we-tb-toggle");
  var tbBody = document.getElementById("we-tb-body");
  if (toggleBtn && tbBody) {
    toggleBtn.addEventListener("click", function () {
      if (tbBody.style.display === "none") {
        tbBody.style.display = "block";
        toggleBtn.textContent = "\u25BC Hide";
      } else {
        tbBody.style.display = "none";
        toggleBtn.textContent = "\u25B6 Show";
      }
    });
  }

  /* Celebrate if the trial balance is balanced */
  if (isBalanced && typeof Celebration !== "undefined") {
    Celebration.celebrate();
  }
};

/* Get account type from name using the account map */
WorkedExamples.getAccountTypeFromName = function (accountName) {
  var acc = WorkedExamples.state.accountMap[accountName];
  if (acc) {
    return acc.type;
  }
  /* Fallback: try to determine from name */
  return "Equity";
};

/* --- Account Filtering --- */
/* Returns true if an account should be shown in the current phase */
WorkedExamples.isAccountVisibleInPhase = function (accountName) {
  var phaseIdx = WorkedExamples.state.currentPhaseIndex;
  /* Income Summary only appears in Phase 3 (closing) */
  if (accountName === "Income Summary" && phaseIdx !== 2) {
    return false;
  }
  return true;
};
