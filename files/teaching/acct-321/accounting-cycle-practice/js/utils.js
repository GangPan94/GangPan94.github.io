/* ============================================================ */
/*  ACCT 321 — Accounting Cycle Practice Tool                   */
/*  utils.js — Shared helpers: color-coding, formatting, DOM    */
/* ============================================================ */

/* --- Account Type Color Helpers --- */
var Utils = Utils || {};

/* --- Used Accounts Filter --- */
/* Only show accounts that appear in the course content — not the full 62-account COA */
Utils.USED_ACCOUNTS = [
  "Cash", "Accounts Receivable", "Allowance for Doubtful Accounts",
  "Notes Receivable", "Interest Receivable",
  "Supplies", "Prepaid Insurance", "Prepaid Rent",
  "Accumulated Depreciation — Buildings", "Equipment",
  "Accumulated Depreciation — Equipment", "Office Equipment",
  "Accumulated Depreciation — Office Equipment", "Inventory",
  "Accounts Payable", "Notes Payable", "Unearned Revenue",
  "Interest Payable", "Salaries Payable", "Deferred Rent Revenue",
  "Common Stock", "Dividends", "Owner's Capital", "Owner's Drawings",
  "Retained Earnings", "Income Summary",
  "Service Revenue", "Sales Revenue", "Sales Discounts", "Interest Revenue",
  "Rent Revenue",
  "Cost of Goods Sold", "Salaries Expense", "Rent Expense",
  "Utilities Expense", "Supplies Expense", "Depreciation Expense",
  "Interest Expense", "Advertising Expense", "Bad Debt Expense"
];

/* Check if an account should be visible in dropdowns */
Utils.isUsedAccount = function (accountName) {
  return Utils.USED_ACCOUNTS.indexOf(accountName) !== -1;
};

/* Return the CSS class for an account type */
Utils.accountTypeClass = function (type) {
  if (!type) {
    return "";
  }
  var t = type.toLowerCase();
  var baseType = t.split(" ")[0];
  if (baseType === "asset" || t.indexOf("asset") !== -1) {
    return "eq-assets";
  }
  if (baseType === "liability" || t.indexOf("liability") !== -1) {
    return "eq-liabilities";
  }
  if (baseType === "equity" || baseType === "revenue" || t.indexOf("equity") !== -1) {
    return "eq-equity";
  }
  if (baseType === "expense" || t.indexOf("expense") !== -1) {
    return "eq-assets";
  }
  return "";
};

/* Return the CSS class for debit/credit display */
Utils.sideClass = function (side) {
  if (side === "Debit" || side === "debit") {
    return "number-debit";
  }
  if (side === "Credit" || side === "credit") {
    return "number-credit";
  }
  return "";
};

/* Format a number as currency (no cents for whole numbers) */
Utils.formatCurrency = function (amount) {
  if (amount === null || amount === undefined) {
    return "";
  }
  if (Number.isInteger(amount)) {
    return "$" + amount.toLocaleString();
  }
  return "$" + amount.toFixed(2);
};

/* Format a number for display in table cells */
Utils.formatAmount = function (amount) {
  if (amount === null || amount === undefined || amount === 0) {
    return "";
  }
  if (Number.isInteger(amount)) {
    return amount.toLocaleString();
  }
  return amount.toFixed(2);
};

/* --- DOM Builders --- */

/* Create an element with attributes and children */
Utils.createElement = function (tag, attrs, children) {
  var el = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function (key) {
      if (key === "className") {
        el.className = attrs[key];
      } else if (key === "dataset") {
        var ds = attrs[key];
        Object.keys(ds).forEach(function (dk) {
          el.dataset[dk] = ds[dk];
        });
      } else if (key === "style") {
        Object.keys(attrs[key]).forEach(function (sk) {
          el.style[sk] = attrs[key][sk];
        });
      } else if (key.indexOf("on") === 0) {
        el.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
      } else {
        el.setAttribute(key, attrs[key]);
      }
    });
  }
  if (children) {
    children.forEach(function (child) {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
  }
  return el;
};

/* Clear all children from an element */
Utils.clearElement = function (el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

/* --- Data Loading --- */

/* Load JSON data from a URL via fetch (with cache-busting to prevent stale data) */
Utils.CACHE_VERSION = "v22";
Utils.loadJSON = function (url) {
  /* Append cache-busting query string to data files */
  var bustUrl = url + (url.indexOf("?") === -1 ? "?" : "&") + Utils.CACHE_VERSION;
  return fetch(bustUrl).then(function (response) {
    if (!response.ok) {
      throw new Error("Failed to load " + url + ": " + response.status);
    }
    return response.json();
  });
};

/* Load all worked example sets */
Utils.loadWorkedExamples = function () {
  var urls = [
    "data/worked-examples-set1.json",
    "data/worked-examples-set2.json",
    "data/worked-examples-set3.json"
  ];
  return Promise.all(urls.map(Utils.loadJSON));
};

/* Load all 3 Dress Right phase files */
Utils.loadDressRightPhases = function () {
  var urls = [
    "data/dress-right-phase1-daily-ops.json",
    "data/dress-right-phase2-adjusting.json",
    "data/dress-right-phase3-closing.json"
  ];
  return Promise.all(urls.map(Utils.loadJSON));
};

/* Load chart of accounts */
Utils.loadChartOfAccounts = function () {
  return Utils.loadJSON("data/chart-of-accounts.json");
};

/* Sort accounts by account number (handles numeric and decimal numbers like 402.1) */
Utils.sortAccounts = function (accounts) {
  return accounts.slice().sort(function (a, b) {
    var na = parseFloat(a.number) || 0;
    var nb = parseFloat(b.number) || 0;
    return na - nb;
  });
};

/* Load transaction templates */
Utils.loadTemplates = function () {
  return Utils.loadJSON("data/transaction-templates.json");
};

/* --- Account Lookup --- */

/* Build a lookup map from account name to account object */
Utils.buildAccountMap = function (accounts) {
  var map = {};
  accounts.forEach(function (acc) {
    map[acc.name] = acc;
  });
  return map;
};

/* Get the normal balance for an account name */
Utils.getNormalBalance = function (accountName, accountMap) {
  var acc = accountMap[accountName];
  if (acc) {
    return acc.normal_balance;
  }
  return null;
};

/* Get the account type for an account name */
Utils.getAccountType = function (accountName, accountMap) {
  var acc = accountMap[accountName];
  if (acc) {
    return acc.type;
  }
  return null;
};

/* --- Answer Checking --- */

/* Normalize a string for comparison (lowercase, trim) */
Utils.normalize = function (str) {
  if (!str) {
    return "";
  }
  return str.trim().toLowerCase();
};

/* Check if two account names match (case-insensitive, trimmed) */
Utils.accountsMatch = function (a, b) {
  return Utils.normalize(a) === Utils.normalize(b);
};

/* Check a single student entry against the answer key entry */
/* Returns {accountMatch, sideMatch, amountMatch, correct} */
Utils.checkEntry = function (studentEntry, answerEntry) {
  var accountMatch = Utils.accountsMatch(studentEntry.account, answerEntry.account);
  var sideMatch = Utils.normalize(studentEntry.side) === Utils.normalize(answerEntry.side);
  var amountMatch = Math.abs(parseFloat(studentEntry.amount) - parseFloat(answerEntry.amount)) < 0.01;
  var correct = accountMatch && sideMatch && amountMatch;
  return {
    accountMatch: accountMatch,
    sideMatch: sideMatch,
    amountMatch: amountMatch,
    correct: correct
  };
};

/* Check all entries for a single transaction */
/* Returns {correct, total, entries: [{account, side, amount, correct, ...}]} */
Utils.checkTransaction = function (studentEntries, answerEntries) {
  var results = [];
  var correctCount = 0;
  var total = answerEntries.length;

  /* For each answer entry, find the matching student entry (order-independent) */
  var used = [];
  answerEntries.forEach(function (answerEntry, idx) {
    var bestMatch = null;
    var bestIdx = -1;

    studentEntries.forEach(function (studentEntry, sIdx) {
      if (used.indexOf(sIdx) !== -1) {
        return;
      }
      var check = Utils.checkEntry(studentEntry, answerEntry);
      if (check.correct) {
        bestMatch = check;
        bestIdx = sIdx;
        return;
      }
      /* Track the best partial match */
      if (!bestMatch) {
        bestMatch = check;
        bestIdx = sIdx;
      }
    });

    if (bestMatch && bestIdx !== -1) {
      used.push(bestIdx);
      results.push({
        account: answerEntry.account,
        side: answerEntry.side,
        amount: answerEntry.amount,
        studentAccount: studentEntries[bestIdx] ? studentEntries[bestIdx].account : "",
        studentSide: studentEntries[bestIdx] ? studentEntries[bestIdx].side : "",
        studentAmount: studentEntries[bestIdx] ? studentEntries[bestIdx].amount : "",
        accountMatch: bestMatch.accountMatch,
        sideMatch: bestMatch.sideMatch,
        amountMatch: bestMatch.amountMatch,
        correct: bestMatch.correct
      });
      if (bestMatch.correct) {
        correctCount++;
      }
    } else {
      results.push({
        account: answerEntry.account,
        side: answerEntry.side,
        amount: answerEntry.amount,
        studentAccount: "",
        studentSide: "",
        studentAmount: "",
        accountMatch: false,
        sideMatch: false,
        amountMatch: false,
        correct: false
      });
    }
  });

  return {
    correct: correctCount,
    total: total,
    entries: results,
    allCorrect: correctCount === total
  };
};

/* --- Equation Visual Helpers --- */

/* Compute the equation totals from student's equation analysis accounts.
 * Returns { totalAssets, totalLiabilities, totalEquity, isBalanced }
 */
Utils.computeEquationTotals = function (accounts) {
  var totalAssets = 0;
  var totalLiabilities = 0;
  var totalEquity = 0;

  accounts.forEach(function (acc) {
    var type = (acc.type || "").toLowerCase();
    var change = (acc.change || "").toLowerCase();
    var amount = parseFloat(acc.amount) || 0;
    var sign = (change === "increase") ? 1 : -1;

    /* Extract base type (e.g., "equity (contra)" -> "equity") */
    var baseType = type.split(" ")[0];
    var isContra = type.indexOf("contra") !== -1;

    if (baseType === "asset" || type.indexOf("asset") !== -1) {
      /* Contra-asset (e.g., Accumulated Depreciation): increase in contra = decrease in assets */
      if (isContra && type.indexOf("asset") !== -1) {
        totalAssets -= sign * amount;
      } else {
        totalAssets += sign * amount;
      }
    } else if (baseType === "liability" || type.indexOf("liability") !== -1) {
      totalLiabilities += sign * amount;
    } else if (baseType === "equity" || type.indexOf("equity") !== -1 ||
               baseType === "revenue" || baseType === "expense") {
      /* Revenue increases equity, expense decreases equity.
       * Contra-equity (e.g., Dividends): increase in contra = DECREASE in equity */
      if (baseType === "expense") {
        totalEquity -= sign * amount;
      } else if (isContra && baseType === "equity") {
        /* Dividends, Owner's Drawings — contra-equity: increase = equity decrease */
        totalEquity -= sign * amount;
      } else {
        totalEquity += sign * amount;
      }
    }
  });

  var isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

  return {
    totalAssets: totalAssets,
    totalLiabilities: totalLiabilities,
    totalEquity: totalEquity,
    isBalanced: isBalanced
  };
};

/* Render the equation visual HTML.
 * Returns HTML string for the equation display.
 */
Utils.renderEquationVisual = function (totals) {
  var leftSide = totals.totalAssets;
  var rightSide = totals.totalLiabilities + totals.totalEquity;
  var balanced = totals.isBalanced;

  var balanceIcon = balanced ? "\u2713" : "\u26A0";
  var balanceClass = balanced ? "eq-balanced" : "eq-unbalanced";
  var balanceText = balanced ? "Balanced" : "Not Balanced";

  var html = "";
  html += '<div class="eq-visual ' + balanceClass + '">';
  html += '<div class="eq-title">Accounting Equation</div>';
  html += '<div class="eq-row">';
  html += '<span class="eq-side">';
  html += '<span class="eq-label">Assets</span>';
  html += '<span class="eq-amount eq-assets">$' + Utils.formatAmount(leftSide) + '</span>';
  html += '</span>';
  html += '<span class="eq-operator">=</span>';
  html += '<span class="eq-side">';
  html += '<span class="eq-label">Liabilities</span>';
  html += '<span class="eq-amount eq-liabilities">$' + Utils.formatAmount(totals.totalLiabilities) + '</span>';
  html += '</span>';
  html += '<span class="eq-operator">+</span>';
  html += '<span class="eq-side">';
  html += '<span class="eq-label">Equity</span>';
  html += '<span class="eq-amount eq-equity">$' + Utils.formatAmount(totals.totalEquity) + '</span>';
  html += '</span>';
  html += '</div>';
  html += '<div class="eq-balance-indicator ' + balanceClass + '">';
  html += '<span class="eq-balance-icon">' + balanceIcon + '</span>';
  html += '<span class="eq-balance-text">' + balanceText + '</span>';
  html += '</div>';
  html += '</div>';

  return html;
};

/* Render the equation analysis for worked examples (pre-filled, read-only).
 * Returns HTML string.
 */
Utils.renderEquationAnalysisDisplay = function (analysis) {
  if (!analysis || !analysis.accounts_affected) {
    return "";
  }

  var accounts = analysis.accounts_affected;
  var totals = Utils.computeEquationTotals(accounts);

  var html = "";
  html += '<div class="we-equation-analysis">';
  html += '<h3>Step 1: Accounting Equation Analysis</h3>';

  /* Account table */
  html += '<table class="we-eq-table" role="table" aria-label="Equation analysis">';
  html += '<thead><tr><th>Account</th><th>Type</th><th>Change</th><th class="amount-header">Amount</th></tr></thead>';
  html += '<tbody>';

  accounts.forEach(function (acc) {
    var typeClass = Utils.accountTypeClass(acc.type);
    var changeIcon = acc.change === "increase" ? "\u2191" : "\u2193";
    var changeClass = acc.change === "increase" ? "eq-increase" : "eq-decrease";
    html += '<tr>' +
      '<td>' + Utils.escapeHtml(acc.account) + '</td>' +
      '<td class="' + typeClass + '">' + Utils.escapeHtml(acc.type) + '</td>' +
      '<td class="' + changeClass + '">' + changeIcon + ' ' + Utils.escapeHtml(acc.change) + '</td>' +
      '<td class="amount-cell">$' + Utils.formatAmount(acc.amount) + '</td>' +
    '</tr>';
  });

  html += '</tbody></table>';

  /* Equation visual */
  html += Utils.renderEquationVisual(totals);

  /* Equation impact text */
  if (analysis.equation_impact) {
    html += '<div class="we-eq-impact">';
    html += '<strong>Impact:</strong> ' + Utils.escapeHtml(analysis.equation_impact);
    html += '</div>';
  }

  html += '</div>';

  return html;
};

/* --- HTML Escape Helper --- */
Utils.escapeHtml = function (str) {
  if (!str) {
    return "";
  }
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

/* --- Random Utilities --- */

/* Get a random integer between min and max (inclusive) */
Utils.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* Get a random amount from a range with step */
Utils.randomAmount = function (min, max, step) {
  var steps = Math.floor((max - min) / step);
  var randomStep = Utils.randomInt(0, steps);
  return min + (randomStep * step);
};

/* Shuffle an array (Fisher-Yates) */
Utils.shuffle = function (arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Utils.randomInt(0, i);
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
};
