/* ============================================================ */
/*  ACCT 321 — Accounting Cycle Practice Tool                   */
/*  generator.js — Template engine for random practice           */
/* ============================================================ */

var Generator = Generator || {};

/* --- Configuration --- */
Generator.CONFIG = {
  beginner: { count: 3, label: "Beginner" },
  intermediate: { count: 5, label: "Intermediate" },
  advanced: { count: 7, label: "Advanced" }
};

/* --- Main Generate Function --- */

/* Generate a random problem set.
 * Parameters:
 *   templatesData - the full transaction-templates.json data
 *   accountMap - map of account name -> account object
 *   topic - "all", "service", or "merchandising"
 *   difficulty - "beginner", "intermediate", or "advanced"
 * Returns: { transactions: [{description, entries: [{account, side, amount}]}] }
 */
Generator.generate = function (templatesData, accountMap, topic, difficulty) {
  var templates = templatesData.templates;
  var available = [];

  /* Collect templates matching the topic filter */
  var businessTypes = [];
  if (topic === "all" || topic === "service") {
    businessTypes.push("service_business");
  }
  if (topic === "all" || topic === "merchandising") {
    businessTypes.push("merchandising_business");
  }

  businessTypes.forEach(function (bt) {
    var bizTemplates = templates[bt];
    if (!bizTemplates) {
      return;
    }
    /* For "all" difficulty, include all levels */
    if (difficulty === "all") {
      var levels = ["beginner", "intermediate", "advanced"];
      levels.forEach(function (level) {
        var levelTemplates = bizTemplates[level];
        if (levelTemplates && Array.isArray(levelTemplates)) {
          levelTemplates.forEach(function (t) {
            available.push({
              template: t,
              businessType: bt,
              difficulty: level
            });
          });
        }
      });
    } else {
      var levelTemplates = bizTemplates[difficulty];
      if (levelTemplates && Array.isArray(levelTemplates)) {
        levelTemplates.forEach(function (t) {
          available.push({
            template: t,
            businessType: bt,
            difficulty: difficulty
          });
        });
      }
    }
  });

  if (available.length === 0) {
    return { transactions: [] };
  }

  /* Determine how many templates to pick */
  var count = Generator.CONFIG[difficulty] ? Generator.CONFIG[difficulty].count : 3;
  if (difficulty === "all") {
    count = 5;
  }

  /* Pick N random templates (or fewer if not enough available) */
  var shuffled = Utils.shuffle(available);
  var selected = shuffled.slice(0, Math.min(count, shuffled.length));

  /* Process each template into a transaction */
  var transactions = [];
  selected.forEach(function (item) {
    var tx = Generator.processTemplate(item.template, accountMap);
    if (tx) {
      transactions.push(tx);
    }
  });

  return { transactions: transactions };
};

/* --- Template Processing --- */

/* Process a single template into a transaction with randomized amounts.
 * Returns { description, entries: [{account, side, amount}], analysis: {...} } or null.
 */
Generator.processTemplate = function (template, accountMap) {
  if (!template || !template.accounts) {
    return null;
  }

  var accounts = template.accounts;

  /* Check if this is a multi-entry template (has entry_1, entry_2) */
  if (accounts.entry_1 && accounts.entry_2) {
    return Generator.processMultiEntryTemplate(template, accountMap);
  }

  /* Standard single-entry template */
  var amount = Utils.randomAmount(
    template.amountRange[0],
    template.amountRange[1],
    template.step
  );

  var description = template.description.replace("$[AMOUNT]", Utils.formatCurrency(amount));

  var entries = [];

  /* Handle debit side - could be string or array */
  var debitAccounts = Array.isArray(accounts.debit) ? accounts.debit : [accounts.debit];
  var creditAccounts = Array.isArray(accounts.credit) ? accounts.credit : [accounts.credit];

  /* For compound entries, we need to split the amount */
  if (debitAccounts.length > 1 || creditAccounts.length > 1) {
    return Generator.processCompoundEntry(template, accountMap, amount, description);
  }

  /* Simple 2-account entry */
  entries.push({
    account: debitAccounts[0],
    side: "debit",
    amount: amount
  });
  entries.push({
    account: creditAccounts[0],
    side: "credit",
    amount: amount
  });

  /* Build analysis from template analysis field */
  var analysis = Generator.buildAnalysis(template, amount);

  return {
    description: description,
    entries: entries,
    analysis: analysis
  };
};

/* Build the analysis object from a template's analysis field, filling in amounts. */
Generator.buildAnalysis = function (template, amount) {
  var templateAnalysis = template.analysis;
  if (!templateAnalysis || !templateAnalysis.accounts_affected) {
    return null;
  }

  var accountsAffected = templateAnalysis.accounts_affected.map(function (acc) {
    var accAmount = amount;
    /* If the template specifies an amount for this account, use it */
    if (acc.amount !== undefined) {
      accAmount = acc.amount;
    }
    return {
      account: acc.account,
      type: acc.type,
      change: acc.change,
      amount: accAmount
    };
  });

  var equationImpact = templateAnalysis.equation_impact
    ? templateAnalysis.equation_impact.replace("$[AMOUNT]", Utils.formatCurrency(amount))
    : "";

  return {
    accounts_affected: accountsAffected,
    equation_impact: equationImpact
  };
};

/* Process a compound entry (array of accounts on one side).
 * For now, split the amount evenly or use a ratio.
 */
Generator.processCompoundEntry = function (template, accountMap, totalAmount, description) {
  var accounts = template.accounts;
  var debitAccounts = Array.isArray(accounts.debit) ? accounts.debit : [accounts.debit];
  var creditAccounts = Array.isArray(accounts.credit) ? accounts.credit : [accounts.credit];

  var entries = [];

  if (debitAccounts.length > 1 && creditAccounts.length === 1) {
    /* Multiple debits, one credit - split debit amounts */
    var remaining = totalAmount;
    debitAccounts.forEach(function (acc, idx) {
      var amt;
      if (idx === debitAccounts.length - 1) {
        amt = remaining;
      } else {
        amt = Math.round(totalAmount / debitAccounts.length / template.step) * template.step;
        if (amt < template.amountRange[0]) {
          amt = Math.round(totalAmount / debitAccounts.length);
        }
        remaining -= amt;
      }
      entries.push({
        account: acc,
        side: "debit",
        amount: amt
      });
    });
    entries.push({
      account: creditAccounts[0],
      side: "credit",
      amount: totalAmount
    });
  } else if (creditAccounts.length > 1 && debitAccounts.length === 1) {
    /* One debit, multiple credits - split credit amounts */
    var remaining = totalAmount;
    creditAccounts.forEach(function (acc, idx) {
      var amt;
      if (idx === creditAccounts.length - 1) {
        amt = remaining;
      } else {
        amt = Math.round(totalAmount / creditAccounts.length / template.step) * template.step;
        if (amt < template.amountRange[0]) {
          amt = Math.round(totalAmount / creditAccounts.length);
        }
        remaining -= amt;
      }
      entries.push({
        account: acc,
        side: "credit",
        amount: amt
      });
    });
    entries.push({
      account: debitAccounts[0],
      side: "debit",
      amount: totalAmount
    });
  } else {
    /* Fallback: treat as simple entry */
    entries.push({
      account: debitAccounts[0],
      side: "debit",
      amount: totalAmount
    });
    entries.push({
      account: creditAccounts[0],
      side: "credit",
      amount: totalAmount
    });
  }

  return {
    description: description,
    entries: entries,
    analysis: Generator.buildAnalysis(template, totalAmount)
  };
};

/* Process a multi-entry template (e.g., merchandising sales with COGS).
 * These have entry_1 and entry_2 objects.
 */
Generator.processMultiEntryTemplate = function (template, accountMap) {
  var accounts = template.accounts;

  /* Generate amount 1 (selling price) */
  var amount1 = Utils.randomAmount(
    template.amountRange[0],
    template.amountRange[1],
    template.step
  );

  /* Generate amount 2 (cost) if amountRange2 exists */
  var amount2 = null;
  if (template.amountRange2) {
    var max2 = Math.min(template.amountRange2[1], amount1);
    var min2 = Math.min(template.amountRange2[0], max2);
    amount2 = Utils.randomAmount(min2, max2, template.step2 || template.step);
  }

  /* Build description with amount placeholders */
  var description = template.description;
  description = description.replace("$[AMOUNT]", Utils.formatCurrency(amount1));
  if (amount2 !== null) {
    description = description.replace("$[AMOUNT_2]", Utils.formatCurrency(amount2));
    /* Handle $[AMOUNT_3] for discount templates */
    if (description.indexOf("$[AMOUNT_3]") !== -1) {
      var discount = Math.round(amount1 * 0.02);
      description = description.replace("$[AMOUNT_3]", Utils.formatCurrency(discount));
    }
  }

  var entries = [];

  /* Entry 1 */
  var e1 = accounts.entry_1;
  var e1Debit = Array.isArray(e1.debit) ? e1.debit : [e1.debit];
  var e1Credit = Array.isArray(e1.credit) ? e1.credit : [e1.credit];

  e1Debit.forEach(function (acc) {
    entries.push({ account: acc, side: "debit", amount: amount1 });
  });
  e1Credit.forEach(function (acc) {
    entries.push({ account: acc, side: "credit", amount: amount1 });
  });

  /* Entry 2 */
  if (amount2 !== null) {
    var e2 = accounts.entry_2;
    var e2Debit = Array.isArray(e2.debit) ? e2.debit : [e2.debit];
    var e2Credit = Array.isArray(e2.credit) ? e2.credit : [e2.credit];

    e2Debit.forEach(function (acc) {
      entries.push({ account: acc, side: "debit", amount: amount2 });
    });
    e2Credit.forEach(function (acc) {
      entries.push({ account: acc, side: "credit", amount: amount2 });
    });
  }

  return {
    description: description,
    entries: entries,
    analysis: Generator.buildAnalysis(template, amount1)
  };
};
