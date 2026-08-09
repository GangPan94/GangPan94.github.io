/* ============================================================ */
/*  ACCT 321 — Accounting Cycle Practice Tool                   */
/*  random-practice.js — Full 6-phase exercise cycle (Beta)     */
/*  Uses ExerciseEngine.generateExerciseSet() for data          */
/*  Mirrors worked-examples.js visual/interaction patterns       */
/* ============================================================ */

var RandomPractice = RandomPractice || {};

/* --- State --- */
RandomPractice.state = {
  accounts: [], accountMap: {},
  exerciseSet: null,
  phaseKeys: ["daily-ops", "recognition", "adjusting", "flow", "closing", "bs-flow"],
  currentPhaseIndex: 0,
  currentTxIndex: 0,
  phaseComplete: [false, false, false, false, false, false],
  step1Complete: {}, step2Complete: {}, feedbackShown: {}, scoreData: {},
  recognitionAnswers: {},
  trialBalanceShown: [false, false, false, false, false, false],
  checked: false,
  timerStarted: false, timerStopped: false,
  timerStartTs: 0, timerElapsed: 0, timerInterval: null
};

/* --- Progress Save/Restore (localStorage) --- */
RandomPractice.PROGRESS_KEY = "acct321_ex_progress";

RandomPractice.saveProgress = function () {
  try {
    var data = {
      exerciseSet: RandomPractice.state.exerciseSet,
      currentPhaseIndex: RandomPractice.state.currentPhaseIndex,
      currentTxIndex: RandomPractice.state.currentTxIndex,
      phaseComplete: RandomPractice.state.phaseComplete,
      step1Complete: RandomPractice.state.step1Complete,
      step2Complete: RandomPractice.state.step2Complete,
      feedbackShown: RandomPractice.state.feedbackShown,
      scoreData: RandomPractice.state.scoreData,
      recognitionAnswers: RandomPractice.state.recognitionAnswers,
      timerStarted: RandomPractice.state.timerStarted,
      timerStopped: RandomPractice.state.timerStopped,
      timerStartTs: RandomPractice.state.timerStartTs,
      timerElapsed: RandomPractice.state.timerElapsed
    };
    localStorage.setItem(RandomPractice.PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    /* localStorage may be unavailable or quota exceeded — fail silently */
  }
};

RandomPractice.loadProgress = function () {
  try {
    var raw = localStorage.getItem(RandomPractice.PROGRESS_KEY);
    if (!raw) { return false; }
    var data = JSON.parse(raw);
    if (!data.exerciseSet) { return false; }

    RandomPractice.state.exerciseSet = data.exerciseSet;
    RandomPractice.state.currentPhaseIndex = data.currentPhaseIndex || 0;
    RandomPractice.state.currentTxIndex = data.currentTxIndex || 0;
    var savedPC = data.phaseComplete || [false, false, false, false, false, false];
    while (savedPC.length < 6) { savedPC.push(false); }
    RandomPractice.state.phaseComplete = savedPC;
    RandomPractice.state.step1Complete = data.step1Complete || {};
    RandomPractice.state.step2Complete = data.step2Complete || {};
    RandomPractice.state.feedbackShown = data.feedbackShown || {};
    RandomPractice.state.scoreData = data.scoreData || {};
    RandomPractice.state.recognitionAnswers = data.recognitionAnswers || {};
    RandomPractice.state.timerStarted = !!data.timerStarted;
    RandomPractice.state.timerStopped = !!data.timerStopped;
    RandomPractice.state.timerStartTs = data.timerStartTs || 0;
    RandomPractice.state.timerElapsed = data.timerElapsed || 0;
    return true;
  } catch (e) {
    return false;
  }
};

RandomPractice.clearProgress = function () {
  try {
    localStorage.removeItem(RandomPractice.PROGRESS_KEY);
  } catch (e) {
    /* fail silently */
  }
};

/* --- Cheat: Auto-complete all transactions in a phase --- */
/* Marks every transaction in the given phase as fully correct (step1 + step2 done, perfect score) */
RandomPractice.autoCompletePhase = function (phaseIdx) {
  var phase = RandomPractice.state.exerciseSet.phases[phaseIdx];
  if (!phase) { return; }

  if (phase.transactions && phase.transactions.length > 0) {
    phase.transactions.forEach(function (tx, txIdx) {
      var key = phaseIdx + "-" + txIdx;
      RandomPractice.state.step1Complete[key] = true;
      RandomPractice.state.step2Complete[key] = true;
      RandomPractice.state.feedbackShown[key] = true;
      RandomPractice.state.scoreData[key] = {
        totalScore: { passed: 10, total: 10 },
        equation: { score: { passed: 5, total: 5 }, checks: [] },
        journal: { score: { passed: 5, total: 5 }, checks: [] }
      };
    });
  }

  /* For recognition phase, auto-fill all signals as flagged with correct types */
  if (phase.meta && phase.meta.signals) {
    phase.meta.signals.forEach(function (signal) {
      RandomPractice.state.recognitionAnswers[signal.account] = {
        type: signal.adjustment_type,
        idx: -1
      };
    });
  }

  RandomPractice.state.phaseComplete[phaseIdx] = true;
};

/* --- Cheat: Show all correct answers for a phase (instructor review) --- */
/* Renders a summary card listing every transaction and its correct journal entry */
RandomPractice.showPhaseAnswers = function (phaseIdx) {
  var phase = RandomPractice.state.exerciseSet.phases[phaseIdx];
  if (!phase || !phase.transactions || phase.transactions.length === 0) { return; }

  var contentArea = document.getElementById("ex-content-area");
  if (!contentArea) { return; }

  var html = '<div class="we-content">';
  html += '<div class="card" style="padding:1.5rem;">';
  html += '<h2 style="margin-bottom:1rem;">Correct Answers — ' + Utils.escapeHtml(phase.phase_name) + '</h2>';

  phase.transactions.forEach(function (tx, idx) {
    html += '<div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border-color);">';
    html += '<strong>Entry ' + (idx + 1) + ':</strong> ' + Utils.escapeHtml(tx.description);
    html += '<table class="rp-answer-table" style="margin-top:0.4rem;"><thead><tr><th>Account</th><th>Debit</th><th>Credit</th></tr></thead><tbody>';
    var totalDr = 0, totalCr = 0;
    tx.entries.forEach(function (entry) {
      html += '<tr>';
      html += '<td>' + Utils.escapeHtml(entry.account) + '</td>';
      if (entry.side === "debit") {
        html += '<td class="amount-cell number-debit">' + Utils.formatAmount(entry.amount) + '</td>';
        html += '<td class="amount-cell"></td>';
        totalDr += entry.amount;
      } else {
        html += '<td class="amount-cell"></td>';
        html += '<td class="amount-cell number-credit">' + Utils.formatAmount(entry.amount) + '</td>';
        totalCr += entry.amount;
      }
      html += '</tr>';
    });
    html += '<tr style="border-top:2px solid var(--border-color);font-weight:bold;"><td>Totals</td><td class="amount-cell number-debit">' + Utils.formatAmount(totalDr) + '</td><td class="amount-cell number-credit">' + Utils.formatAmount(totalCr) + '</td></tr>';
    html += '</tbody></table>';
    html += '</div>';
  });

  html += '<button class="btn btn-primary" id="ex-back-to-phase" style="margin-top:0.5rem;">Back to Exercise</button>';
  html += '</div></div>';

  contentArea.innerHTML = html;

  var backBtn = document.getElementById("ex-back-to-phase");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      RandomPractice.loadPhase(RandomPractice.state.currentPhaseIndex);
    });
  }
};

/* --- Initialization --- */
RandomPractice.init = function () {
  var container = document.getElementById("random-practice-content");
  if (!container) { return; }

  Utils.loadChartOfAccounts().then(function (data) {
    RandomPractice.state.accounts = Utils.sortAccounts(data.accounts || []);
    RandomPractice.state.accountMap = Utils.buildAccountMap(RandomPractice.state.accounts);
    RandomPractice.buildShell();

    /* Attempt to restore saved exercise set from localStorage */
    var restored = RandomPractice.loadProgress();
    if (restored && RandomPractice.state.exerciseSet) {
      RandomPractice.renderContextStrip();
      RandomPractice.renderPhaseCards();
      /* Resume timer (continues from saved elapsed time) */
      if (RandomPractice.state.timerStopped) {
        /* Cycle completed — show frozen final time */
        var timerEl = document.getElementById("ex-cycle-timer");
        var labelEl = document.getElementById("ex-cycle-timer-label");
        if (timerEl) { timerEl.textContent = RandomPractice.timerFormat(RandomPractice.state.timerElapsed); timerEl.classList.add("stopped"); }
        if (labelEl) { labelEl.textContent = "Final Time"; }
      } else if (RandomPractice.state.timerStarted) {
        RandomPractice.timerStart();
      }
      /* Jump to saved phase and transaction */
      RandomPractice.loadPhase(RandomPractice.state.currentPhaseIndex, true);
      RandomPractice.renderPhaseCards();
    }
  }).catch(function (err) {
    container.innerHTML = '<div class="card"><p>Error loading chart of accounts: ' + err.message + '</p></div>';
  });
};

/* --- Shell: Controls + Context + Phase Cards + Content --- */
RandomPractice.buildShell = function () {
  var container = document.getElementById("random-practice-content");
  if (!container) { return; }

  container.innerHTML =
    '<div class="rp-controls card">' +
      '<button class="btn btn-primary" id="rp-new-btn">Generate New Set</button>' +
    '</div>' +
    '<div id="ex-context-area"></div>' +
    '<div id="ex-phase-cards-area"></div>' +
    '<div id="ex-content-area">' +
      '<div class="rp-empty"><p>Click <strong>Generate New Set</strong> to start a full accounting cycle exercise.</p></div>' +
    '</div>' +
    '<div id="ex-reset-area"></div>';

  var newBtn = document.getElementById("rp-new-btn");
  if (newBtn) {
    newBtn.addEventListener("click", function () { RandomPractice.generateNewSet(); });
  }
};

/* --- Generate New Exercise Set --- */
RandomPractice.generateNewSet = function () {
  RandomPractice.clearProgress();
  var set = ExerciseEngine.generateExerciseSet({
    accountMap: RandomPractice.state.accountMap
  });

  RandomPractice.state.exerciseSet = set;
  RandomPractice.state.currentPhaseIndex = 0;
  RandomPractice.state.currentTxIndex = 0;
  RandomPractice.state.phaseComplete = [false, false, false, false, false, false];
  RandomPractice.state.step1Complete = {};
  RandomPractice.state.step2Complete = {};
  RandomPractice.state.feedbackShown = {};
  RandomPractice.state.scoreData = {};
  RandomPractice.state.recognitionAnswers = {};
  RandomPractice.state.trialBalanceShown = [false, false, false, false, false, false];
  RandomPractice.state.checked = false;

  RandomPractice.timerReset();
  RandomPractice.timerStart();
  RandomPractice.renderContextStrip();
  RandomPractice.renderPhaseCards();
  RandomPractice.loadPhase(0);
  RandomPractice.saveProgress();
};

/* --- Context Strip --- */
RandomPractice.renderContextStrip = function () {
  var area = document.getElementById("ex-context-area");
  if (!area || !RandomPractice.state.exerciseSet) { return; }
  var meta = RandomPractice.state.exerciseSet.meta;

  area.innerHTML = '<div class="ex-context">' +
    '<span class="ex-context-title">' + Utils.escapeHtml(meta.company_name) + '</span>' +
    '<span class="ex-context-badge entity-corp">' + Utils.escapeHtml(meta.entity_type) + '</span>' +
    '<span class="ex-context-meta">Beginning Cash: ' + Utils.formatCurrency(meta.beginning_cash) + ' · Beginning Equity: ' + Utils.formatCurrency(meta.beginning_equity) + '</span>' +
    '</div>';
};

/* --- Phase Cards --- */
RandomPractice.renderPhaseCards = function () {
  var area = document.getElementById("ex-phase-cards-area");
  if (!area || !RandomPractice.state.exerciseSet) { return; }

  var phases = RandomPractice.state.exerciseSet.phases;
  var html = '<div class="ex-phase-cards we-phase-cards">';

  phases.forEach(function (phase, idx) {
    var classes = "we-phase-card";
    if (idx === RandomPractice.state.currentPhaseIndex) { classes += " active"; }
    if (RandomPractice.state.phaseComplete[idx]) { classes += " complete"; }
    if (idx > RandomPractice.state.currentPhaseIndex && !RandomPractice.state.phaseComplete[idx]) { classes += " locked"; }

    var txCount = "";
    if (phase.transactions && phase.transactions.length > 0) {
      txCount = phase.transactions.length + " entries";
    } else if (phase.meta && phase.meta.signals) {
      txCount = phase.meta.signals.length + " adjustments";
    } else if (phase.meta && phase.meta.income_statement) {
      txCount = "Flow";
    } else if (phase.meta && phase.meta.balance_sheet) {
      txCount = "Flow";
    }

    html += '<div class="' + classes + '" data-phase="' + idx + '" role="button" tabindex="0">';
    html += '<span class="we-phase-num">' + phase.phase + '</span>';
    html += '<span class="we-phase-card-name">' + Utils.escapeHtml(phase.phase_name) + '</span>';
    html += '<span class="we-phase-card-count">' + txCount + '</span>';
    if (RandomPractice.state.phaseComplete[idx]) {
      html += '<span class="we-phase-check-icon">&#10003;</span>';
    } else if (idx > RandomPractice.state.currentPhaseIndex) {
      html += '<span class="we-phase-lock-icon">&#128274;</span>';
    }
    html += '</div>';
  });

  html += '</div>';

  /* Timer */
  html += '<div class="we-cycle-timer-wrap">';
  html += '<span class="we-cycle-timer-label" id="ex-cycle-timer-label">Cycle Timer</span>';
  html += '<span class="we-cycle-timer" id="ex-cycle-timer">00:00</span>';
  html += '</div>';

  /* Reset button */
  html += '<div class="ex-reset-area">';
  html += '<button class="btn" id="rp-reset-btn">Reset All</button>';
  html += '</div>';

  area.innerHTML = html;

  /* Wire up phase card clicks */
  area.querySelectorAll(".we-phase-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var idx = parseInt(this.getAttribute("data-phase"), 10);
      if (idx <= RandomPractice.state.currentPhaseIndex || RandomPractice.state.phaseComplete[idx - 1]) {
        RandomPractice.state.currentPhaseIndex = idx;
        RandomPractice.state.currentTxIndex = 0;
        RandomPractice.renderPhaseCards();
        RandomPractice.loadPhase(idx);
      }
    });
  });

  var resetBtn = document.getElementById("rp-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      RandomPractice.clearProgress();
      RandomPractice.generateNewSet();
    });
  }
};

/* --- Load Phase --- */
RandomPractice.loadPhase = function (index, preserveTxIndex) {
  var contentArea = document.getElementById("ex-content-area");
  if (!contentArea || !RandomPractice.state.exerciseSet) { return; }

  var phase = RandomPractice.state.exerciseSet.phases[index];
  if (!phase) { return; }

  /* Clear content */
  contentArea.innerHTML = "";

  /* Determine the transaction index to render */
  var txIndex = 0;
  if (preserveTxIndex) {
    txIndex = RandomPractice.state.currentTxIndex || 0;
  } else {
    RandomPractice.state.currentTxIndex = 0;
  }

  /* Determine phase type */
  if (phase.transactions && phase.transactions.length > 0) {
    /* Interactive transaction phase (1, 2, or 3) */
    /* Don't render a transaction that's already been completed — jump to first incomplete or last */
    if (preserveTxIndex && txIndex >= phase.transactions.length) {
      txIndex = phase.transactions.length - 1;
    }
    RandomPractice.renderTransaction(txIndex);
  } else if (phase.meta && phase.meta.signals) {
    /* Phase 1.5: Recognition */
    RandomPractice.renderRecognitionPhase();
  } else if (phase.meta && phase.meta.income_statement) {
    /* Phase 2.5: Financial Statement Flow */
    RandomPractice.renderFlowAnimation();
  } else if (phase.meta && phase.meta.balance_sheet) {
    /* Phase 3.5: Balance Sheet Flow */
    RandomPractice.renderBalanceSheetFlow();
  }
};

/* ─── Transaction Rendering (Phases 1, 2, 3) ──────────────── */

RandomPractice.renderTransaction = function (txIndex) {
  var contentArea = document.getElementById("ex-content-area");
  if (!contentArea || !RandomPractice.state.exerciseSet) { return; }

  var phase = RandomPractice.state.exerciseSet.phases[RandomPractice.state.currentPhaseIndex];
  var tx = phase.transactions[txIndex];
  if (!tx) { return; }

  RandomPractice.state.currentTxIndex = txIndex;
  RandomPractice.saveProgress();
  var total = phase.transactions.length;
  var accountsInPlay = RandomPractice.state.exerciseSet.accountsInPlay[phase.key] || [];

  /* Build account options */
  var accountOptions = '<option value="">-- Select Account --</option>';
  RandomPractice.state.accounts.forEach(function (acc) {
    if (accountsInPlay.indexOf(acc.name) !== -1 || Utils.isUsedAccount(acc.name)) {
      accountOptions += '<option value="' + Utils.escapeHtml(acc.name) + '">' + Utils.escapeHtml(acc.number + " — " + acc.name) + '</option>';
    }
  });

  var html = '<div class="we-content" id="ex-content-inner">';

  /* Progress dots */
  html += RandomPractice.renderProgress(txIndex, total);

  /* Description */
  html += '<div class="we-description">' + Utils.escapeHtml(tx.description) + '</div>';

  /* Phase 2 reminder */
  if (phase.key === "adjusting") {
    html += '<div class="ex-reminder">Reminder: Adjusting entries never involve the Cash account.</div>';
  }

  /* Step 1: Equation Analysis */
  html += '<div class="we-step" id="ex-step1-' + txIndex + '">';
  html += '<div class="we-step-header">';
  html += '<span class="we-step-badge step1-badge">Step 1</span>';
  html += '<span class="we-step-title">Accounting Equation Analysis</span>';
  html += '<span class="we-step-status" id="ex-step1-status-' + txIndex + '"></span>';
  html += '</div>';
  html += '<div class="we-step-body" id="ex-step1-body-' + txIndex + '">';

  /* Account rows (start with 2) */
  for (var i = 1; i <= 2; i++) {
    html += RandomPractice.renderEquationRow(txIndex, i, accountOptions);
  }

  /* Equation visual */
  html += '<div class="we-eq-visual-container" id="ex-eq-visual-' + txIndex + '">';
  html += Utils.renderEquationVisual({ totalAssets: 0, totalLiabilities: 0, totalEquity: 0, isBalanced: true });
  html += '</div>';

  /* Add account button */
  html += '<button class="rp-add-eq-btn" id="ex-add-eq-' + txIndex + '" data-tx="' + txIndex + '">+ Add Account</button>';

  /* Continue button */
  html += '<button class="btn btn-primary we-continue-btn" id="ex-continue-' + txIndex + '" disabled>Continue to Journal Entry</button>';

  html += '</div>'; /* step-body */
  html += '</div>'; /* step1 */

  /* Step 2: Journal Entry */
  html += '<div class="we-step we-step-locked" id="ex-step2-' + txIndex + '">';
  html += '<div class="we-step-header">';
  html += '<span class="we-step-badge step2-badge">Step 2</span>';
  html += '<span class="we-step-title">Journal Entry</span>';
  html += '<span class="we-step-status" id="ex-step2-status-' + txIndex + '"></span>';
  html += '</div>';
  html += '<div class="we-step-body" id="ex-step2-body-' + txIndex + '" style="display:none">';

  /* Step 1 summary */
  html += '<div class="we-step1-summary" id="ex-step1-summary-' + txIndex + '" style="display:none">';
  html += '<span class="we-step1-summary-text" id="ex-step1-summary-text-' + txIndex + '"></span>';
  html += '<button class="we-edit-link" id="ex-edit-step1-' + txIndex + '">Edit</button>';
  html += '</div>';

  /* Entry form */
  html += '<div class="we-entry-form" id="ex-form-' + txIndex + '">';
  html += RandomPractice.renderEntryRow(txIndex, 0, accountOptions);
  html += '</div>';

  /* Add row button */
  html += '<button class="we-add-row-btn" id="ex-add-row-' + txIndex + '" data-tx="' + txIndex + '">+ Add Row</button>';

  html += '</div>'; /* step-body */
  html += '</div>'; /* step2 */

  /* Feedback */
  html += '<div class="we-feedback" id="ex-feedback-' + txIndex + '"></div>';

  /* Navigation */
  html += RandomPractice.renderNav(txIndex, total);

  html += '</div>'; /* we-content */

  contentArea.innerHTML = html;

  /* Wire up */
  RandomPractice.wireEquationInputs(txIndex);
  RandomPractice.wireContinueButton(txIndex);
  RandomPractice.wireEditButton(txIndex);

  var addEqBtn = document.getElementById("ex-add-eq-" + txIndex);
  if (addEqBtn) {
    addEqBtn.addEventListener("click", function () { RandomPractice.addEquationRow(txIndex); });
  }

  var addRowBtn = document.getElementById("ex-add-row-" + txIndex);
  if (addRowBtn) {
    addRowBtn.addEventListener("click", function () { RandomPractice.addEntryRow(txIndex); });
  }

  var checkBtn = document.getElementById("ex-check-btn-" + txIndex);
  if (checkBtn) {
    checkBtn.addEventListener("click", function () { RandomPractice.checkCurrentTransaction(txIndex); });
  }

  var prevBtn = document.getElementById("ex-prev-btn-" + txIndex);
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      if (txIndex > 0) { RandomPractice.renderTransaction(txIndex - 1); }
    });
  }
};

/* Render progress dots */
RandomPractice.renderProgress = function (current, total) {
  var html = '<div class="we-progress"><div class="we-progress-dots">';
  for (var i = 0; i < total; i++) {
    var cls = "we-progress-dot";
    if (i === current) { cls += " active"; }
    if (i < current) { cls += " complete"; }
    html += '<span class="' + cls + '"></span>';
  }
  html += '</div>';
  html += '<span class="we-progress-text">Entry ' + (current + 1) + ' of ' + total + '</span>';
  html += '</div>';
  return html;
};

/* Render navigation */
RandomPractice.renderNav = function (txIndex, total) {
  var html = '<div class="we-nav-row"><div class="we-nav">';
  if (txIndex > 0) {
    html += '<button class="btn" id="ex-prev-btn-' + txIndex + '">&larr; Previous</button>';
  }
  html += '<button class="btn btn-success" id="ex-check-btn-' + txIndex + '" disabled>Check Both Steps</button>';
  html += '</div></div>';
  return html;
};

/* Render an equation analysis row */
RandomPractice.renderEquationRow = function (txIndex, rowNum, accountOptions) {
  var html = '<div class="we-eq-account" id="ex-eq-row-' + txIndex + '-' + rowNum + '">';
  html += '<div class="we-eq-field">';
  html += '<label>Account</label>';
  html += '<select class="we-eq-select" id="ex-eq-acc-' + txIndex + '-' + rowNum + '" aria-label="Select account ' + rowNum + '">';
  html += accountOptions;
  html += '</select>';
  html += '</div>';
  html += '<div class="we-eq-field">';
  html += '<label>Category</label>';
  html += '<select class="we-eq-category" id="ex-eq-cat-' + txIndex + '-' + rowNum + '" aria-label="Category for account ' + rowNum + '">';
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
  html += '<select class="we-eq-direction" id="ex-eq-dir-' + txIndex + '-' + rowNum + '" aria-label="Direction for account ' + rowNum + '">';
  html += '<option value="">-- Select --</option>';
  html += '<option value="increase">Increase</option>';
  html += '<option value="decrease">Decrease</option>';
  html += '</select>';
  html += '</div>';
  html += '<div class="we-eq-field">';
  html += '<label>Amount ($)</label>';
  html += '<input type="number" class="we-eq-amount" id="ex-eq-amt-' + txIndex + '-' + rowNum + '" placeholder="0.00" min="0" step="0.01" aria-label="Amount for account ' + rowNum + '">';
  html += '</div>';
  html += '</div>';
  return html;
};

/* Render a journal entry row */
RandomPractice.renderEntryRow = function (txIndex, rowNum, accountOptions) {
  var html = '<div class="we-entry-row" id="ex-row-' + txIndex + '-' + rowNum + '">';
  html += '<select class="we-account-select" id="ex-account-' + txIndex + '-' + rowNum + '" aria-label="Select account">';
  html += accountOptions;
  html += '</select>';
  html += '<input type="number" id="ex-debit-' + txIndex + '-' + rowNum + '" class="we-debit-input number-debit" placeholder="Debit $" min="0" step="0.01" aria-label="Debit amount">';
  html += '<input type="number" id="ex-credit-' + txIndex + '-' + rowNum + '" class="we-credit-input number-credit" placeholder="Credit $" min="0" step="0.01" aria-label="Credit amount">';
  html += '<button class="we-remove-btn" id="ex-remove-' + txIndex + '-' + rowNum + '" aria-label="Remove row" style="visibility:' + (rowNum === 0 ? 'hidden' : 'visible') + '">&times;</button>';
  html += '</div>';
  return html;
};

/* --- Equation Input Wiring --- */
RandomPractice.wireEquationInputs = function (txIndex) {
  var container = document.getElementById("ex-step1-body-" + txIndex);
  if (!container) { return; }
  var inputs = container.querySelectorAll("select, input");
  inputs.forEach(function (el) {
    el.addEventListener("change", function () {
      RandomPractice.updateEquationVisual(txIndex);
      RandomPractice.updateContinueButton(txIndex);
    });
    el.addEventListener("input", function () {
      RandomPractice.updateEquationVisual(txIndex);
      RandomPractice.updateContinueButton(txIndex);
    });
  });
};

RandomPractice.updateEquationVisual = function (txIndex) {
  var accounts = RandomPractice.collectEquationAccounts(txIndex);
  var totals = Utils.computeEquationTotals(accounts);
  var container = document.getElementById("ex-eq-visual-" + txIndex);
  if (container) { container.innerHTML = Utils.renderEquationVisual(totals); }
};

RandomPractice.updateContinueButton = function (txIndex) {
  var accounts = RandomPractice.collectEquationAccounts(txIndex);
  var allFilled = accounts.length >= 2 &&
    accounts.every(function (a) { return a.account && a.type && a.change && a.amount > 0; });
  var totals = Utils.computeEquationTotals(accounts);
  var balanced = totals.isBalanced;

  var btn = document.getElementById("ex-continue-" + txIndex);
  if (btn) { btn.disabled = !(allFilled && balanced); }
};

RandomPractice.collectEquationAccounts = function (txIndex) {
  var accounts = [];
  var container = document.getElementById("ex-step1-body-" + txIndex);
  if (!container) { return accounts; }
  var rows = container.querySelectorAll(".we-eq-account");
  rows.forEach(function (row) {
    var accEl = row.querySelector(".we-eq-select");
    var catEl = row.querySelector(".we-eq-category");
    var dirEl = row.querySelector(".we-eq-direction");
    var amtEl = row.querySelector(".we-eq-amount");
    var account = accEl ? accEl.value : "";
    var type = catEl ? catEl.value : "";
    var change = dirEl ? dirEl.value : "";
    var amount = amtEl ? parseFloat(amtEl.value) || 0 : 0;
    if (account) { accounts.push({ account: account, type: type, change: change, amount: amount }); }
  });
  return accounts;
};

/* Add equation row */
RandomPractice.addEquationRow = function (txIndex) {
  var container = document.getElementById("ex-step1-body-" + txIndex);
  if (!container) { return; }
  var existingRows = container.querySelectorAll(".we-eq-account");
  var rowNum = existingRows.length + 1;

  var accountOptions = '<option value="">-- Select Account --</option>';
  var accountsInPlay = RandomPractice.state.exerciseSet.accountsInPlay[RandomPractice.state.exerciseSet.phases[RandomPractice.state.currentPhaseIndex].key] || [];
  RandomPractice.state.accounts.forEach(function (acc) {
    if (accountsInPlay.indexOf(acc.name) !== -1 || Utils.isUsedAccount(acc.name)) {
      accountOptions += '<option value="' + Utils.escapeHtml(acc.name) + '">' + Utils.escapeHtml(acc.number + " — " + acc.name) + '</option>';
    }
  });

  var div = document.createElement("div");
  div.innerHTML = RandomPractice.renderEquationRow(txIndex, rowNum, accountOptions);
  var newRow = div.firstChild;

  /* Insert before the add button */
  var addBtn = document.getElementById("ex-add-eq-" + txIndex);
  if (addBtn) {
    container.insertBefore(newRow, addBtn);
  } else {
    container.appendChild(newRow);
  }

  /* Wire up new row */
  var inputs = newRow.querySelectorAll("select, input");
  inputs.forEach(function (el) {
    el.addEventListener("change", function () {
      RandomPractice.updateEquationVisual(txIndex);
      RandomPractice.updateContinueButton(txIndex);
    });
    el.addEventListener("input", function () {
      RandomPractice.updateEquationVisual(txIndex);
      RandomPractice.updateContinueButton(txIndex);
    });
  });
};

/* Wire continue button */
RandomPractice.wireContinueButton = function (txIndex) {
  var btn = document.getElementById("ex-continue-" + txIndex);
  if (!btn) { return; }
  btn.addEventListener("click", function () {
    RandomPractice.state.step1Complete[txIndex] = true;
    RandomPractice.saveProgress();
    var accounts = RandomPractice.collectEquationAccounts(txIndex);
    var summaryText = "Equation: " + accounts.map(function (a) {
      return a.account + " (" + a.type + ", " + a.change + ", $" + a.amount + ")";
    }).join("; ");
    var summaryEl = document.getElementById("ex-step1-summary-" + txIndex);
    var summaryTextEl = document.getElementById("ex-step1-summary-text-" + txIndex);
    if (summaryEl) { summaryEl.style.display = "block"; }
    if (summaryTextEl) { summaryTextEl.textContent = summaryText; }
    var bodyEl = document.getElementById("ex-step1-body-" + txIndex);
    if (bodyEl) { bodyEl.style.display = "none"; }
    var statusEl = document.getElementById("ex-step1-status-" + txIndex);
    if (statusEl) { statusEl.textContent = "\u2713 Complete"; statusEl.className = "we-step-status step-done"; }
    var step2El = document.getElementById("ex-step2-" + txIndex);
    var step2Body = document.getElementById("ex-step2-body-" + txIndex);
    if (step2El) { step2El.classList.remove("we-step-locked"); }
    if (step2Body) { step2Body.style.display = "block"; }
    var status2El = document.getElementById("ex-step2-status-" + txIndex);
    if (status2El) { status2El.textContent = "In Progress"; status2El.className = "we-step-status step-active"; }
    /* Enable check button */
    var checkBtn = document.getElementById("ex-check-btn-" + txIndex);
    if (checkBtn) { checkBtn.disabled = false; }
  });
};

/* Wire edit button */
RandomPractice.wireEditButton = function (txIndex) {
  var btn = document.getElementById("ex-edit-step1-" + txIndex);
  if (!btn) { return; }
  btn.addEventListener("click", function () {
    var bodyEl = document.getElementById("ex-step1-body-" + txIndex);
    if (bodyEl) { bodyEl.style.display = "block"; }
    var summaryEl = document.getElementById("ex-step1-summary-" + txIndex);
    if (summaryEl) { summaryEl.style.display = "none"; }
    RandomPractice.state.step1Complete[txIndex] = false;
    var statusEl = document.getElementById("ex-step1-status-" + txIndex);
    if (statusEl) { statusEl.textContent = "Editing"; statusEl.className = "we-step-status step-editing"; }
    var step2El = document.getElementById("ex-step2-" + txIndex);
    var step2Body = document.getElementById("ex-step2-body-" + txIndex);
    if (step2El) { step2El.classList.add("we-step-locked"); }
    if (step2Body) { step2Body.style.display = "none"; }
    var status2El = document.getElementById("ex-step2-status-" + txIndex);
    if (status2El) { status2El.textContent = "Locked"; status2El.className = "we-step-status step-locked"; }
    var checkBtn = document.getElementById("ex-check-btn-" + txIndex);
    if (checkBtn) { checkBtn.disabled = true; }
    var feedbackEl = document.getElementById("ex-feedback-" + txIndex);
    if (feedbackEl) { feedbackEl.className = "we-feedback"; feedbackEl.innerHTML = ""; }
  });
};

/* Add entry row */
RandomPractice.addEntryRow = function (txIndex) {
  var form = document.getElementById("ex-form-" + txIndex);
  if (!form) { return; }
  var rows = form.querySelectorAll(".we-entry-row");
  var rowNum = rows.length;

  var accountOptions = '<option value="">-- Select Account --</option>';
  var accountsInPlay = RandomPractice.state.exerciseSet.accountsInPlay[RandomPractice.state.exerciseSet.phases[RandomPractice.state.currentPhaseIndex].key] || [];
  RandomPractice.state.accounts.forEach(function (acc) {
    if (accountsInPlay.indexOf(acc.name) !== -1 || Utils.isUsedAccount(acc.name)) {
      accountOptions += '<option value="' + Utils.escapeHtml(acc.name) + '">' + Utils.escapeHtml(acc.number + " — " + acc.name) + '</option>';
    }
  });

  var div = document.createElement("div");
  div.innerHTML = RandomPractice.renderEntryRow(txIndex, rowNum, accountOptions);
  var newRow = div.firstChild;
  form.appendChild(newRow);

  /* Show remove button on first row too if more than 1 row */
  if (rowNum > 0) {
    var firstRemove = document.getElementById("ex-remove-" + txIndex + "-0");
    if (firstRemove) { firstRemove.style.visibility = "visible"; }
  }

  /* Wire remove button */
  var removeBtn = document.getElementById("ex-remove-" + txIndex + "-" + rowNum);
  if (removeBtn) {
    removeBtn.addEventListener("click", function () {
      newRow.remove();
      if (form.querySelectorAll(".we-entry-row").length <= 1) {
        var firstRm = document.getElementById("ex-remove-" + txIndex + "-0");
        if (firstRm) { firstRm.style.visibility = "hidden"; }
      }
    });
  }
};

/* Collect student entries */
RandomPractice.collectStudentEntries = function (txIndex) {
  var entries = [];
  var form = document.getElementById("ex-form-" + txIndex);
  if (!form) { return entries; }
  var rows = form.querySelectorAll(".we-entry-row");
  rows.forEach(function (row) {
    var accEl = row.querySelector(".we-account-select");
    var drEl = row.querySelector(".we-debit-input");
    var crEl = row.querySelector(".we-credit-input");
    var account = accEl ? accEl.value : "";
    var debit = drEl ? parseFloat(drEl.value) || 0 : 0;
    var credit = crEl ? parseFloat(crEl.value) || 0 : 0;
    if (account && (debit > 0 || credit > 0)) {
      if (debit > 0) {
        entries.push({ account: account, side: "debit", amount: debit });
      } else {
        entries.push({ account: account, side: "credit", amount: credit });
      }
    }
  });
  return entries;
};

/* Check current transaction */
RandomPractice.checkCurrentTransaction = function (txIndex) {
  var phase = RandomPractice.state.exerciseSet.phases[RandomPractice.state.currentPhaseIndex];
  var tx = phase.transactions[txIndex];
  if (!tx) { return; }

  var equationAccounts = RandomPractice.collectEquationAccounts(txIndex);
  var journalEntries = RandomPractice.collectStudentEntries(txIndex);

  var result = Checker.checkBothSteps(
    { equationAccounts: equationAccounts, journalEntries: journalEntries },
    tx
  );

  RandomPractice.state.scoreData[RandomPractice.state.currentPhaseIndex + "-" + txIndex] = result;
  RandomPractice.renderFeedback(txIndex, result, tx.explanation);
  RandomPractice.saveProgress();

  /* If all passed, show Next button */
  if (result.totalScore.passed === result.totalScore.total) {
    RandomPractice.state.step2Complete[txIndex] = true;
    var feedbackEl = document.getElementById("ex-feedback-" + txIndex);
    if (feedbackEl) {
      var nextBtn = document.createElement("button");
      nextBtn.className = "btn btn-primary";
      nextBtn.textContent = txIndex < phase.transactions.length - 1 ? "Next Entry \u2192" : "Complete Phase \u2192";
      nextBtn.style.marginTop = "0.5rem";
      nextBtn.addEventListener("click", function () {
        if (txIndex < phase.transactions.length - 1) {
          RandomPractice.renderTransaction(txIndex + 1);
        } else {
          RandomPractice.renderPhaseComplete();
        }
      });
      feedbackEl.appendChild(nextBtn);

      /* Show reasoning button */
      if (tx.explanation) {
        var reasonBtn = document.createElement("button");
        reasonBtn.className = "btn";
        reasonBtn.textContent = "Show Reasoning";
        reasonBtn.style.marginLeft = "0.5rem";
        reasonBtn.style.marginTop = "0.5rem";
        reasonBtn.addEventListener("click", function () {
          RandomPractice.renderExplanation(txIndex, tx.explanation);
        });
        feedbackEl.appendChild(reasonBtn);
      }
    }
  }
};

/* Render feedback */
RandomPractice.renderFeedback = function (txIndex, result, explanation) {
  var el = document.getElementById("ex-feedback-" + txIndex);
  if (!el) { return; }

  var phase = RandomPractice.state.exerciseSet.phases[RandomPractice.state.currentPhaseIndex];
  var tx = phase.transactions[txIndex];

  var allPassed = result.totalScore.passed === result.totalScore.total;
  el.className = "we-feedback open " + (allPassed ? "correct" : "incorrect");

  var html = '<div class="we-feedback-header">';
  html += '<span class="we-feedback-score">' + result.totalScore.passed + '/' + result.totalScore.total + '</span>';
  html += allPassed ? ' <span class="fb-ok">\u2713 Correct!</span>' : ' <span class="fb-err">\u2717 Not quite right</span>';
  html += '</div>';

  /* Equation checks */
  html += '<div class="we-feedback-step">';
  html += '<strong>Step 1 — Equation Analysis:</strong> ' + result.equation.score.passed + '/' + result.equation.score.total;
  html += '<ul>';
  result.equation.checks.forEach(function (check) {
    var cls = check.passed ? "fb-ok" : "fb-err";
    html += '<li class="' + cls + '">' + (check.passed ? "\u2713" : "\u2717") + ' ' + Utils.escapeHtml(check.label);
    if (!check.passed && check.hint) { html += ' <span class="fb-hint">' + Utils.escapeHtml(check.hint) + '</span>'; }
    html += '</li>';
  });
  html += '</ul>';
  html += '</div>';

  /* Journal checks */
  html += '<div class="we-feedback-step">';
  html += '<strong>Step 2 — Journal Entry:</strong> ' + result.journal.score.passed + '/' + result.journal.score.total;
  html += '<ul>';
  result.journal.checks.forEach(function (check) {
    var cls = check.passed ? "fb-ok" : "fb-err";
    html += '<li class="' + cls + '">' + (check.passed ? "\u2713" : "\u2717") + ' ' + Utils.escapeHtml(check.label);
    if (!check.passed && check.hint) { html += ' <span class="fb-hint">' + Utils.escapeHtml(check.hint) + '</span>'; }
    html += '</li>';
  });
  html += '</ul>';
  html += '</div>';

  /* Correct answer table */
  html += '<div class="rp-answer-reveal open" style="margin-top:0.5rem;">';
  html += '<h4>Correct Answer:</h4>';
  html += '<table class="rp-answer-table"><thead><tr><th>Account</th><th>Debit</th><th>Credit</th></tr></thead><tbody>';
  tx.entries.forEach(function (entry) {
    html += '<tr>';
    html += '<td>' + Utils.escapeHtml(entry.account) + '</td>';
    if (entry.side === "debit") {
      html += '<td class="amount-cell number-debit">' + Utils.formatAmount(entry.amount) + '</td>';
      html += '<td class="amount-cell"></td>';
    } else {
      html += '<td class="amount-cell"></td>';
      html += '<td class="amount-cell number-credit">' + Utils.formatAmount(entry.amount) + '</td>';
    }
    html += '</tr>';
  });
  var totalDr = 0, totalCr = 0;
  tx.entries.forEach(function (e) {
    if (e.side === "debit") totalDr += e.amount; else totalCr += e.amount;
  });
  html += '<tr style="border-top:2px solid var(--border-color);font-weight:bold;"><td>Totals</td><td class="amount-cell number-debit">' + Utils.formatAmount(totalDr) + '</td><td class="amount-cell number-credit">' + Utils.formatAmount(totalCr) + '</td></tr>';
  html += '</tbody></table>';
  html += '</div>';

  if (!allPassed) {
    html += '<button class="btn we-try-again-btn" id="ex-try-again-' + txIndex + '">Try Again</button>';
  }

  el.innerHTML = html;

  var tryBtn = document.getElementById("ex-try-again-" + txIndex);
  if (tryBtn) {
    tryBtn.addEventListener("click", function () {
      el.className = "we-feedback";
      el.innerHTML = "";
    });
  }
};

/* Render explanation */
RandomPractice.renderExplanation = function (txIndex, text) {
  var el = document.getElementById("ex-feedback-" + txIndex);
  if (!el) { return; }
  var explainDiv = document.createElement("div");
  explainDiv.className = "we-explain-content open";
  explainDiv.style.marginTop = "0.5rem";
  explainDiv.innerHTML = '<strong>Reasoning:</strong> ' + Utils.escapeHtml(text);
  el.appendChild(explainDiv);
};

/* --- Phase Complete --- */
RandomPractice.renderPhaseComplete = function () {
  var phaseIdx = RandomPractice.state.currentPhaseIndex;
  var phase = RandomPractice.state.exerciseSet.phases[phaseIdx];
  var contentArea = document.getElementById("ex-content-area");
  if (!contentArea) { return; }

  RandomPractice.state.phaseComplete[phaseIdx] = true;
  RandomPractice.renderPhaseCards();
  RandomPractice.saveProgress();

  var html = '<div class="we-content">';
  html += '<div class="card" style="text-align:center;padding:2rem;">';
  html += '<h2>\u2713 Phase Complete!</h2>';
  html += '<p>' + Utils.escapeHtml(phase.phase_name) + ' — all entries correct.</p>';

  /* Auto-render trial balance */
  if (phase.meta && phase.meta.trial_balance) {
    html += RandomPractice.renderTrialBalanceCard(phase.meta.trial_balance, phaseIdx);
  }

  /* Closing recap for Phase 3 */
  if (phase.key === "closing" && phase.meta.closing_summary) {
    html += RandomPractice.renderClosingRecap(phase.meta.closing_summary);
  }

  /* Next phase button */
  var nextIdx = phaseIdx + 1;
  if (nextIdx < RandomPractice.state.exerciseSet.phases.length) {
    var nextPhase = RandomPractice.state.exerciseSet.phases[nextIdx];
    html += '<button class="btn btn-primary" id="ex-proceed-btn" style="margin-top:1rem;">Proceed to ' + Utils.escapeHtml(nextPhase.phase_name) + ' \u2192</button>';
  }

  html += '</div>';
  html += '</div>';

  contentArea.innerHTML = html;

  var proceedBtn = document.getElementById("ex-proceed-btn");
  if (proceedBtn) {
    proceedBtn.addEventListener("click", function () {
      RandomPractice.state.currentPhaseIndex = nextIdx;
      RandomPractice.state.currentTxIndex = 0;
      RandomPractice.renderPhaseCards();
      RandomPractice.loadPhase(nextIdx);
    });
  }

  /* Small celebration for recognition phase */
  if (phase.key === "recognition") {
    if (typeof Celebration !== "undefined" && Celebration.celebrate) { Celebration.celebrate(); }
  }
};

/* --- Trial Balance Card --- */
RandomPractice.renderTrialBalanceCard = function (tbRows, phaseIdx) {
  var totalDr = 0, totalCr = 0;
  tbRows.forEach(function (r) { totalDr += r.debit; totalCr += r.credit; });
  var balanced = totalDr === totalCr;

  var tbLabel = "Trial Balance";
  if (phaseIdx === 0) { tbLabel = "Unadjusted Trial Balance"; }
  else if (phaseIdx === 2) { tbLabel = "Adjusted Trial Balance"; }
  else if (phaseIdx === 4) { tbLabel = "Post-Closing Trial Balance"; }

  var html = '<div class="we-tb-card ex-tb-auto">';
  html += '<div class="we-tb-header">';
  html += '<button class="we-tb-toggle">' + tbLabel + '</button>';
  html += '<span class="ex-tb-auto-badge">Auto-computed</span>';
  html += '</div>';
  html += '<table class="we-tb-table"><thead><tr><th>Account</th><th class="amount-header">Debit</th><th class="amount-header">Credit</th></tr></thead><tbody>';
  tbRows.forEach(function (r) {
    if (r.debit === 0 && r.credit === 0) { return; }
    html += '<tr>';
    html += '<td>' + Utils.escapeHtml(r.account) + '</td>';
    html += '<td class="amount-cell number-debit">' + Utils.formatAmount(r.debit) + '</td>';
    html += '<td class="amount-cell number-credit">' + Utils.formatAmount(r.credit) + '</td>';
    html += '</tr>';
  });
  html += '<tr class="we-tb-totals-row">';
  html += '<td><strong>Totals</strong></td>';
  html += '<td class="amount-cell number-debit"><strong>' + Utils.formatAmount(totalDr) + '</strong></td>';
  html += '<td class="amount-cell number-credit"><strong>' + Utils.formatAmount(totalCr) + '</strong></td>';
  html += '</tr>';
  html += '</tbody></table>';
  html += '<div class="we-tb-balance-check ' + (balanced ? "tb-balanced" : "tb-unbalanced") + '">';
  if (balanced) {
    html += '\u2713 Balanced \u2014 Total Debits (' + Utils.formatCurrency(totalDr) + ') = Total Credits (' + Utils.formatCurrency(totalCr) + ')';
  } else {
    html += '\u2717 Not Balanced \u2014 Total Debits (' + Utils.formatCurrency(totalDr) + ') \u2260 Total Credits (' + Utils.formatCurrency(totalCr) + ')';
  }
  html += '</div>';
  html += '</div>';
  return html;
};

/* --- Closing Recap Card --- */
RandomPractice.renderClosingRecap = function (summary) {
  var html = '<div class="ex-closing-recap">';
  html += '<h3>Closing Summary (via Income Summary)</h3>';
  html += '<table>';
  html += '<tr><th>Step</th><th>Amount</th></tr>';
  html += '<tr><td>Close Revenues \u2192 Income Summary</td><td class="amount-cell">' + Utils.formatCurrency(summary.revenue_total) + '</td></tr>';
  html += '<tr><td>Close Expenses \u2192 Income Summary</td><td class="amount-cell">(' + Utils.formatCurrency(summary.expense_total) + ')</td></tr>';
  html += '<tr class="ex-is-line"><td><strong>Net Income</strong></td><td class="amount-cell"><strong>' + Utils.formatCurrency(summary.net_income) + '</strong></td></tr>';
  html += '<tr><td>Close Income Summary \u2192 Retained Earnings</td><td class="amount-cell">' + Utils.formatCurrency(summary.net_income) + '</td></tr>';
  html += '<tr><td>Close Dividends \u2192 Retained Earnings</td><td class="amount-cell">(' + Utils.formatCurrency(summary.dividends) + ')</td></tr>';
  html += '<tr class="ex-net-income"><td><strong>Retained Earnings Change</strong></td><td class="amount-cell"><strong>' + Utils.formatCurrency(summary.retained_earnings_change) + '</strong></td></tr>';
  html += '</table>';
  html += '</div>';
  return html;
};

/* ─── Phase 1.5: Adjustment Recognition ──────────────────── */

RandomPractice.renderRecognitionPhase = function () {
  var contentArea = document.getElementById("ex-content-area");
  if (!contentArea || !RandomPractice.state.exerciseSet) { return; }

  var phase = RandomPractice.state.exerciseSet.phases[1];
  var tb = phase.meta.trial_balance;
  var signals = phase.meta.signals;

  var html = '<div class="we-content">';
  html += '<div class="we-description">Review the unadjusted trial balance below. For each account that needs an adjusting entry, click the flag icon. Then select the adjustment type.</div>';

  html += '<div class="we-recognition">';
  html += '<div class="we-recognition-tb">';
  html += '<table class="we-tb-table"><thead><tr><th></th><th>Account</th><th class="amount-header">Debit</th><th class="amount-header">Credit</th><th>Adjustment Type</th></tr></thead><tbody>';

  var totalDr = 0, totalCr = 0;
  tb.forEach(function (row, idx) {
    if (row.debit === 0 && row.credit === 0) { return; }
    totalDr += row.debit; totalCr += row.credit;
    var account = row.account;
    html += '<tr class="we-recog-row" id="ex-recog-row-' + idx + '" data-account="' + Utils.escapeHtml(account) + '">';
    html += '<td class="we-flag-cell"><button class="we-flag-btn" id="ex-flag-' + idx + '" data-idx="' + idx + '" data-account="' + Utils.escapeHtml(account) + '" aria-label="Flag ' + Utils.escapeHtml(account) + ' for adjustment">&#9873;</button></td>';
    html += '<td class="we-tb-account">' + Utils.escapeHtml(account) + '</td>';
    html += '<td class="amount-cell number-debit">' + (row.debit > 0 ? Utils.formatAmount(row.debit) : '') + '</td>';
    html += '<td class="amount-cell number-credit">' + (row.credit > 0 ? Utils.formatAmount(row.credit) : '') + '</td>';
    /* Type dropdown */
    html += '<td class="we-recog-type"><select class="we-recog-select" id="ex-recog-type-' + idx + '" disabled aria-label="Adjustment type for ' + Utils.escapeHtml(account) + '"><option value="">\u2014</option>';
    html += '<option value="asset_to_expense">Asset \u2192 Expense</option>';
    html += '<option value="liability_to_revenue">Liability \u2192 Revenue</option>';
    html += '<option value="accrued_expense">Accrued Expense</option>';
    html += '<option value="depreciation">Depreciation</option>';
    html += '</select></td>';
    html += '</tr>';
  });

  /* Totals row + balance check */
  var balanced = totalDr === totalCr;
  html += '<tr class="we-tb-totals-row">';
  html += '<td></td>';
  html += '<td><strong>Totals</strong></td>';
  html += '<td class="amount-cell number-debit"><strong>' + Utils.formatAmount(totalDr) + '</strong></td>';
  html += '<td class="amount-cell number-credit"><strong>' + Utils.formatAmount(totalCr) + '</strong></td>';
  html += '<td></td>';
  html += '</tr>';

  html += '</tbody></table>';
  html += '<div class="we-tb-balance-check ' + (balanced ? "tb-balanced" : "tb-unbalanced") + '">';
  if (balanced) {
    html += '\u2713 Balanced \u2014 Total Debits (' + Utils.formatCurrency(totalDr) + ') = Total Credits (' + Utils.formatCurrency(totalCr) + ')';
  } else {
    html += '\u2717 Not Balanced \u2014 Total Debits (' + Utils.formatCurrency(totalDr) + ') \u2260 Total Credits (' + Utils.formatCurrency(totalCr) + ')';
  }
  html += '</div>';
  html += '</div>';

  html += '<div class="we-recognition-actions">';
  html += '<button class="btn btn-success" id="ex-check-recog-btn">Check Recognition</button>';
  html += '</div>';

  html += '<div class="we-recognition-feedback" id="ex-recog-feedback"></div>';
  html += '</div>';
  html += '</div>';

  contentArea.innerHTML = html;

  /* Wire flag buttons */
  contentArea.querySelectorAll(".we-flag-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var idx = this.getAttribute("data-idx");
      var account = this.getAttribute("data-account");
      var row = document.getElementById("ex-recog-row-" + idx);
      var typeSelect = document.getElementById("ex-recog-type-" + idx);

      if (this.classList.contains("flagged")) {
        /* Unflag */
        this.classList.remove("flagged");
        if (row) { row.classList.remove("flagged"); }
        if (typeSelect) { typeSelect.disabled = true; typeSelect.value = ""; }
        delete RandomPractice.state.recognitionAnswers[account];
      } else {
        /* Flag */
        this.classList.add("flagged");
        if (row) { row.classList.add("flagged"); }
        if (typeSelect) { typeSelect.disabled = false; }
        RandomPractice.state.recognitionAnswers[account] = { type: "", idx: idx };

        /* Wire type change */
        if (typeSelect) {
          typeSelect.addEventListener("change", function () {
            if (RandomPractice.state.recognitionAnswers[account]) {
              RandomPractice.state.recognitionAnswers[account].type = typeSelect.value;
            }
          });
        }
      }
    });
  });

  var checkBtn = document.getElementById("ex-check-recog-btn");
  if (checkBtn) {
    checkBtn.addEventListener("click", function () { RandomPractice.checkRecognition(); });
  }
};

RandomPractice.checkRecognition = function () {
  var phase = RandomPractice.state.exerciseSet.phases[1];
  var signals = phase.meta.signals;
  var feedbackEl = document.getElementById("ex-recog-feedback");
  if (!feedbackEl) { return; }

  var flaggedAccounts = Object.keys(RandomPractice.state.recognitionAnswers);
  var signalAccounts = signals.map(function (s) { return s.account; });

  var correctFlags = 0, wrongFlags = 0, missedFlags = 0;
  var typeCorrect = 0, typeIncorrect = 0;

  /* Check each signal */
  signals.forEach(function (signal) {
    if (flaggedAccounts.indexOf(signal.account) !== -1) {
      correctFlags++;
      var answer = RandomPractice.state.recognitionAnswers[signal.account];
      if (answer && answer.type === signal.adjustment_type) {
        typeCorrect++;
      } else {
        typeIncorrect++;
      }
    } else {
      missedFlags++;
    }
  });

  /* Check wrong flags */
  flaggedAccounts.forEach(function (account) {
    if (signalAccounts.indexOf(account) === -1) { wrongFlags++; }
  });

  var perfect = (correctFlags === signals.length && wrongFlags === 0 && typeIncorrect === 0);

  var html = '<div class="we-recog-feedback-content">';
  html += '<div class="we-recog-score">Score: ' + correctFlags + '/' + signals.length + ' correct flags';

  if (perfect) {
    html += ' <span class="we-recog-perfect">\u2713 Perfect!</span>';
    html += '</div>';
    html += '<p>All accounts correctly identified with correct adjustment types.</p>';
  } else {
    html += '</div>';
    if (missedFlags > 0) { html += '<p class="fb-err">Missed ' + missedFlags + ' account(s) that need adjustment.</p>'; }
    if (wrongFlags > 0) { html += '<p class="fb-err">Flagged ' + wrongFlags + ' account(s) that do not need adjustment.</p>'; }
    if (typeIncorrect > 0) { html += '<p class="fb-err">Incorrect adjustment type for ' + typeIncorrect + ' account(s).</p>'; }
    html += '<button class="btn we-try-again-btn" id="ex-recog-try-again">Try Again</button>';
  }

  html += '</div>';
  feedbackEl.innerHTML = html;
  feedbackEl.className = "we-recognition-feedback open";

  if (perfect) {
    RandomPractice.state.phaseComplete[1] = true;
    RandomPractice.saveProgress();
    if (typeof Celebration !== "undefined" && Celebration.celebrate) { Celebration.celebrate(); }

    /* Add proceed button */
    var proceedBtn = document.createElement("button");
    proceedBtn.className = "btn btn-primary";
    proceedBtn.textContent = "Proceed to Adjusting Entries \u2192";
    proceedBtn.style.marginTop = "1rem";
    proceedBtn.addEventListener("click", function () {
      RandomPractice.state.currentPhaseIndex = 2;
      RandomPractice.state.currentTxIndex = 0;
      RandomPractice.renderPhaseCards();
      RandomPractice.loadPhase(2);
    });
    feedbackEl.appendChild(proceedBtn);
  }

  var tryBtn = document.getElementById("ex-recog-try-again");
  if (tryBtn) {
    tryBtn.addEventListener("click", function () {
      feedbackEl.className = "we-recognition-feedback";
      feedbackEl.innerHTML = "";
    });
  }
};

/* ─── Phase 2.5: Financial Statement Flow ────────────────── */

RandomPractice.renderFlowAnimation = function () {
  var contentArea = document.getElementById("ex-content-area");
  if (!contentArea || !RandomPractice.state.exerciseSet) { return; }

  var phase = RandomPractice.state.exerciseSet.phases[3];
  var tb = phase.meta.trial_balance;
  var is = phase.meta.income_statement;

  var html = '<div class="we-content">';
  html += '<div class="we-description">Watch how the adjusted trial balance numbers flow to the Income Statement and Balance Sheet.</div>';

  html += '<div class="we-flow">';
  html += '<div class="we-flow-two-col">';

  /* Left: Adjusted TB */
  html += '<div class="we-flow-tb-col">';
  html += '<div class="we-flow-col-header">Adjusted Trial Balance</div>';
  html += '<div class="we-flow-tb-list">';
  html += '<div class="we-flow-tb-item we-flow-tb-header"><span class="we-flow-item-name">Account</span><span class="we-flow-item-dr">Debit</span><span class="we-flow-item-cr">Credit</span></div>';
  var totalDr = 0, totalCr = 0;
  tb.forEach(function (row) {
    if (row.debit === 0 && row.credit === 0) { return; }
    totalDr += row.debit; totalCr += row.credit;
    var stmt = row.statement || "";
    var section = row.section || "";
    html += '<div class="we-flow-tb-item ' + (stmt === "income_statement" ? "is-acct" : "bs-acct") + '" data-account="' + Utils.escapeHtml(row.account) + '" data-section="' + section + '">';
    html += '<span class="we-flow-item-name">' + Utils.escapeHtml(row.account) + '</span>';
    html += '<span class="we-flow-item-dr">' + (row.debit > 0 ? Utils.formatAmount(row.debit) : '') + '</span>';
    html += '<span class="we-flow-item-cr">' + (row.credit > 0 ? Utils.formatAmount(row.credit) : '') + '</span>';
    html += '</div>';
  });
  /* Totals row */
  html += '<div class="we-flow-tb-item we-flow-tb-totals">';
  html += '<span class="we-flow-item-name"><strong>Totals</strong></span>';
  html += '<span class="we-flow-item-dr"><strong>' + Utils.formatAmount(totalDr) + '</strong></span>';
  html += '<span class="we-flow-item-cr"><strong>' + Utils.formatAmount(totalCr) + '</strong></span>';
  html += '</div>';
  html += '</div>';
  /* Balance check */
  var flowBalanced = totalDr === totalCr;
  html += '<div class="we-tb-balance-check ' + (flowBalanced ? "tb-balanced" : "tb-unbalanced") + '">';
  html += flowBalanced ? '\u2713 Balanced \u2014 Total Debits = Total Credits' : '\u2717 Not Balanced \u2014 Total Debits \u2260 Total Credits';
  html += '</div>';
  html += '</div>';

  /* Right: Income Statement */
  html += '<div class="we-flow-is-col">';
  html += '<div class="we-flow-col-header">Income Statement</div>';
  html += '<div class="we-flow-is-template">';
  html += '<div class="we-is-section"><strong>Revenues:</strong></div>';
  is.revenues.forEach(function (r) {
    html += '<div class="we-is-line" data-account="' + Utils.escapeHtml(r.account) + '"><span>' + Utils.escapeHtml(r.account) + '</span><span>' + Utils.formatAmount(r.amount) + '</span></div>';
  });
  html += '<div class="we-is-line we-is-subtotal"><span><strong>Total Revenue</strong></span><span><strong>' + Utils.formatAmount(is.total_revenue) + '</strong></span></div>';
  html += '<div class="we-is-section"><strong>Expenses:</strong></div>';
  is.expenses.forEach(function (e) {
    html += '<div class="we-is-line" data-account="' + Utils.escapeHtml(e.account) + '"><span>' + Utils.escapeHtml(e.account) + '</span><span>(' + Utils.formatAmount(e.amount) + ')</span></div>';
  });
  html += '<div class="we-is-line we-is-subtotal"><span><strong>Total Expenses</strong></span><span><strong>(' + Utils.formatAmount(is.total_expenses) + ')</strong></span></div>';
  html += '<div class="we-is-line we-is-netincome"><span><strong>Net Income</strong></span><span><strong>' + Utils.formatAmount(is.net_income) + '</strong></span></div>';
  html += '</div>';
  html += '</div>';

  html += '</div>'; /* two-col */

  /* Play button */
  html += '<div class="we-flow-summary" style="display:none;" id="ex-flow-summary">';
  html += '<p>Temporary accounts (revenue, expense) flow to the Income Statement. Permanent accounts (assets, liabilities, equity) flow to the Balance Sheet.</p>';
  html += '<button class="btn btn-primary" id="ex-proceed-flow">Proceed to Closing Entries \u2192</button>';
  html += '</div>';

  html += '<button class="btn btn-primary" id="ex-play-flow" style="margin-top:1rem;">\u25B6 Play Flow Animation</button>';

  html += '</div>'; /* we-flow */
  html += '</div>'; /* we-content */

  contentArea.innerHTML = html;

  var playBtn = document.getElementById("ex-play-flow");
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      playBtn.style.display = "none";
      RandomPractice.animateFlowToIS();
    });
  }
};

RandomPractice.animateFlowToIS = function () {
  /* Animate IS lines filling in */
  var isLines = document.querySelectorAll(".we-flow-is-template .we-is-line");
  var delay = 200;

  isLines.forEach(function (line, idx) {
    setTimeout(function () {
      line.classList.add("filled");
    }, idx * delay);
  });

  /* After all lines filled, show summary */
  setTimeout(function () {
    var summary = document.getElementById("ex-flow-summary");
    if (summary) { summary.style.display = "block"; }
    RandomPractice.state.phaseComplete[3] = true;
    RandomPractice.renderPhaseCards();
    RandomPractice.saveProgress();
  }, isLines.length * delay + 500);

  /* Wire proceed button */
  setTimeout(function () {
    var proceedBtn = document.getElementById("ex-proceed-flow");
    if (proceedBtn) {
      proceedBtn.addEventListener("click", function () {
        RandomPractice.state.currentPhaseIndex = 4;
        RandomPractice.state.currentTxIndex = 0;
        RandomPractice.renderPhaseCards();
        RandomPractice.loadPhase(4);
      });
    }
  }, isLines.length * delay + 600);
};

/* ─── Phase 3.5: Balance Sheet Flow ──────────────────────── */

RandomPractice.renderBalanceSheetFlow = function () {
  var contentArea = document.getElementById("ex-content-area");
  if (!contentArea || !RandomPractice.state.exerciseSet) { return; }

  var phase = RandomPractice.state.exerciseSet.phases[5];
  var tb = phase.meta.trial_balance;
  var bs = phase.meta.balance_sheet;

  var html = '<div class="we-content">';
  html += '<div class="we-description">Watch how the post-closing trial balance numbers flow to the Balance Sheet.</div>';

  html += '<div class="we-flow">';
  html += '<div class="we-flow-two-col">';

  /* Left: Post-closing TB */
  html += '<div class="we-flow-tb-col">';
  html += '<div class="we-flow-col-header">Post-Closing Trial Balance</div>';
  html += '<div class="we-flow-tb-list">';
  html += '<div class="we-flow-tb-item we-flow-tb-header"><span class="we-flow-item-name">Account</span><span class="we-flow-item-dr">Debit</span><span class="we-flow-item-cr">Credit</span></div>';
  var totalDr = 0, totalCr = 0;
  tb.forEach(function (row) {
    if (row.debit === 0 && row.credit === 0) { return; }
    totalDr += row.debit; totalCr += row.credit;
    html += '<div class="we-flow-tb-item" data-account="' + Utils.escapeHtml(row.account) + '">';
    html += '<span class="we-flow-item-name">' + Utils.escapeHtml(row.account) + '</span>';
    html += '<span class="we-flow-item-dr">' + (row.debit > 0 ? Utils.formatAmount(row.debit) : '') + '</span>';
    html += '<span class="we-flow-item-cr">' + (row.credit > 0 ? Utils.formatAmount(row.credit) : '') + '</span>';
    html += '</div>';
  });
  /* Totals row */
  html += '<div class="we-flow-tb-item we-flow-tb-totals">';
  html += '<span class="we-flow-item-name"><strong>Totals</strong></span>';
  html += '<span class="we-flow-item-dr"><strong>' + Utils.formatAmount(totalDr) + '</strong></span>';
  html += '<span class="we-flow-item-cr"><strong>' + Utils.formatAmount(totalCr) + '</strong></span>';
  html += '</div>';
  html += '</div>';
  /* Balance check */
  var flowBalanced = totalDr === totalCr;
  html += '<div class="we-tb-balance-check ' + (flowBalanced ? "tb-balanced" : "tb-unbalanced") + '">';
  html += flowBalanced ? '\u2713 Balanced \u2014 Total Debits = Total Credits' : '\u2717 Not Balanced \u2014 Total Debits \u2260 Total Credits';
  html += '</div>';
  html += '</div>';

  /* Right: Balance Sheet */
  html += '<div class="we-flow-bs-col">';
  html += '<div class="we-flow-col-header bs-header">Balance Sheet</div>';
  html += '<div class="we-flow-bs-template">';

  /* Assets */
  html += '<div class="we-bs-col-header">Assets</div>';
  bs.assets.forEach(function (a) {
    html += '<div class="we-bs-line" data-account="' + Utils.escapeHtml(a.account) + '">';
    html += '<span class="we-bs-acct-name">' + Utils.escapeHtml(a.account) + '</span>';
    html += '<span class="we-bs-beg">' + Utils.formatAmount(a.beginning) + '</span>';
    html += '<span class="we-bs-change">' + Utils.formatAmount(a.change) + '</span>';
    html += '<span class="we-bs-end">' + Utils.formatAmount(a.ending) + '</span>';
    html += '</div>';
  });
  html += '<div class="we-bs-line we-bs-subtotal"><span><strong>Total Assets</strong></span><span></span><span></span><span><strong>' + Utils.formatAmount(bs.total_assets) + '</strong></span></div>';

  /* Liabilities */
  html += '<div class="we-bs-col-header">Liabilities</div>';
  bs.liabilities.forEach(function (l) {
    html += '<div class="we-bs-line" data-account="' + Utils.escapeHtml(l.account) + '">';
    html += '<span class="we-bs-acct-name">' + Utils.escapeHtml(l.account) + '</span>';
    html += '<span class="we-bs-beg">' + Utils.formatAmount(l.beginning) + '</span>';
    html += '<span class="we-bs-change">' + Utils.formatAmount(l.change) + '</span>';
    html += '<span class="we-bs-end">' + Utils.formatAmount(l.ending) + '</span>';
    html += '</div>';
  });
  html += '<div class="we-bs-line we-bs-subtotal"><span><strong>Total Liabilities</strong></span><span></span><span></span><span><strong>' + Utils.formatAmount(bs.total_liabilities) + '</strong></span></div>';

  /* Equity */
  html += '<div class="we-bs-col-header">Equity</div>';
  bs.equity.forEach(function (e) {
    html += '<div class="we-bs-line" data-account="' + Utils.escapeHtml(e.account) + '">';
    html += '<span class="we-bs-acct-name">' + Utils.escapeHtml(e.account) + '</span>';
    html += '<span class="we-bs-beg">' + Utils.formatAmount(e.beginning) + '</span>';
    html += '<span class="we-bs-change">' + Utils.formatAmount(e.change) + '</span>';
    html += '<span class="we-bs-end">' + Utils.formatAmount(e.ending) + '</span>';
    html += '</div>';
  });
  html += '<div class="we-bs-line we-bs-subtotal"><span><strong>Total Equity</strong></span><span></span><span></span><span><strong>' + Utils.formatAmount(bs.total_equity) + '</strong></span></div>';
  html += '<div class="we-bs-line we-bs-grand-total"><span><strong>Total Liabilities + Equity</strong></span><span></span><span></span><span><strong>' + Utils.formatAmount(bs.total_liabilities_equity) + '</strong></span></div>';

  html += '</div>'; /* template */
  html += '</div>'; /* bs-col */

  html += '</div>'; /* two-col */

  html += '<button class="btn btn-primary" id="ex-play-bs" style="margin-top:1rem;">\u25B6 Play Balance Sheet Flow</button>';

  html += '</div>'; /* we-flow */
  html += '</div>'; /* we-content */

  contentArea.innerHTML = html;

  var playBtn = document.getElementById("ex-play-bs");
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      playBtn.style.display = "none";
      RandomPractice.animateBSToBS();
    });
  }
};

RandomPractice.animateBSToBS = function () {
  var bsLines = document.querySelectorAll(".we-flow-bs-template .we-bs-line");
  var delay = 200;

  bsLines.forEach(function (line, idx) {
    setTimeout(function () {
      line.classList.add("filled");
    }, idx * delay);
  });

  /* After all lines filled, stop timer and grand finale */
  setTimeout(function () {
    RandomPractice.state.phaseComplete[5] = true;
    RandomPractice.renderPhaseCards();
    RandomPractice.timerStop();
    RandomPractice.saveProgress();

    if (typeof Celebration !== "undefined" && Celebration.grandFinale) {
      var finalTime = RandomPractice.timerGetElapsed();
      var timeStr = RandomPractice.timerFormat(finalTime);
      Celebration.grandFinale(timeStr);
    }

    /* Show completion message */
    var contentArea = document.getElementById("ex-content-area");
    if (contentArea) {
      var completeDiv = document.createElement("div");
      completeDiv.className = "card";
      completeDiv.style.cssText = "text-align:center;padding:2rem;margin-top:1rem;";
      completeDiv.innerHTML = '<h2>\u2713 Accounting Cycle Complete!</h2>' +
        '<p>All 6 phases finished. Final time: <strong>' + RandomPractice.timerFormat(RandomPractice.timerGetElapsed()) + '</strong></p>' +
        '<button class="btn btn-primary" id="ex-new-set-final">Generate New Set</button>';
      contentArea.appendChild(completeDiv);

      var newBtn = document.getElementById("ex-new-set-final");
      if (newBtn) {
        newBtn.addEventListener("click", function () { RandomPractice.generateNewSet(); });
      }
    }
  }, bsLines.length * delay + 500);
};

/* ─── Cycle Timer ──────────────────────────────────────────── */

RandomPractice.timerStart = function () {
  if (RandomPractice.state.timerInterval) { clearInterval(RandomPractice.state.timerInterval); }
  RandomPractice.state.timerStarted = true;
  RandomPractice.state.timerStopped = false;

  /* If resuming from a saved session, adjust startTs so elapsed continues from saved value */
  if (RandomPractice.state.timerElapsed > 0 && RandomPractice.state.timerStartTs > 0) {
    RandomPractice.state.timerStartTs = Date.now() - RandomPractice.state.timerElapsed;
  } else {
    RandomPractice.state.timerStartTs = Date.now();
    RandomPractice.state.timerElapsed = 0;
  }

  RandomPractice.state.timerInterval = setInterval(function () {
    if (!RandomPractice.state.timerStopped) {
      RandomPractice.state.timerElapsed = Date.now() - RandomPractice.state.timerStartTs;
      RandomPractice.timerUpdateDisplay();
      /* Save progress every 30 ticks (30s) to avoid excessive localStorage writes */
      if (RandomPractice.state.timerElapsed > 0 && Math.floor(RandomPractice.state.timerElapsed / 1000) % 30 === 0) {
        RandomPractice.saveProgress();
      }
    }
  }, 1000);
};

RandomPractice.timerStop = function () {
  RandomPractice.state.timerStopped = true;
  if (RandomPractice.state.timerInterval) { clearInterval(RandomPractice.state.timerInterval); }
  var label = document.getElementById("ex-cycle-timer-label");
  if (label) { label.textContent = "Final Time"; }
  var timer = document.getElementById("ex-cycle-timer");
  if (timer) { timer.classList.add("stopped"); }
};

RandomPractice.timerReset = function () {
  if (RandomPractice.state.timerInterval) { clearInterval(RandomPractice.state.timerInterval); }
  RandomPractice.state.timerStarted = false;
  RandomPractice.state.timerStopped = false;
  RandomPractice.state.timerStartTs = 0;
  RandomPractice.state.timerElapsed = 0;
  var label = document.getElementById("ex-cycle-timer-label");
  if (label) { label.textContent = "Cycle Timer"; }
  var timer = document.getElementById("ex-cycle-timer");
  if (timer) { timer.classList.remove("stopped"); timer.textContent = "00:00"; }
};

RandomPractice.timerGetElapsed = function () {
  return RandomPractice.state.timerElapsed;
};

RandomPractice.timerFormat = function (ms) {
  var totalSec = Math.floor(ms / 1000);
  var min = Math.floor(totalSec / 60);
  var sec = totalSec % 60;
  return (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
};

RandomPractice.timerUpdateDisplay = function () {
  var timer = document.getElementById("ex-cycle-timer");
  if (timer) {
    timer.textContent = RandomPractice.timerFormat(RandomPractice.state.timerElapsed);
  }
};