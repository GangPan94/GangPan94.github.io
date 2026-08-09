/* ============================================================ */
/*  ACCT 321 — Accounting Cycle Practice Tool                   */
/*  checker.js — Answer-checking engine with diagnostic feedback */
/* ============================================================ */

var Checker = Checker || {};

/* --- Step 1: Equation Analysis Checking --- */

/* Check the student's equation analysis against the answer key.
 * Returns { checks: [{label, passed, hint}], score: {passed, total} }
 */
Checker.checkEquationAnalysis = function (studentAccounts, answerAccounts) {
  var checks = [];
  var passedCount = 0;

  /* Check 1: Number of accounts */
  if (studentAccounts.length < answerAccounts.length) {
    checks.push({
      label: "Account count",
      passed: false,
      hint: "You are missing an account."
    });
  } else if (studentAccounts.length > answerAccounts.length) {
    checks.push({
      label: "Account count",
      passed: false,
      hint: "You have an extra account."
    });
  } else {
    checks.push({
      label: "Account count",
      passed: true,
      hint: ""
    });
    passedCount++;
  }

  /* For each answer account, find the best matching student account */
  var usedIndices = [];
  var accountChecks = [];

  answerAccounts.forEach(function (answerAcc) {
    var bestMatch = null;
    var bestIdx = -1;

    studentAccounts.forEach(function (studentAcc, sIdx) {
      if (usedIndices.indexOf(sIdx) !== -1) {
        return;
      }
      var accMatch = Utils.accountsMatch(studentAcc.account, answerAcc.account);
      if (accMatch) {
        bestMatch = studentAcc;
        bestIdx = sIdx;
        return;
      }
      /* Keep first unmatched as fallback */
      if (!bestMatch) {
        bestMatch = studentAcc;
        bestIdx = sIdx;
      }
    });

    if (bestMatch && bestIdx !== -1) {
      usedIndices.push(bestIdx);
      accountChecks.push({
        answerAccount: answerAcc.account,
        studentAccount: bestMatch.account,
        accountMatch: Utils.accountsMatch(bestMatch.account, answerAcc.account),
        typeMatch: Checker.classificationMatches(bestMatch.type, answerAcc.type),
        directionMatch: Checker.directionMatches(bestMatch.change, answerAcc.change),
        amountMatch: Checker.amountMatches(bestMatch.amount, answerAcc.amount)
      });
    } else {
      accountChecks.push({
        answerAccount: answerAcc.account,
        studentAccount: "",
        accountMatch: false,
        typeMatch: false,
        directionMatch: false,
        amountMatch: false
      });
    }
  });

  /* Check 2: Account identification */
  var allAccountsMatch = accountChecks.every(function (c) { return c.accountMatch; });
  checks.push({
    label: "Account identification",
    passed: allAccountsMatch,
    hint: allAccountsMatch ? "" : "One or more accounts are incorrect."
  });
  if (allAccountsMatch) { passedCount++; }

  /* Check 3: Classification */
  var allTypesMatch = accountChecks.every(function (c) { return c.typeMatch; });
  checks.push({
    label: "Account classification",
    passed: allTypesMatch,
    hint: allTypesMatch ? "" : "One account is in the wrong category."
  });
  if (allTypesMatch) { passedCount++; }

  /* Check 4: Direction */
  var allDirectionsMatch = accountChecks.every(function (c) { return c.directionMatch; });
  checks.push({
    label: "Direction (increase/decrease)",
    passed: allDirectionsMatch,
    hint: allDirectionsMatch ? "" : "The direction for one account is wrong."
  });
  if (allDirectionsMatch) { passedCount++; }

  /* Check 5: Amounts */
  var allAmountsMatch = accountChecks.every(function (c) { return c.amountMatch; });
  checks.push({
    label: "Amounts",
    passed: allAmountsMatch,
    hint: allAmountsMatch ? "" : "The amount does not match the transaction."
  });
  if (allAmountsMatch) { passedCount++; }

  return {
    checks: checks,
    accountChecks: accountChecks,
    score: { passed: passedCount, total: 5 }
  };
};

/* Check if a student's classification matches the answer.
 * Accepts Revenue/Expense as equivalent to Equity for equation purposes.
 * Also handles sub-types like "Equity (Contra)", "Equity (Temporary)", "Asset (Contra)". */
Checker.classificationMatches = function (studentType, answerType) {
  if (!studentType || !answerType) {
    return false;
  }
  var s = Utils.normalize(studentType);
  var a = Utils.normalize(answerType);

  /* Direct match */
  if (s === a) {
    return true;
  }

  /* Extract base type from answer (e.g., "Equity (Contra)" -> "equity") */
  var aBase = a.split(" ")[0];
  var sBase = s.split(" ")[0];

  if (sBase === aBase) {
    return true;
  }

  /* Revenue and Expense are sub-components of Equity in the equation */
  if ((aBase === "revenue" || aBase === "expense") && sBase === "equity") {
    return true;
  }
  if ((sBase === "revenue" || sBase === "expense") && aBase === "equity") {
    return true;
  }

  return false;
};

/* Check if direction matches (increase/decrease) */
Checker.directionMatches = function (studentDir, answerDir) {
  if (!studentDir || !answerDir) {
    return false;
  }
  return Utils.normalize(studentDir) === Utils.normalize(answerDir);
};

/* Check if amounts match within tolerance */
Checker.amountMatches = function (studentAmt, answerAmt) {
  var s = parseFloat(studentAmt) || 0;
  var a = parseFloat(answerAmt) || 0;
  return Math.abs(s - a) < 0.01;
};

/* --- Step 2: Journal Entry Checking --- */

/* Check the student's journal entries against the answer key.
 * Returns { checks: [{label, passed, hint}], score: {passed, total} }
 */
Checker.checkJournalEntries = function (studentEntries, answerEntries) {
  var checks = [];
  var passedCount = 0;

  /* Check 1: Number of entries */
  if (studentEntries.length < answerEntries.length) {
    checks.push({
      label: "Entry count",
      passed: false,
      hint: "You are missing an entry."
    });
  } else if (studentEntries.length > answerEntries.length) {
    checks.push({
      label: "Entry count",
      passed: false,
      hint: "You have an extra entry."
    });
  } else {
    checks.push({
      label: "Entry count",
      passed: true,
      hint: ""
    });
    passedCount++;
  }

  /* Match student entries to answer entries (order-independent) */
  var usedIndices = [];
  var entryChecks = [];

  answerEntries.forEach(function (answerEntry) {
    var bestMatch = null;
    var bestIdx = -1;

    studentEntries.forEach(function (studentEntry, sIdx) {
      if (usedIndices.indexOf(sIdx) !== -1) {
        return;
      }
      var accMatch = Utils.accountsMatch(studentEntry.account, answerEntry.account);
      if (accMatch) {
        bestMatch = studentEntry;
        bestIdx = sIdx;
        return;
      }
      if (!bestMatch) {
        bestMatch = studentEntry;
        bestIdx = sIdx;
      }
    });

    if (bestMatch && bestIdx !== -1) {
      usedIndices.push(bestIdx);
      entryChecks.push({
        answerAccount: answerEntry.account,
        answerSide: answerEntry.side,
        answerAmount: answerEntry.amount,
        studentAccount: bestMatch.account,
        studentSide: bestMatch.side,
        studentAmount: bestMatch.amount,
        accountMatch: Utils.accountsMatch(bestMatch.account, answerEntry.account),
        sideMatch: Utils.normalize(bestMatch.side) === Utils.normalize(answerEntry.side),
        amountMatch: Checker.amountMatches(bestMatch.amount, answerEntry.amount)
      });
    } else {
      entryChecks.push({
        answerAccount: answerEntry.account,
        answerSide: answerEntry.side,
        answerAmount: answerEntry.amount,
        studentAccount: "",
        studentSide: "",
        studentAmount: "",
        accountMatch: false,
        sideMatch: false,
        amountMatch: false
      });
    }
  });

  /* Check 2: Account identification */
  var allAccountsMatch = entryChecks.every(function (c) { return c.accountMatch; });
  checks.push({
    label: "Account identification",
    passed: allAccountsMatch,
    hint: allAccountsMatch ? "" : "You are missing an account or have an extra account."
  });
  if (allAccountsMatch) { passedCount++; }

  /* Check 3: Debit/credit side */
  var allSidesMatch = entryChecks.every(function (c) { return c.sideMatch; });
  checks.push({
    label: "Debit/credit side",
    passed: allSidesMatch,
    hint: allSidesMatch ? "" : "An account is on the wrong side. Remember: increases go on the normal balance side."
  });
  if (allSidesMatch) { passedCount++; }

  /* Check 4: Amounts */
  var allAmountsMatch = entryChecks.every(function (c) { return c.amountMatch; });
  checks.push({
    label: "Amounts",
    passed: allAmountsMatch,
    hint: allAmountsMatch ? "" : "The amount does not match the transaction."
  });
  if (allAmountsMatch) { passedCount++; }

  /* Check 5: Debits equal credits */
  var totalDebits = 0;
  var totalCredits = 0;
  studentEntries.forEach(function (e) {
    if (Utils.normalize(e.side) === "debit") {
      totalDebits += parseFloat(e.amount) || 0;
    } else {
      totalCredits += parseFloat(e.amount) || 0;
    }
  });
  var debitsEqualCredits = Math.abs(totalDebits - totalCredits) < 0.01;
  checks.push({
    label: "Debits equal credits",
    passed: debitsEqualCredits,
    hint: debitsEqualCredits ? "" : "Your debits ($" + totalDebits.toLocaleString() + ") do not equal your credits ($" + totalCredits.toLocaleString() + ")."
  });
  if (debitsEqualCredits) { passedCount++; }

  return {
    checks: checks,
    entryChecks: entryChecks,
    score: { passed: passedCount, total: 5 }
  };
};

/* --- Combined Check --- */

/* Check both steps together and return combined feedback */
Checker.checkBothSteps = function (studentData, answerKey) {
  var equationResult = Checker.checkEquationAnalysis(
    studentData.equationAccounts,
    answerKey.analysis.accounts_affected
  );

  /* Convert answer entries from {account, debit, credit} to {account, side, amount} if needed */
  var answerEntries = answerKey.entries.map(function (entry) {
    if (entry.side) {
      return entry; /* Already in {account, side, amount} format */
    }
    /* Convert from {account, debit, credit} format */
    if (entry.debit > 0) {
      return { account: entry.account, side: "debit", amount: entry.debit };
    }
    if (entry.credit > 0) {
      return { account: entry.account, side: "credit", amount: entry.credit };
    }
    return entry;
  });

  var journalResult = Checker.checkJournalEntries(
    studentData.journalEntries,
    answerEntries
  );

  var totalPassed = equationResult.score.passed + journalResult.score.passed;
  var totalChecks = 10;

  return {
    equation: equationResult,
    journal: journalResult,
    totalScore: { passed: totalPassed, total: totalChecks }
  };
};
