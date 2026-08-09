/* ============================================================ */
/*  ACCT 321 — Accounting Cycle Practice Tool                   */
/*  exercise-engine.js — Full cycle engine for Random Practice  */
/*  Draws 10 random transactions, detects adjusting entries      */
/*  (≥3), computes TB → AJE → Adj TB → IS → BS → Closing → PCTB */
/* ============================================================ */

var ExerciseEngine = ExerciseEngine || {};

/* ─── Transaction Bank ──────────────────────────────────────── */
/* Patterns derived from the textbook transaction bank.          */
/* Each pattern has an `adjusting_entry_implications` array that  */
/* the engine scans to determine which AJEs are needed.          */

ExerciseEngine.TRANSACTION_BANK = [
  /* === Corporation — Merchandising === */
  {
    id: "corp_stock_issuance",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Issued common stock in exchange for $[AMOUNT] cash from investors.",
    accounts: { debit: "Cash", credit: "Common Stock" },
    amountRange: [50000, 300000], step: 5000,
    adjusting_entry_implications: [],
    explanation: "Cash increases (debit) and Common Stock increases (credit). The owners' investment grows the business.",
    analysis: {
      accounts_affected: [
        { account: "Cash", type: "Asset", change: "increase" },
        { account: "Common Stock", type: "Equity", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] = Equity +$[AMOUNT]"
    }
  },
  {
    id: "corp_bank_loan",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Obtained a loan of $[AMOUNT] from the bank by signing a note. Interest at 10% annual rate, due in 6 months.",
    accounts: { debit: "Cash", credit: "Notes Payable" },
    amountRange: [20000, 100000], step: 5000,
    adjusting_entry_implications: [{
      type: "accrued_interest",
      adjustment_type: "accrued_expense",
      account: "Notes Payable",
      debit_account: "Interest Expense",
      credit_account: "Interest Payable",
      rate: 0.10, period_months: 1,
      description_template: "Accrued interest on notes payable: $[AMOUNT] × 10% × 1/12 = $[AJE_AMOUNT].",
      reason: "Interest has accrued on the notes payable since the loan was issued. One month of interest at 10% must be recognized.",
      hint: "10% annual rate, 1 month accrued"
    }],
    explanation: "Cash increases (debit) and Notes Payable increases (credit). Borrowing creates an obligation to repay principal plus interest.",
    analysis: {
      accounts_affected: [
        { account: "Cash", type: "Asset", change: "increase" },
        { account: "Notes Payable", type: "Liability", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] = Liabilities +$[AMOUNT]"
    }
  },
  {
    id: "corp_purchase_equipment_cash",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Purchased equipment for $[AMOUNT] cash.",
    accounts: { debit: "Equipment", credit: "Cash" },
    amountRange: [5000, 50000], step: 1000,
    adjusting_entry_implications: [{
      type: "depreciation",
      adjustment_type: "depreciation",
      account: "Equipment",
      debit_account: "Depreciation Expense",
      credit_account: "Accumulated Depreciation — Equipment",
      useful_life_months: 60, residual: 0,
      description_template: "Depreciation on equipment: $[AMOUNT] ÷ 60 months = $[AJE_AMOUNT] per month.",
      reason: "Equipment must be depreciated over its useful life (5 years = 60 months). Monthly straight-line depreciation must be recognized.",
      hint: "5-year useful life, zero residual value"
    }],
    explanation: "Equipment (long-term asset) increases (debit) and Cash decreases (credit). Equipment will be depreciated over its useful life.",
    analysis: {
      accounts_affected: [
        { account: "Equipment", type: "Asset", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Equipment) − $[AMOUNT] (Cash) = No net change"
    }
  },
  {
    id: "corp_purchase_equipment_note",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "intermediate",
    description_template: "Purchased equipment at a cost of $[AMOUNT]. Cash of $[AMOUNT_2] was paid and a note payable was signed for the balance.",
    accounts: { debit: "Equipment", credit: ["Cash", "Notes Payable"] },
    amountRange: [20000, 80000], step: 2000,
    amountSplitPct: 0.25,
    adjusting_entry_implications: [
      {
        type: "depreciation",
        adjustment_type: "depreciation",
        account: "Equipment",
        debit_account: "Depreciation Expense",
        credit_account: "Accumulated Depreciation — Equipment",
        useful_life_months: 60, residual: 0,
        description_template: "Depreciation on equipment: $[AMOUNT] ÷ 60 months = $[AJE_AMOUNT] per month.",
        reason: "Equipment must be depreciated over its useful life (5 years = 60 months).",
        hint: "5-year useful life, zero residual value"
      },
      {
        type: "accrued_interest",
        adjustment_type: "accrued_expense",
        account: "Notes Payable",
        debit_account: "Interest Expense",
        credit_account: "Interest Payable",
        rate: 0.10, period_months: 1,
        description_template: "Accrued interest on notes payable: $[NOTE_AMOUNT] × 10% × 1/12 = $[AJE_AMOUNT].",
        reason: "Interest has accrued on the note payable signed for the equipment purchase.",
        hint: "10% annual rate, 1 month accrued",
        useNoteAmount: true
      }
    ],
    explanation: "Equipment increases (debit) for the full cost. Cash decreases (credit) for the down payment and Notes Payable increases (credit) for the financed portion.",
    analysis: {
      accounts_affected: [
        { account: "Equipment", type: "Asset", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" },
        { account: "Notes Payable", type: "Liability", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Equipment) − $[AMOUNT_2] (Cash) = Liabilities +($[AMOUNT] − $[AMOUNT_2]) (Notes Payable)"
    }
  },
  {
    id: "corp_purchase_inventory_account",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Purchased inventory on account at a cost of $[AMOUNT]. The company uses the perpetual inventory system.",
    accounts: { debit: "Inventory", credit: "Accounts Payable" },
    amountRange: [10000, 80000], step: 1000,
    adjusting_entry_implications: [],
    explanation: "Inventory increases (debit) and Accounts Payable increases (credit). Under perpetual inventory, inventory is recorded at cost when purchased.",
    analysis: {
      accounts_affected: [
        { account: "Inventory", type: "Asset", change: "increase" },
        { account: "Accounts Payable", type: "Liability", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] = Liabilities +$[AMOUNT]"
    }
  },
  {
    id: "corp_purchase_inventory_cash",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Purchased $[AMOUNT] of merchandise inventory for cash.",
    accounts: { debit: "Inventory", credit: "Cash" },
    amountRange: [5000, 40000], step: 500,
    adjusting_entry_implications: [],
    explanation: "Inventory increases (debit) and Cash decreases (credit). Under perpetual inventory, the Inventory account is updated immediately.",
    analysis: {
      accounts_affected: [
        { account: "Inventory", type: "Asset", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Inventory) − $[AMOUNT] (Cash) = No net change"
    }
  },
  {
    id: "corp_credit_sale",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "intermediate",
    description_template: "Sold goods to customers on account for $[AMOUNT]. The cost of the goods sold was $[AMOUNT_2].",
    accounts: {
      entry_1: { debit: "Accounts Receivable", credit: "Sales Revenue" },
      entry_2: { debit: "Cost of Goods Sold", credit: "Inventory" }
    },
    amountRange: [5000, 50000], step: 500,
    amountRange2: [3000, 35000], step2: 500,
    adjusting_entry_implications: [],
    explanation: "Two entries: (1) Accounts Receivable and Sales Revenue increase for the selling price. (2) Cost of Goods Sold and Inventory decrease for the cost.",
    analysis: {
      accounts_affected: [
        { account: "Accounts Receivable", type: "Asset", change: "increase" },
        { account: "Inventory", type: "Asset", change: "decrease" },
        { account: "Sales Revenue", type: "Revenue", change: "increase" },
        { account: "Cost of Goods Sold", type: "Expense", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] (AR) − $[AMOUNT_2] (Inv) = Equity +($[AMOUNT] − $[AMOUNT_2])"
    }
  },
  {
    id: "corp_cash_sale",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "intermediate",
    description_template: "Sold merchandise inventory costing $[AMOUNT_2] to a customer for $[AMOUNT] cash.",
    accounts: {
      entry_1: { debit: "Cash", credit: "Sales Revenue" },
      entry_2: { debit: "Cost of Goods Sold", credit: "Inventory" }
    },
    amountRange: [3000, 30000], step: 500,
    amountRange2: [2000, 20000], step2: 500,
    adjusting_entry_implications: [],
    explanation: "Two entries: (1) Cash and Sales Revenue increase for the selling price. (2) Cost of Goods Sold and Inventory decrease for the cost.",
    analysis: {
      accounts_affected: [
        { account: "Cash", type: "Asset", change: "increase" },
        { account: "Inventory", type: "Asset", change: "decrease" },
        { account: "Sales Revenue", type: "Revenue", change: "increase" },
        { account: "Cost of Goods Sold", type: "Expense", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Cash) − $[AMOUNT_2] (Inv) = Equity +($[AMOUNT] − $[AMOUNT_2])"
    }
  },
  {
    id: "corp_pay_rent_expense",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Paid $[AMOUNT] in rent on the warehouse building for the current month.",
    accounts: { debit: "Rent Expense", credit: "Cash" },
    amountRange: [2000, 10000], step: 500,
    adjusting_entry_implications: [],
    explanation: "Rent Expense increases (debit) and Cash decreases (credit). Rent is an operating expense of the current period.",
    analysis: {
      accounts_affected: [
        { account: "Rent Expense", type: "Expense", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Equity −$[AMOUNT] (via Expense)"
    }
  },
  {
    id: "corp_prepaid_insurance",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "intermediate",
    description_template: "Paid $[AMOUNT] to an insurance company for fire and liability insurance for a one-year period beginning this month.",
    accounts: { debit: "Prepaid Insurance", credit: "Cash" },
    amountRange: [3000, 12000], step: 500,
    adjusting_entry_implications: [{
      type: "prepaid_expiration",
      adjustment_type: "asset_to_expense",
      account: "Prepaid Insurance",
      debit_account: "Insurance Expense",
      credit_account: "Prepaid Insurance",
      total_months: 12, expired_months: 1,
      description_template: "Insurance expired: $[AMOUNT] ÷ 12 months = $[AJE_AMOUNT] for one month.",
      reason: "One month of the prepaid insurance has expired and must be recognized as insurance expense.",
      hint: "$[AMOUNT] ÷ 12 = monthly insurance cost"
    }],
    explanation: "Prepaid Insurance (asset) increases (debit) and Cash decreases (credit). The cost will be expensed over the policy period.",
    analysis: {
      accounts_affected: [
        { account: "Prepaid Insurance", type: "Asset", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Prepaid Insurance) − $[AMOUNT] (Cash) = No net change"
    }
  },
  {
    id: "corp_prepaid_rent",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "intermediate",
    description_template: "Paid $[AMOUNT] cash in advance for one year's rent on the store building.",
    accounts: { debit: "Prepaid Rent", credit: "Cash" },
    amountRange: [12000, 36000], step: 1000,
    adjusting_entry_implications: [{
      type: "prepaid_expiration",
      adjustment_type: "asset_to_expense",
      account: "Prepaid Rent",
      debit_account: "Rent Expense",
      credit_account: "Prepaid Rent",
      total_months: 12, expired_months: 1,
      description_template: "Rent expired: $[AMOUNT] ÷ 12 months = $[AJE_AMOUNT] for one month.",
      reason: "One month of the prepaid rent has expired and must be recognized as rent expense.",
      hint: "$[AMOUNT] ÷ 12 = monthly rent cost"
    }],
    explanation: "Prepaid Rent (asset) increases (debit) and Cash decreases (credit). Rent expense will be recognized monthly as the prepaid amount expires.",
    analysis: {
      accounts_affected: [
        { account: "Prepaid Rent", type: "Asset", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Prepaid Rent) − $[AMOUNT] (Cash) = No net change"
    }
  },
  {
    id: "corp_pay_account_payable",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Paid $[AMOUNT] on account for inventory previously purchased.",
    accounts: { debit: "Accounts Payable", credit: "Cash" },
    amountRange: [5000, 60000], step: 1000,
    adjusting_entry_implications: [],
    explanation: "Accounts Payable decreases (debit) and Cash decreases (credit). Paying a liability reduces both the obligation and cash.",
    analysis: {
      accounts_affected: [
        { account: "Accounts Payable", type: "Liability", change: "decrease" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Liabilities −$[AMOUNT]"
    }
  },
  {
    id: "corp_collect_receivable",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Collected $[AMOUNT] cash from customers on account.",
    accounts: { debit: "Cash", credit: "Accounts Receivable" },
    amountRange: [3000, 40000], step: 500,
    adjusting_entry_implications: [],
    explanation: "Cash increases (debit) and Accounts Receivable decreases (credit). No revenue is recorded — it was recorded at the time of sale.",
    analysis: {
      accounts_affected: [
        { account: "Cash", type: "Asset", change: "increase" },
        { account: "Accounts Receivable", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Cash) − $[AMOUNT] (AR) = No net change"
    }
  },
  {
    id: "corp_pay_salaries",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Paid $[AMOUNT] cash for employee salaries for the first half of the month.",
    accounts: { debit: "Salaries Expense", credit: "Cash" },
    amountRange: [3000, 12000], step: 500,
    adjusting_entry_implications: [{
      type: "accrued_salaries",
      adjustment_type: "accrued_expense",
      account: "Salaries Expense",
      debit_account: "Salaries Expense",
      credit_account: "Salaries Payable",
      pct_of_amount: 0.80,
      description_template: "Employees earned salaries in the second half of the month that have not yet been paid. Accrued salaries = $[AJE_AMOUNT].",
      reason: "Salaries earned by employees in the second half of the month must be recognized as an expense even though payment will occur next month.",
      hint: "Second half of month salaries unpaid"
    }],
    explanation: "Salaries Expense increases (debit) and Cash decreases (credit). Salaries are an operating expense.",
    analysis: {
      accounts_affected: [
        { account: "Salaries Expense", type: "Expense", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Equity −$[AMOUNT] (via Expense)"
    }
  },
  {
    id: "corp_purchase_supplies_cash",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Purchased $[AMOUNT] of office supplies for cash.",
    accounts: { debit: "Supplies", credit: "Cash" },
    amountRange: [1000, 5000], step: 100,
    adjusting_entry_implications: [{
      type: "supplies_used",
      adjustment_type: "asset_to_expense",
      account: "Supplies",
      debit_account: "Supplies Expense",
      credit_account: "Supplies",
      pct_remaining: 0.40,
      description_template: "Physical count reveals $[REMAINING] of supplies remain on hand. Supplies used = $[AMOUNT] − $[REMAINING] = $[AJE_AMOUNT].",
      reason: "Supplies were purchased but some have been consumed during the period. A physical count shows remaining supplies on hand.",
      hint: "Physical count on period end reveals remaining supplies"
    }],
    explanation: "Supplies (asset) increases (debit) and Cash decreases (credit). Supplies are an asset at purchase — they become an expense only when consumed.",
    analysis: {
      accounts_affected: [
        { account: "Supplies", type: "Asset", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Supplies) − $[AMOUNT] (Cash) = No net change"
    }
  },
  {
    id: "corp_pay_dividends",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Paid $[AMOUNT] cash dividends to shareholders.",
    accounts: { debit: "Dividends", credit: "Cash" },
    amountRange: [500, 5000], step: 100,
    adjusting_entry_implications: [],
    explanation: "Dividends (contra-equity) increases (debit) and Cash decreases (credit). Dividends reduce retained earnings but are NOT an expense.",
    analysis: {
      accounts_affected: [
        { account: "Dividends", type: "Equity (Contra)", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Equity −$[AMOUNT] (via Dividends)"
    }
  },
  {
    id: "corp_pay_utilities",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "beginner",
    description_template: "Paid $[AMOUNT] to the local utility company for the current month's gas and electricity.",
    accounts: { debit: "Utilities Expense", credit: "Cash" },
    amountRange: [500, 3000], step: 100,
    adjusting_entry_implications: [],
    explanation: "Utilities Expense increases (debit) and Cash decreases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Utilities Expense", type: "Expense", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Equity −$[AMOUNT] (via Expense)"
    }
  },
  {
    id: "corp_unearned_revenue",
    entity_type: "corporation",
    business_type: "merchandising",
    difficulty: "intermediate",
    description_template: "Received $[AMOUNT] in advance from a customer for services to be performed next month.",
    accounts: { debit: "Cash", credit: "Unearned Revenue" },
    amountRange: [1000, 8000], step: 500,
    adjusting_entry_implications: [{
      type: "unearned_earned",
      adjustment_type: "liability_to_revenue",
      account: "Unearned Revenue",
      debit_account: "Unearned Revenue",
      credit_account: "Service Revenue",
      pct_earned: 0.50,
      description_template: "Portion of unearned revenue has been earned: $[AMOUNT] × 50% = $[AJE_AMOUNT].",
      reason: "Cash was received in advance for services. By period-end, a portion of the service has been provided, so that amount must be recognized as revenue.",
      hint: "Half of the advance payment has been earned by period-end"
    }],
    explanation: "Cash increases (debit) and Unearned Revenue (liability) increases (credit). Revenue is NOT recorded yet — it will be recorded as the service is provided.",
    analysis: {
      accounts_affected: [
        { account: "Cash", type: "Asset", change: "increase" },
        { account: "Unearned Revenue", type: "Liability", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] = Liabilities +$[AMOUNT]"
    }
  },

  /* === Corporation — Service === */
  {
    id: "svc_stock_issuance",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "beginner",
    description_template: "Issued common stock in exchange for $[AMOUNT] cash from investors.",
    accounts: { debit: "Cash", credit: "Common Stock" },
    amountRange: [40000, 200000], step: 5000,
    adjusting_entry_implications: [],
    explanation: "Cash increases (debit) and Common Stock increases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Cash", type: "Asset", change: "increase" },
        { account: "Common Stock", type: "Equity", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] = Equity +$[AMOUNT]"
    }
  },
  {
    id: "svc_bank_loan",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "beginner",
    description_template: "Obtained a loan of $[AMOUNT] from the bank by signing a note. Interest at 12% annual rate.",
    accounts: { debit: "Cash", credit: "Notes Payable" },
    amountRange: [20000, 80000], step: 5000,
    adjusting_entry_implications: [{
      type: "accrued_interest",
      adjustment_type: "accrued_expense",
      account: "Notes Payable",
      debit_account: "Interest Expense",
      credit_account: "Interest Payable",
      rate: 0.12, period_months: 1,
      description_template: "Accrued interest on notes payable: $[AMOUNT] × 12% × 1/12 = $[AJE_AMOUNT].",
      reason: "Interest has accrued on the notes payable. One month of interest at 12% must be recognized.",
      hint: "12% annual rate, 1 month accrued"
    }],
    explanation: "Cash increases (debit) and Notes Payable increases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Cash", type: "Asset", change: "increase" },
        { account: "Notes Payable", type: "Liability", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] = Liabilities +$[AMOUNT]"
    }
  },
  {
    id: "svc_cash_revenue",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "beginner",
    description_template: "Provided services of $[AMOUNT] to customers. All customers paid cash.",
    accounts: { debit: "Cash", credit: "Service Revenue" },
    amountRange: [2000, 15000], step: 500,
    adjusting_entry_implications: [],
    explanation: "Cash increases (debit) and Service Revenue increases (credit). Revenue is recorded when earned, and cash is received at the same time.",
    analysis: {
      accounts_affected: [
        { account: "Cash", type: "Asset", change: "increase" },
        { account: "Service Revenue", type: "Revenue", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] = Equity +$[AMOUNT] (via Revenue)"
    }
  },
  {
    id: "svc_credit_revenue",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "intermediate",
    description_template: "Provided services of $[AMOUNT] to customers on account.",
    accounts: { debit: "Accounts Receivable", credit: "Service Revenue" },
    amountRange: [2000, 15000], step: 500,
    adjusting_entry_implications: [],
    explanation: "Accounts Receivable increases (debit) and Service Revenue increases (credit). Revenue is earned even though cash hasn't been collected.",
    analysis: {
      accounts_affected: [
        { account: "Accounts Receivable", type: "Asset", change: "increase" },
        { account: "Service Revenue", type: "Revenue", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] = Equity +$[AMOUNT] (via Revenue)"
    }
  },
  {
    id: "svc_purchase_supplies_account",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "intermediate",
    description_template: "Purchased supplies of $[AMOUNT] on account.",
    accounts: { debit: "Supplies", credit: "Accounts Payable" },
    amountRange: [1000, 6000], step: 100,
    adjusting_entry_implications: [{
      type: "supplies_used",
      adjustment_type: "asset_to_expense",
      account: "Supplies",
      debit_account: "Supplies Expense",
      credit_account: "Supplies",
      pct_remaining: 0.40,
      description_template: "Physical count reveals $[REMAINING] of supplies remain. Supplies used = $[AMOUNT] − $[REMAINING] = $[AJE_AMOUNT].",
      reason: "Supplies were purchased but some have been consumed. A physical count shows remaining supplies.",
      hint: "Physical count on period end reveals remaining supplies"
    }],
    explanation: "Supplies (asset) increases (debit) and Accounts Payable (liability) increases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Supplies", type: "Asset", change: "increase" },
        { account: "Accounts Payable", type: "Liability", change: "increase" }
      ],
      equation_impact: "Assets +$[AMOUNT] = Liabilities +$[AMOUNT]"
    }
  },
  {
    id: "svc_purchase_equipment_cash",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "beginner",
    description_template: "Purchased equipment for $[AMOUNT] cash.",
    accounts: { debit: "Equipment", credit: "Cash" },
    amountRange: [5000, 40000], step: 1000,
    adjusting_entry_implications: [{
      type: "depreciation",
      adjustment_type: "depreciation",
      account: "Equipment",
      debit_account: "Depreciation Expense",
      credit_account: "Accumulated Depreciation — Equipment",
      useful_life_months: 60, residual: 0,
      description_template: "Depreciation on equipment: $[AMOUNT] ÷ 60 months = $[AJE_AMOUNT] per month.",
      reason: "Equipment must be depreciated over its useful life (5 years = 60 months).",
      hint: "5-year useful life, zero residual value"
    }],
    explanation: "Equipment (asset) increases (debit) and Cash decreases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Equipment", type: "Asset", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Equipment) − $[AMOUNT] (Cash) = No net change"
    }
  },
  {
    id: "svc_pay_salaries",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "beginner",
    description_template: "Paid employees $[AMOUNT] for work performed during the month.",
    accounts: { debit: "Salaries Expense", credit: "Cash" },
    amountRange: [1000, 8000], step: 500,
    adjusting_entry_implications: [{
      type: "accrued_salaries",
      adjustment_type: "accrued_expense",
      account: "Salaries Expense",
      debit_account: "Salaries Expense",
      credit_account: "Salaries Payable",
      pct_of_amount: 0.50,
      description_template: "Employees earned additional salaries of $[AJE_AMOUNT] that have not yet been paid.",
      reason: "Additional salaries earned by employees at period-end must be recognized even though payment will occur next month.",
      hint: "Accrued salaries at period-end"
    }],
    explanation: "Salaries Expense increases (debit) and Cash decreases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Salaries Expense", type: "Expense", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Equity −$[AMOUNT] (via Expense)"
    }
  },
  {
    id: "svc_pay_advertising",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "beginner",
    description_template: "Paid $[AMOUNT] for advertising in a local newspaper.",
    accounts: { debit: "Advertising Expense", credit: "Cash" },
    amountRange: [200, 2000], step: 50,
    adjusting_entry_implications: [],
    explanation: "Advertising Expense increases (debit) and Cash decreases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Advertising Expense", type: "Expense", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Equity −$[AMOUNT] (via Expense)"
    }
  },
  {
    id: "svc_pay_utilities",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "beginner",
    description_template: "Paid a utility bill of $[AMOUNT] for the current month.",
    accounts: { debit: "Utilities Expense", credit: "Cash" },
    amountRange: [500, 3000], step: 100,
    adjusting_entry_implications: [],
    explanation: "Utilities Expense increases (debit) and Cash decreases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Utilities Expense", type: "Expense", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Equity −$[AMOUNT] (via Expense)"
    }
  },
  {
    id: "svc_pay_dividends",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "beginner",
    description_template: "Paid dividends of $[AMOUNT] to shareholders.",
    accounts: { debit: "Dividends", credit: "Cash" },
    amountRange: [500, 3000], step: 100,
    adjusting_entry_implications: [],
    explanation: "Dividends (contra-equity) increases (debit) and Cash decreases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Dividends", type: "Equity (Contra)", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Equity −$[AMOUNT] (via Dividends)"
    }
  },
  {
    id: "svc_collect_receivable",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "intermediate",
    description_template: "Collected $[AMOUNT] cash from customers for services previously billed.",
    accounts: { debit: "Cash", credit: "Accounts Receivable" },
    amountRange: [1000, 12000], step: 500,
    adjusting_entry_implications: [],
    explanation: "Cash increases (debit) and Accounts Receivable decreases (credit). No revenue is recorded — it was recorded when the service was performed.",
    analysis: {
      accounts_affected: [
        { account: "Cash", type: "Asset", change: "increase" },
        { account: "Accounts Receivable", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Cash) − $[AMOUNT] (AR) = No net change"
    }
  },
  {
    id: "svc_pay_account_payable",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "intermediate",
    description_template: "Paid $[AMOUNT] cash to a supplier for supplies previously purchased on account.",
    accounts: { debit: "Accounts Payable", credit: "Cash" },
    amountRange: [500, 6000], step: 100,
    adjusting_entry_implications: [],
    explanation: "Accounts Payable decreases (debit) and Cash decreases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Accounts Payable", type: "Liability", change: "decrease" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets −$[AMOUNT] = Liabilities −$[AMOUNT]"
    }
  },
  {
    id: "svc_prepaid_insurance",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "intermediate",
    description_template: "Paid $[AMOUNT] cash for a one-year insurance policy.",
    accounts: { debit: "Prepaid Insurance", credit: "Cash" },
    amountRange: [2400, 8000], step: 200,
    adjusting_entry_implications: [{
      type: "prepaid_expiration",
      adjustment_type: "asset_to_expense",
      account: "Prepaid Insurance",
      debit_account: "Insurance Expense",
      credit_account: "Prepaid Insurance",
      total_months: 12, expired_months: 1,
      description_template: "Insurance expired: $[AMOUNT] ÷ 12 months = $[AJE_AMOUNT] for one month.",
      reason: "One month of the prepaid insurance has expired and must be recognized as insurance expense.",
      hint: "$[AMOUNT] ÷ 12 = monthly insurance cost"
    }],
    explanation: "Prepaid Insurance (asset) increases (debit) and Cash decreases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Prepaid Insurance", type: "Asset", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Prepaid Insurance) − $[AMOUNT] (Cash) = No net change"
    }
  },
  {
    id: "svc_prepaid_rent",
    entity_type: "corporation",
    business_type: "service",
    difficulty: "intermediate",
    description_template: "Paid $[AMOUNT] cash for three months' rent in advance.",
    accounts: { debit: "Prepaid Rent", credit: "Cash" },
    amountRange: [3000, 15000], step: 500,
    adjusting_entry_implications: [{
      type: "prepaid_expiration",
      adjustment_type: "asset_to_expense",
      account: "Prepaid Rent",
      debit_account: "Rent Expense",
      credit_account: "Prepaid Rent",
      total_months: 3, expired_months: 1,
      description_template: "Rent expired: $[AMOUNT] ÷ 3 months = $[AJE_AMOUNT] for one month.",
      reason: "One month of the prepaid rent has expired and must be recognized as rent expense.",
      hint: "$[AMOUNT] ÷ 3 = monthly rent cost"
    }],
    explanation: "Prepaid Rent (asset) increases (debit) and Cash decreases (credit).",
    analysis: {
      accounts_affected: [
        { account: "Prepaid Rent", type: "Asset", change: "increase" },
        { account: "Cash", type: "Asset", change: "decrease" }
      ],
      equation_impact: "Assets +$[AMOUNT] (Prepaid Rent) − $[AMOUNT] (Cash) = No net change"
    }
  }
];

/* ─── Company Name Pool ─────────────────────────────────────── */
ExerciseEngine.COMPANY_NAMES = [
  "Acme Apparel Co.", "BlueRidge Supply Co.", "Clover Leaf Trading Co.",
  "Delta Distribution Inc.", "Evergreen Goods Corp.", "Fairview Products Co.",
  "Granite State Wholesale", "Harbor Light Merchandising", "Ironwood Trading Corp.",
  "Juniper Ridge Supply Co.", "Keystone Apparel Inc.", "Lakeside Products Corp."
];

/* ─── Account type lookup (filled from COA at runtime) ──────── */
ExerciseEngine.accountTypeMap = {};

/* ─── Helpers ───────────────────────────────────────────────── */

ExerciseEngine.randomInt = function (min, max, step) {
  var steps = Math.floor((max - min) / step);
  if (steps < 1) { return min; }
  return min + Math.floor(Math.random() * (steps + 1)) * step;
};

ExerciseEngine.shuffle = function (arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
};

ExerciseEngine.formatCurrency = function (amount) {
  if (Number.isInteger(amount)) { return "$" + amount.toLocaleString(); }
  return "$" + amount.toFixed(2);
};

/* Get account type from COA name */
ExerciseEngine.getAccountType = function (accountName) {
  return ExerciseEngine.accountTypeMap[accountName] || "Asset";
};

/* Determine if an account is a contra account */
ExerciseEngine.isContra = function (accountName) {
  var t = ExerciseEngine.getAccountType(accountName);
  return t.indexOf("Contra") !== -1 || t.indexOf("Temporary") !== -1;
};

/* Determine if an account is temporary (closed at period end) */
ExerciseEngine.isTemporary = function (accountName) {
  var t = ExerciseEngine.getAccountType(accountName);
  var base = t.split(" ")[0];
  return base === "Revenue" || base === "Expense" || accountName === "Dividends" || accountName === "Income Summary";
};

/* Determine if an account has a debit normal balance */
ExerciseEngine.isDebitNormal = function (accountName) {
  var t = ExerciseEngine.getAccountType(accountName);
  return t.indexOf("Debit") !== -1;
};

/* ─── Transaction Processing ────────────────────────────────── */

ExerciseEngine.processTransaction = function (pattern) {
  var tx = {
    id: 0,
    ref: "T",
    description: "",
    entries: [],
    analysis: { accounts_affected: [], equation_impact: "" },
    explanation: pattern.explanation || "",
    _pattern: pattern,
    _amounts: {}
  };

  var accounts = pattern.accounts;
  var amount = ExerciseEngine.randomInt(pattern.amountRange[0], pattern.amountRange[1], pattern.step);
  tx._amounts.amount = amount;

  /* Multi-entry (merchandising sale with COGS) */
  if (accounts.entry_1 && accounts.entry_2) {
    var amount2 = ExerciseEngine.randomInt(
      pattern.amountRange2[0],
      Math.min(pattern.amountRange2[1], amount),
      pattern.step2 || pattern.step
    );
    tx._amounts.amount2 = amount2;

    tx.description = pattern.description_template
      .replace("$[AMOUNT]", ExerciseEngine.formatCurrency(amount))
      .replace("$[AMOUNT_2]", ExerciseEngine.formatCurrency(amount2));

    var e1 = accounts.entry_1;
    tx.entries.push({ account: e1.debit, side: "debit", amount: amount });
    tx.entries.push({ account: e1.credit, side: "credit", amount: amount });

    var e2 = accounts.entry_2;
    tx.entries.push({ account: e2.debit, side: "debit", amount: amount2 });
    tx.entries.push({ account: e2.credit, side: "credit", amount: amount2 });

  } else if (Array.isArray(accounts.credit)) {
    /* Compound: one debit, multiple credits (e.g., equipment + note) */
    var cashPortion = Math.round(amount * (pattern.amountSplitPct || 0.25) / pattern.step) * pattern.step;
    if (cashPortion < pattern.step) { cashPortion = pattern.step; }
    var notePortion = amount - cashPortion;
    tx._amounts.amount2 = cashPortion;
    tx._amounts.noteAmount = notePortion;

    tx.description = pattern.description_template
      .replace("$[AMOUNT]", ExerciseEngine.formatCurrency(amount))
      .replace("$[AMOUNT_2]", ExerciseEngine.formatCurrency(cashPortion));

    tx.entries.push({ account: accounts.debit, side: "debit", amount: amount });
    tx.entries.push({ account: accounts.credit[0], side: "credit", amount: cashPortion });
    tx.entries.push({ account: accounts.credit[1], side: "credit", amount: notePortion });

  } else {
    /* Simple 2-account entry */
    tx.description = pattern.description_template.replace("$[AMOUNT]", ExerciseEngine.formatCurrency(amount));
    tx.entries.push({ account: accounts.debit, side: "debit", amount: amount });
    tx.entries.push({ account: accounts.credit, side: "credit", amount: amount });
  }

  /* Build analysis */
  if (pattern.analysis) {
    tx.analysis.accounts_affected = pattern.analysis.accounts_affected.map(function (acc) {
      return {
        account: acc.account,
        type: acc.type,
        change: acc.change,
        amount: acc.account === "Inventory" && tx._amounts.amount2 ? tx._amounts.amount2 :
               acc.account === "Cost of Goods Sold" && tx._amounts.amount2 ? tx._amounts.amount2 :
               acc.account === "Cash" && tx._amounts.amount2 && accounts.credit && Array.isArray(accounts.credit) ? tx._amounts.amount2 :
               amount
      };
    });
    tx.analysis.equation_impact = pattern.analysis.equation_impact
      .replace(/\$\[AMOUNT\]/g, ExerciseEngine.formatCurrency(amount))
      .replace(/\$\[AMOUNT_2\]/g, ExerciseEngine.formatCurrency(tx._amounts.amount2 || amount));
  }

  return tx;
};

/* ─── Adjusting Entry Generation ─────────────────────────────── */

ExerciseEngine.generateAdjustingEntry = function (implication, tx, txIndex) {
  var amount = tx._amounts.amount;
  var ajeAmount = 0;
  var desc = "";

  switch (implication.type) {
    case "depreciation":
      ajeAmount = Math.round(amount / implication.useful_life_months);
      if (ajeAmount < 1) { ajeAmount = 1; }
      desc = implication.description_template
        .replace("$[AMOUNT]", ExerciseEngine.formatCurrency(amount))
        .replace("$[AJE_AMOUNT]", ExerciseEngine.formatCurrency(ajeAmount));
      break;

    case "accrued_interest":
      var principal = implication.useNoteAmount ? (tx._amounts.noteAmount || amount) : amount;
      ajeAmount = Math.round(principal * implication.rate * implication.period_months / 12);
      if (ajeAmount < 1) { ajeAmount = 1; }
      desc = implication.description_template
        .replace("$[AMOUNT]", ExerciseEngine.formatCurrency(principal))
        .replace("$[NOTE_AMOUNT]", ExerciseEngine.formatCurrency(tx._amounts.noteAmount || amount))
        .replace("$[AJE_AMOUNT]", ExerciseEngine.formatCurrency(ajeAmount));
      break;

    case "prepaid_expiration":
      ajeAmount = Math.round(amount / implication.total_months * implication.expired_months);
      if (ajeAmount < 1) { ajeAmount = 1; }
      desc = implication.description_template
        .replace("$[AMOUNT]", ExerciseEngine.formatCurrency(amount))
        .replace("$[AJE_AMOUNT]", ExerciseEngine.formatCurrency(ajeAmount));
      break;

    case "supplies_used":
      var remaining = Math.round(amount * implication.pct_remaining);
      ajeAmount = amount - remaining;
      if (ajeAmount < 1) { ajeAmount = 1; }
      desc = implication.description_template
        .replace("$[AMOUNT]", ExerciseEngine.formatCurrency(amount))
        .replace("$[REMAINING]", ExerciseEngine.formatCurrency(remaining))
        .replace("$[AJE_AMOUNT]", ExerciseEngine.formatCurrency(ajeAmount));
      break;

    case "accrued_salaries":
      ajeAmount = Math.round(amount * implication.pct_of_amount);
      if (ajeAmount < 1) { ajeAmount = 1; }
      desc = implication.description_template
        .replace("$[AMOUNT]", ExerciseEngine.formatCurrency(amount))
        .replace("$[AJE_AMOUNT]", ExerciseEngine.formatCurrency(ajeAmount));
      break;

    case "unearned_earned":
      ajeAmount = Math.round(amount * implication.pct_earned);
      if (ajeAmount < 1) { ajeAmount = 1; }
      desc = implication.description_template
        .replace("$[AMOUNT]", ExerciseEngine.formatCurrency(amount))
        .replace("$[AJE_AMOUNT]", ExerciseEngine.formatCurrency(ajeAmount));
      break;
  }

  return {
    id: txIndex,
    ref: "A" + txIndex,
    description: desc,
    entries: [
      { account: implication.debit_account, side: "debit", amount: ajeAmount },
      { account: implication.credit_account, side: "credit", amount: ajeAmount }
    ],
    analysis: {
      accounts_affected: [
        { account: implication.debit_account, type: ExerciseEngine.getAccountType(implication.debit_account), change: "increase", amount: ajeAmount },
        { account: implication.credit_account, type: ExerciseEngine.getAccountType(implication.credit_account), change: "decrease", amount: ajeAmount }
      ],
      equation_impact: "Assets −" + ExerciseEngine.formatCurrency(ajeAmount) + " = Equity −" + ExerciseEngine.formatCurrency(ajeAmount) + " (via Expense)"
    },
    explanation: "Adjusting entries never involve the Cash account.",
    _signal: {
      account: implication.account,
      balance: amount,
      adjustment_type: implication.adjustment_type,
      type_label: ExerciseEngine.signalTypeLabel(implication.adjustment_type),
      reason: implication.reason.replace(/\$\[AMOUNT\]/g, ExerciseEngine.formatCurrency(amount)),
      hint: implication.hint ? implication.hint.replace(/\$\[AMOUNT\]/g, ExerciseEngine.formatCurrency(amount)) : ""
    },
    _ajeAmount: ajeAmount
  };
};

ExerciseEngine.signalTypeLabel = function (adjustment_type) {
  var labels = {
    "asset_to_expense": "Asset → Expense (consumption)",
    "depreciation": "Depreciation (cost allocation)",
    "liability_to_revenue": "Liability → Revenue (earned)",
    "accrued_expense": "Accrued Expense (unpaid)"
  };
  return labels[adjustment_type] || adjustment_type;
};

/* ─── Trial Balance Computation ─────────────────────────────── */

ExerciseEngine.computeTrialBalance = function (transactions) {
  var ledger = {};

  transactions.forEach(function (tx) {
    tx.entries.forEach(function (entry) {
      if (!ledger[entry.account]) { ledger[entry.account] = { debit: 0, credit: 0 }; }
      if (entry.side === "debit") {
        ledger[entry.account].debit += entry.amount;
      } else {
        ledger[entry.account].credit += entry.amount;
      }
    });
  });

  var tb = [];
  var totalDebit = 0, totalCredit = 0;

  Object.keys(ledger).sort().forEach(function (account) {
    var bal = ledger[account];
    var netDebit = bal.debit - bal.credit;
    var dr, cr;

    if (netDebit > 0) {
      dr = netDebit; cr = 0;
      totalDebit += netDebit;
    } else if (netDebit < 0) {
      dr = 0; cr = -netDebit;
      totalCredit += -netDebit;
    } else {
      dr = 0; cr = 0;
    }

    tb.push({ account: account, debit: dr, credit: cr });
  });

  return { rows: tb, totalDebit: totalDebit, totalCredit: totalCredit };
};

/* Merge two trial balances (for applying AJEs to unadjusted TB) */
ExerciseEngine.mergeTB = function (tb1, tb2) {
  var merged = {};
  function addTB(tb) {
    tb.forEach(function (row) {
      if (!merged[row.account]) { merged[row.account] = { debit: 0, credit: 0 }; }
      merged[row.account].debit += row.debit;
      merged[row.account].credit += row.credit;
    });
  }
  addTB(tb1);
  addTB(tb2);

  var result = [];
  var totalDebit = 0, totalCredit = 0;

  Object.keys(merged).sort().forEach(function (account) {
    var bal = merged[account];
    var netDebit = bal.debit - bal.credit;
    var dr, cr;
    if (netDebit > 0) { dr = netDebit; cr = 0; totalDebit += netDebit; }
    else if (netDebit < 0) { dr = 0; cr = -netDebit; totalCredit += -netDebit; }
    else { dr = 0; cr = 0; }
    result.push({ account: account, debit: dr, credit: cr });
  });

  return { rows: result, totalDebit: totalDebit, totalCredit: totalCredit };
};

/* ─── Financial Statement Computation ───────────────────────── */

ExerciseEngine.computeIncomeStatement = function (adjustedTB) {
  var revenues = [];
  var expenses = [];
  var totalRevenue = 0, totalExpenses = 0;

  adjustedTB.forEach(function (row) {
    var type = ExerciseEngine.getAccountType(row.account);
    var base = type.split(" ")[0];
    var amount = row.debit > 0 ? row.debit : row.credit;

    if (base === "Revenue") {
      if (row.credit > 0) {
        revenues.push({ account: row.account, amount: row.credit });
        totalRevenue += row.credit;
      }
      if (row.debit > 0) {
        /* Contra-revenue (e.g., Sales Discounts) */
        expenses.push({ account: row.account, amount: row.debit });
        totalExpenses += row.debit;
      }
    } else if (base === "Expense" || base === "Loss") {
      expenses.push({ account: row.account, amount: row.debit });
      totalExpenses += row.debit;
    } else if (base === "Gain") {
      revenues.push({ account: row.account, amount: row.credit });
      totalRevenue += row.credit;
    }
  });

  var netIncome = totalRevenue - totalExpenses;
  return { revenues: revenues, total_revenue: totalRevenue, expenses: expenses, total_expenses: totalExpenses, net_income: netIncome };
};

ExerciseEngine.computeBalanceSheet = function (adjustedTB, netIncome) {
  var assets = [], liabilities = [], equity = [];
  var totalAssets = 0, totalLiabilities = 0, totalEquity = 0;

  adjustedTB.forEach(function (row) {
    var type = ExerciseEngine.getAccountType(row.account);
    var base = type.split(" ")[0];
    var isContra = type.indexOf("Contra") !== -1;
    /* Net balance: for assets, positive = debit; for liabilities/equity, positive = credit */
    var netAsset = row.debit - row.credit;
    var netLiability = row.credit - row.debit;
    var netEquity = row.credit - row.debit;

    if (base === "Asset") {
      if (isContra) {
        assets.push({ account: "Less: " + row.account, amount: -row.credit });
        totalAssets -= row.credit;
      } else {
        assets.push({ account: row.account, amount: netAsset });
        totalAssets += netAsset;
      }
    } else if (base === "Liability") {
      liabilities.push({ account: row.account, amount: netLiability });
      totalLiabilities += netLiability;
    } else if (base === "Equity") {
      if (row.account === "Dividends" || row.account === "Income Summary") {
        /* Handled below */
      } else if (row.account === "Retained Earnings") {
        equity.push({ account: row.account, amount: netEquity });
        totalEquity += netEquity;
      } else {
        equity.push({ account: row.account, amount: netEquity });
        totalEquity += netEquity;
      }
    }
    /* Revenue and Expense accounts are NOT on the BS — they flow to RE via net income */
  });

  /* Add net income to equity (flows to Retained Earnings via closing) */
  if (netIncome !== 0) {
    equity.push({ account: "Net Income (to Retained Earnings)", amount: netIncome });
    totalEquity += netIncome;
  }

  /* Subtract dividends from equity (flows to Retained Earnings via closing) */
  var divRow = adjustedTB.find(function (r) { return r.account === "Dividends"; });
  if (divRow && divRow.debit > 0) {
    equity.push({ account: "Less: Dividends", amount: -divRow.debit });
    totalEquity -= divRow.debit;
  }

  return {
    assets: assets, total_assets: totalAssets,
    liabilities: liabilities, total_liabilities: totalLiabilities,
    equity: equity, total_equity: totalEquity,
    total_liabilities_equity: totalLiabilities + totalEquity
  };
};

/* ─── Closing Entries Computation ────────────────────────────── */

ExerciseEngine.computeClosingEntries = function (adjustedTB, incomeStatement) {
  var closingEntries = [];
  var revenues = incomeStatement.revenues.filter(function (r) {
    var type = ExerciseEngine.getAccountType(r.account);
    return type.split(" ")[0] === "Revenue" || type.split(" ")[0] === "Gain";
  });
  var contraRevenues = incomeStatement.expenses.filter(function (e) {
    var type = ExerciseEngine.getAccountType(e.account);
    return type.split(" ")[0] === "Revenue";
  });
  var expenses = incomeStatement.expenses.filter(function (e) {
    var type = ExerciseEngine.getAccountType(e.account);
    var base = type.split(" ")[0];
    return base === "Expense" || base === "Loss";
  });

  /* C1: Close revenue accounts to Income Summary */
  var c1Entries = [];
  var totalRev = 0;
  revenues.forEach(function (r) {
    c1Entries.push({ account: r.account, side: "debit", amount: r.amount });
    totalRev += r.amount;
  });
  c1Entries.push({ account: "Income Summary", side: "credit", amount: totalRev });
  closingEntries.push({
    id: 1, ref: "C1",
    description: "Close all revenue accounts to Income Summary. Total Revenue = " + ExerciseEngine.formatCurrency(totalRev) + ".",
    entries: c1Entries,
    analysis: {
      accounts_affected: revenues.map(function (r) {
        return { account: r.account, type: "Revenue", change: "decrease", amount: r.amount };
      }).concat([{ account: "Income Summary", type: "Equity (Temporary)", change: "increase", amount: totalRev }]),
      equation_impact: "Revenue accounts close to zero. Income Summary increases by " + ExerciseEngine.formatCurrency(totalRev) + "."
    },
    explanation: "Closing revenue accounts means debiting them to zero and crediting the total to Income Summary."
  });

  /* C2: Close expense accounts to Income Summary */
  var c2Entries = [];
  var totalExp = 0;
  c2Entries.push({ account: "Income Summary", side: "debit", amount: incomeStatement.total_expenses });
  expenses.forEach(function (e) {
    c2Entries.push({ account: e.account, side: "credit", amount: e.amount });
    totalExp += e.amount;
  });
  closingEntries.push({
    id: 2, ref: "C2",
    description: "Close all expense accounts to Income Summary. Total Expenses = " + ExerciseEngine.formatCurrency(totalExp) + ".",
    entries: c2Entries,
    analysis: {
      accounts_affected: [{ account: "Income Summary", type: "Equity (Temporary)", change: "decrease", amount: totalExp }].concat(
        expenses.map(function (e) {
          return { account: e.account, type: "Expense", change: "decrease", amount: e.amount };
        })
      ),
      equation_impact: "Expense accounts close to zero. Income Summary decreases by " + ExerciseEngine.formatCurrency(totalExp) + "."
    },
    explanation: "Closing expense accounts means crediting them to zero and debiting Income Summary."
  });

  /* C3: Close Income Summary (net income) to Retained Earnings */
  var netIncome = incomeStatement.net_income;
  closingEntries.push({
    id: 3, ref: "C3",
    description: "Close Income Summary to Retained Earnings. Net Income = " + ExerciseEngine.formatCurrency(netIncome) + ".",
    entries: [
      { account: "Income Summary", side: netIncome >= 0 ? "debit" : "credit", amount: Math.abs(netIncome) },
      { account: "Retained Earnings", side: netIncome >= 0 ? "credit" : "debit", amount: Math.abs(netIncome) }
    ],
    analysis: {
      accounts_affected: [
        { account: "Income Summary", type: "Equity (Temporary)", change: "decrease", amount: Math.abs(netIncome) },
        { account: "Retained Earnings", type: "Equity", change: "increase", amount: Math.abs(netIncome) }
      ],
      equation_impact: "Income Summary closes to zero. Retained Earnings increases by " + ExerciseEngine.formatCurrency(Math.abs(netIncome)) + "."
    },
    explanation: "The net income for the period is transferred from Income Summary to Retained Earnings."
  });

  /* C4: Close Dividends to Retained Earnings (if dividends exist) */
  var dividendsAccount = adjustedTB.find(function (r) { return r.account === "Dividends"; });
  if (dividendsAccount && dividendsAccount.debit > 0) {
    var divAmount = dividendsAccount.debit;
    closingEntries.push({
      id: 4, ref: "C4",
      description: "Close Dividends to Retained Earnings. Dividends = " + ExerciseEngine.formatCurrency(divAmount) + ".",
      entries: [
        { account: "Retained Earnings", side: "debit", amount: divAmount },
        { account: "Dividends", side: "credit", amount: divAmount }
      ],
      analysis: {
        accounts_affected: [
          { account: "Retained Earnings", type: "Equity", change: "decrease", amount: divAmount },
          { account: "Dividends", type: "Equity (Contra)", change: "decrease", amount: divAmount }
        ],
        equation_impact: "Dividends closes to zero. Retained Earnings decreases by " + ExerciseEngine.formatCurrency(divAmount) + "."
      },
      explanation: "Dividends is a contra-equity account. Closing it reduces Retained Earnings."
    });
  }

  return closingEntries;
};

/* ─── Post-Closing TB ────────────────────────────────────────── */

ExerciseEngine.computePostClosingTB = function (adjustedTB, closingEntries) {
  /* Start with adjusted TB as a ledger, apply closing entries, keep only permanent accounts */
  var ledger = {};
  adjustedTB.forEach(function (row) {
    ledger[row.account] = { debit: row.debit, credit: row.credit };
  });

  closingEntries.forEach(function (ce) {
    ce.entries.forEach(function (entry) {
      if (!ledger[entry.account]) { ledger[entry.account] = { debit: 0, credit: 0 }; }
      if (entry.side === "debit") { ledger[entry.account].debit += entry.amount; }
      else { ledger[entry.account].credit += entry.amount; }
    });
  });

  var tb = [];
  var totalDebit = 0, totalCredit = 0;

  Object.keys(ledger).sort().forEach(function (account) {
    if (ExerciseEngine.isTemporary(account)) { return; }
    var bal = ledger[account];
    var netDebit = bal.debit - bal.credit;
    var dr, cr;
    if (netDebit > 0) { dr = netDebit; cr = 0; totalDebit += netDebit; }
    else if (netDebit < 0) { dr = 0; cr = -netDebit; totalCredit += -netDebit; }
    else { dr = 0; cr = 0; }
    if (dr > 0 || cr > 0) {
      tb.push({ account: account, debit: dr, credit: cr });
    }
  });

  return { rows: tb, totalDebit: totalDebit, totalCredit: totalCredit };
};

/* ─── Tag TB rows for financial statement flow ──────────────── */

ExerciseEngine.tagTBRows = function (tbRows) {
  return tbRows.map(function (row) {
    var type = ExerciseEngine.getAccountType(row.account);
    var base = type.split(" ")[0];
    var isContra = type.indexOf("Contra") !== -1;
    var tagged = { account: row.account, debit: row.debit, credit: row.credit };

    if (base === "Revenue" || base === "Gain") {
      tagged.statement = "income_statement";
      tagged.section = "revenue";
    } else if (base === "Expense" || base === "Loss") {
      tagged.statement = "income_statement";
      tagged.section = "expense";
    } else if (base === "Asset") {
      tagged.statement = "balance_sheet";
      tagged.section = "assets";
    } else if (base === "Liability") {
      tagged.statement = "balance_sheet";
      tagged.section = "liabilities";
    } else if (base === "Equity") {
      tagged.statement = "balance_sheet";
      tagged.section = "equity";
    }
    return tagged;
  });
};

/* ─── Main: Generate Exercise Set ───────────────────────────── */

ExerciseEngine.generateExerciseSet = function (options) {
  /* options not used for filtering — all transactions go in one bank */
  var accountMap = (options && options.accountMap) ? options.accountMap : {};

  /* Build account type lookup from accountMap */
  ExerciseEngine.accountTypeMap = {};
  Object.keys(accountMap).forEach(function (name) {
    ExerciseEngine.accountTypeMap[name] = accountMap[name].type;
  });

  /* Use the full transaction bank — no topic/difficulty filtering */
  var pool = ExerciseEngine.TRANSACTION_BANK;

  /* Try up to 50 draws to get ≥3 adjusting entries */
  var bestSet = null;
  for (var attempt = 0; attempt < 50; attempt++) {
    var shuffled = ExerciseEngine.shuffle(pool);
    var selected = shuffled.slice(0, Math.min(10, shuffled.length));

    var transactions = [];
    var ajeCount = 0;

    selected.forEach(function (pattern, idx) {
      var tx = ExerciseEngine.processTransaction(pattern);
      tx.id = idx + 1;
      tx.ref = "T" + (idx + 1);
      transactions.push(tx);
      ajeCount += pattern.adjusting_entry_implications.length;
    });

    if (ajeCount >= 3 || attempt === 49) {
      bestSet = { transactions: transactions, patterns: selected };
      break;
    }
  }

  var transactions = bestSet.transactions;
  var patterns = bestSet.patterns;

  /* Generate adjusting entries */
  var adjustingEntries = [];
  var signals = [];
  var ajeIdx = 1;

  patterns.forEach(function (pattern, txIdx) {
    pattern.adjusting_entry_implications.forEach(function (impl) {
      var aje = ExerciseEngine.generateAdjustingEntry(impl, transactions[txIdx], ajeIdx);
      aje.id = ajeIdx;
      aje.ref = "A" + ajeIdx;
      adjustingEntries.push(aje);
      signals.push(aje._signal);
      ajeIdx++;
    });
  });

  /* Compute unadjusted TB (include beginning balances for Cash + Common Stock) */
  var beginCash = ExerciseEngine.randomInt(200000, 500000, 10000);
  var beginEquity = beginCash; /* balanced: A = E for the beginning investment */
  var beginBalanceTxs = [{
    entries: [
      { account: "Cash", side: "debit", amount: beginCash },
      { account: "Common Stock", side: "credit", amount: beginEquity }
    ]
  }];
  var unadjTB = ExerciseEngine.mergeTB(
    ExerciseEngine.computeTrialBalance(beginBalanceTxs).rows,
    ExerciseEngine.computeTrialBalance(transactions).rows
  );

  /* Compute adjusted TB (merge unadjusted + AJE entries) */
  var ajeTB = ExerciseEngine.computeTrialBalance(adjustingEntries);
  var adjTB = ExerciseEngine.mergeTB(unadjTB.rows, ajeTB.rows);

  /* Compute income statement */
  var incomeStatement = ExerciseEngine.computeIncomeStatement(adjTB.rows);

  /* Compute balance sheet */
  var balanceSheet = ExerciseEngine.computeBalanceSheet(adjTB.rows, incomeStatement.net_income);

  /* Compute closing entries */
  var closingEntries = ExerciseEngine.computeClosingEntries(adjTB.rows, incomeStatement);

  /* Compute post-closing TB */
  var postClosingTB = ExerciseEngine.computePostClosingTB(adjTB.rows, closingEntries);

  /* Tag TB rows for flow visualization */
  var taggedAdjTB = ExerciseEngine.tagTBRows(adjTB.rows);
  var taggedPostClosingTB = ExerciseEngine.tagTBRows(postClosingTB.rows);

  /* Build balance sheet flow data */
  var bsFlow = {
    assets: [], total_assets: 0,
    liabilities: [], total_liabilities: 0,
    equity: [], total_equity: 0,
    total_liabilities_equity: 0
  };

  postClosingTB.rows.forEach(function (row) {
    var type = ExerciseEngine.getAccountType(row.account);
    var base = type.split(" ")[0];
    var isContra = type.indexOf("Contra") !== -1;
    /* Beginning balance: Cash and Common Stock have beginning balances */
    var begBal = 0;
    if (row.account === "Cash") { begBal = beginCash; }
    else if (row.account === "Common Stock") { begBal = beginEquity; }
    var entry = { account: row.account, beginning: begBal, change: 0, ending: 0 };

    /* Use NET balances (debit - credit for assets, credit - debit for liabilities/equity)
       to handle abnormal balances correctly (e.g., RE debit from net loss, AP debit from overpayment) */
    if (base === "Asset") {
      var netAsset = row.debit - row.credit;
      if (isContra) {
        entry.account = "Less: " + row.account;
        entry.ending = -row.credit + row.debit; /* contra: net credit as negative */
        entry.change = entry.ending - begBal;
        bsFlow.assets.push(entry);
        bsFlow.total_assets += entry.ending;
      } else {
        entry.ending = netAsset;
        entry.change = entry.ending - begBal;
        bsFlow.assets.push(entry);
        bsFlow.total_assets += entry.ending;
      }
    } else if (base === "Liability") {
      entry.ending = row.credit - row.debit; /* net credit */
      entry.change = entry.ending - begBal;
      bsFlow.liabilities.push(entry);
      bsFlow.total_liabilities += entry.ending;
    } else if (base === "Equity" && row.account !== "Income Summary") {
      entry.ending = row.credit - row.debit; /* net credit (can be negative for debit RE) */
      entry.change = entry.ending - begBal;
      bsFlow.equity.push(entry);
      bsFlow.total_equity += entry.ending;
    }
  });
  bsFlow.total_liabilities_equity = bsFlow.total_liabilities + bsFlow.total_equity;

  /* Compute RE change for closing summary */
  var dividendsAmount = 0;
  transactions.forEach(function (tx) {
    tx.entries.forEach(function (e) {
      if (e.account === "Dividends" && e.side === "debit") { dividendsAmount += e.amount; }
    });
  });
  var reChange = incomeStatement.net_income - dividendsAmount;

  /* Determine entity type */
  var entityType = patterns[0] ? patterns[0].entity_type : "corporation";
  var businessType = patterns[0] ? patterns[0].business_type : "merchandising";

  /* Pick company name */
  var companyName = ExerciseEngine.COMPANY_NAMES[Math.floor(Math.random() * ExerciseEngine.COMPANY_NAMES.length)];

  /* Build phases array */
  var phases = [
    {
      key: "daily-ops", phase: 1, phase_name: "Daily Operations",
      transactions: transactions.map(function (tx) {
        return {
          id: tx.id, ref: tx.ref, description: tx.description,
          entries: tx.entries, analysis: tx.analysis, explanation: tx.explanation
        };
      }),
      meta: { trial_balance: unadjTB.rows }
    },
    {
      key: "recognition", phase: 1.5, phase_name: "Adjustment Recognition",
      transactions: [],
      meta: { trial_balance: unadjTB.rows, signals: signals }
    },
    {
      key: "adjusting", phase: 2, phase_name: "Adjusting Entries",
      transactions: adjustingEntries.map(function (aje) {
        return {
          id: aje.id, ref: aje.ref, description: aje.description,
          entries: aje.entries, analysis: aje.analysis, explanation: aje.explanation
        };
      }),
      meta: { trial_balance: adjTB.rows }
    },
    {
      key: "flow", phase: 2.5, phase_name: "Financial Statement Flow",
      transactions: [],
      meta: {
        trial_balance: taggedAdjTB,
        income_statement: incomeStatement,
        balance_sheet: balanceSheet
      }
    },
    {
      key: "closing", phase: 3, phase_name: "Closing Entries",
      transactions: closingEntries,
      meta: {
        trial_balance: postClosingTB.rows,
        closing_summary: {
          revenue_total: incomeStatement.total_revenue,
          expense_total: incomeStatement.total_expenses,
          net_income: incomeStatement.net_income,
          dividends: dividendsAmount,
          retained_earnings_change: reChange
        }
      }
    },
    {
      key: "bs-flow", phase: 3.5, phase_name: "Balance Sheet Flow",
      transactions: [],
      meta: {
        trial_balance: taggedPostClosingTB,
        balance_sheet: bsFlow
      }
    }
  ];

  /* Collect all accounts in play for dropdown filtering */
  var allAccountsInPlay = {};
  phases.forEach(function (phase) {
    var phaseKey = phase.key;
    var accounts = new Set();
    if (phase.transactions && phase.transactions.length > 0) {
      phase.transactions.forEach(function (tx) {
        tx.entries.forEach(function (e) { accounts.add(e.account); });
      });
    }
    if (phase.meta && phase.meta.trial_balance) {
      phase.meta.trial_balance.forEach(function (row) { accounts.add(row.account); });
    }
    /* Add Income Summary for closing phase */
    if (phaseKey === "closing") { accounts.add("Income Summary"); accounts.add("Retained Earnings"); }
    allAccountsInPlay[phaseKey] = Array.from(accounts).sort();
  });

  return {
    meta: {
      title: companyName + " — Full Accounting Cycle",
      company_name: companyName,
      entity_type: entityType,
      business_type: businessType,
      beginning_cash: beginCash,
      beginning_equity: beginEquity,
      set_number: 1
    },
    phases: phases,
    accountsInPlay: allAccountsInPlay,
    _verification: {
      unadjTBDebits: unadjTB.totalDebit,
      unadjTBCredits: unadjTB.totalCredit,
      adjTBDebits: adjTB.totalDebit,
      adjTBCredits: adjTB.totalCredit,
      postClosingDebits: postClosingTB.totalDebit,
      postClosingCredits: postClosingTB.totalCredit,
      netIncome: incomeStatement.net_income,
      totalAssets: balanceSheet.total_assets,
      totalLiabilities: balanceSheet.total_liabilities,
      totalEquity: balanceSheet.total_equity,
      bsCheck: balanceSheet.total_assets === balanceSheet.total_liabilities + balanceSheet.total_equity,
      ajeCount: adjustingEntries.length
    }
  };
};

/* ─── Self-test (run in Node) ────────────────────────────────── */
if (typeof module !== "undefined" && module.exports) {
  module.exports = ExerciseEngine;
}