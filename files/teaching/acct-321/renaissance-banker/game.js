// Il Banco di Firenze - Game Engine Logic

// State Variables
let currentLevel = 1;
let bankReputation = 100; // Max 100 HP
let selectedCustomer = null;
let selectedVaultItem = null;
let selectedLedgerEntries = []; // Array of selected entry IDs / indices
let gameTimer = null;
let soundEnabled = true;
let isGameOver = false;
let isShiftStarted = false;
let startTime = 0;
let arrivalTimers = [];

// Audio Synthesizer using Web Audio API
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioCtx();
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    
    if (type === 'coin') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'wrong') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(130, now + 0.1);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'laser') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'victory') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.3, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
      });
    }
  } catch (e) {
    console.log("Audio play error:", e);
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('soundBtn');
  if (btn) {
    btn.innerText = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
  }
}

// Master Patron Templates (6 Patrons Total, Each with Unique Portraits & Multiple Transactions)
const patronTemplates = [
  {
    id: 'cosimo',
    name: "Cosimo de' Medici",
    lastName: "Medici",
    title: "Wealthy Merchant & Guild Master",
    portrait: "assets/merchant.jpg",
    laserPortrait: "assets/merchant_laser.jpg",
    deposits: [
      { date: "1482-03-05", note: "Cosimo de' Medici deposited 40 Gold Florins cash.", value: "In: 40 Florins", item: 'item_florins_40', amount: 40 },
      { date: "1482-04-12", note: "Cosimo de' Medici deposited 20 Gold Florins cash.", value: "In: 20 Florins", item: 'item_florins_20', amount: 20 }
    ],
    possibleClaims: [
      { text: "Return my total 60 Gold Florins cash deposit!", targetItem: 'item_florins_60', isFalse: false, isPartial: false },
      { text: "I wish to withdraw my 60 Gold Florins account balance!", targetItem: 'item_florins_60', isFalse: false, isPartial: false },
      { text: "I am here to claim 100 Gold Florins from my vault account!", targetItem: 'item_florins_100', isFalse: true, reason: "Account balance is 60 Florins total (Deposited 40 & 20 Florins)" },
      { text: "Give back the Gold Ingot I deposited in your vault!", targetItem: 'item_gold_ingot', isFalse: true, reason: "Account holds 60 Florins cash (Never deposited a Gold Ingot)" }
    ]
  },
  {
    id: 'contessina',
    name: "Contessina de' Pazzi",
    lastName: "de' Pazzi",
    title: "Florentine Noblewoman",
    portrait: "assets/noblewoman.jpg",
    laserPortrait: "assets/noblewoman_laser.jpg",
    deposits: [
      { date: "1482-03-18", note: "Contessina de' Pazzi deposited 1 Silver Chalice valued at 45 Florins.", value: "In: 1 Silver Chalice", item: 'item_chalice', amount: 45 },
      { date: "1482-04-05", note: "Contessina de' Pazzi deposited 20 Gold Florins cash reserve.", value: "In: 20 Florins", item: 'item_florins_20', amount: 20 }
    ],
    possibleClaims: [
      { text: "Give back my pledged Silver Chalice!", targetItem: 'item_chalice', isFalse: false, isPartial: false },
      { text: "I demand 60 Gold Florins cash from my account!", targetItem: 'item_florins_60', isFalse: true, reason: "Account holds 1 Silver Chalice & 20 Florins (No 60 Florins cash)" },
      { text: "Return my Pearl Necklace deposited last month!", targetItem: 'item_pearl_necklace', isFalse: true, reason: "Account holds Silver Chalice & 20 Florins (Never deposited Pearl Necklace)" }
    ]
  },
  {
    id: 'lorenzo',
    name: "Lorenzo the Scholar",
    lastName: "Scholar",
    title: "Humanist Scholar & Patron",
    portrait: "assets/scholar.jpg",
    laserPortrait: "assets/scholar_laser.jpg",
    deposits: [
      { date: "1482-04-02", note: "Lorenzo the Scholar deposited 30 Gold Florins.", value: "In: 30 Florins", item: 'item_florins_30', amount: 30 },
      { date: "1482-04-20", note: "Lorenzo the Scholar deposited 1 Ruby Ring pledged against credit.", value: "In: 1 Ruby Ring", item: 'item_ruby_ring', amount: 30 }
    ],
    possibleClaims: [
      { text: "I am here to reclaim my pledged Ruby Ring!", targetItem: 'item_ruby_ring', isFalse: false, isPartial: false },
      { text: "Return my pledged Ruby Ring from my vault account!", targetItem: 'item_ruby_ring', isFalse: false, isPartial: false },
      { text: "Return the Antique Parchment Codex I left with you!", targetItem: 'item_codex', isFalse: true, reason: "Account holds 30 Florins & 1 Ruby Ring (Never deposited Parchment Codex)" },
      { text: "I am here to withdraw 100 Gold Florins!", targetItem: 'item_florins_100', isFalse: true, reason: "Account holds 30 Florins & 1 Ruby Ring (Never deposited 100 Florins)" }
    ]
  },
  {
    id: 'sandro',
    name: "Sandro Botticelli",
    lastName: "Botticelli",
    title: "Master Painter",
    portrait: "assets/painter.jpg",
    laserPortrait: "assets/painter_laser.jpg",
    deposits: [
      { date: "1482-03-02", note: "Sandro Botticelli deposited 15 Gold Florins for pigments.", value: "In: 15 Florins", item: 'item_florins_15', amount: 15 },
      { date: "1482-04-10", note: "Sandro Botticelli deposited 1 Engraved Silver Palette valued at 25 Florins.", value: "In: 1 Silver Palette", item: 'item_palette', amount: 25 }
    ],
    possibleClaims: [
      { text: "I wish to withdraw my 15 Gold Florins art reserve!", targetItem: 'item_florins_15', isFalse: false, isPartial: false },
      { text: "Give back the Gold Ingot I left in your care!", targetItem: 'item_gold_ingot', isFalse: true, reason: "Account holds 15 Florins & Silver Palette (Never deposited Gold Ingot)" }
    ]
  },
  {
    id: 'lucrezia',
    name: "Lucrezia Borgia",
    lastName: "Borgia",
    title: "Noble Patroness",
    portrait: "assets/patroness.jpg",
    laserPortrait: "assets/patroness_laser.jpg",
    deposits: [
      { date: "1482-03-25", note: "Lucrezia Borgia deposited 1 Pearl Necklace valued at 50 Florins.", value: "In: 1 Pearl Necklace", item: 'item_pearl_necklace', amount: 50 },
      { date: "1482-04-15", note: "Lucrezia Borgia deposited 35 Gold Florins.", value: "In: 35 Florins", item: 'item_florins_35', amount: 35 }
    ],
    possibleClaims: [
      { text: "Return my Pearl Necklace from my jewel safe!", targetItem: 'item_pearl_necklace', isFalse: false, isPartial: false },
      { text: "I demand 100 Gold Florins cash from my account!", targetItem: 'item_florins_100', isFalse: true, reason: "Account holds Pearl Necklace & 35 Florins (Never deposited 100 Florins)" }
    ]
  },
  {
    id: 'goldsmith',
    name: "Gianni the Goldsmith",
    lastName: "Goldsmith",
    title: "Guild Master Craftsman",
    portrait: "assets/goldsmith.jpg",
    laserPortrait: "assets/goldsmith_laser.jpg",
    deposits: [
      { date: "1482-03-12", note: "Gianni the Goldsmith deposited 1 Pure Gold Ingot.", value: "In: 1 Gold Ingot", item: 'item_gold_ingot', amount: 50 },
      { date: "1482-04-08", note: "Gianni the Goldsmith deposited 25 Gold Florins cash.", value: "In: 25 Florins", item: 'item_florins_25', amount: 25 }
    ],
    possibleClaims: [
      { text: "I am here to retrieve my 24k Gold Ingot!", targetItem: 'item_gold_ingot', isFalse: false, isPartial: false },
      { text: "Return my pledged Silver Chalice from your vault!", targetItem: 'item_chalice', isFalse: true, reason: "Account holds Gold Ingot & 25 Florins (Never deposited Silver Chalice)" }
    ]
  }
];

let activeCustomers = [];
let currentLedgerEntries = [];
let currentVaultItems = [];
let currentDrawers = [];

// Fisher-Yates Random Shuffle
function shuffleArray(arr) {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Initialization
window.addEventListener('DOMContentLoaded', () => {
  setupCanvas();
  initLevel(1, true);
  startTimerLoop();
});

function setupCanvas() {
  const canvas = document.getElementById('laserCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function switchLevel(lvl) {
  currentLevel = lvl;
  document.getElementById('level1Btn').classList.toggle('active', lvl === 1);
  document.getElementById('level2Btn').classList.toggle('active', lvl === 2);
  initLevel(lvl, true);
}

function resetCurrentLevel() {
  initLevel(currentLevel, true);
}

function initLevel(lvl, isInitial = true) {
  bankReputation = 100;
  isGameOver = false;
  isShiftStarted = false;
  isRulesOpen = true;
  selectedCustomer = null;
  selectedVaultItem = null;
  selectedLedgerEntries = [];

  arrivalTimers.forEach(t => clearTimeout(t));
  arrivalTimers = [];

  updateReputationUI();
  document.getElementById('selectedItemName').innerText = "None Selected";
  checkDeliveryButtonState();

  // Select 3 visiting patrons at the counter out of the 6 registered patron accounts
  const shuffledTemplates = shuffleArray(patronTemplates);
  activeCustomers = shuffledTemplates.slice(0, 3).map((tpl, idx) => {
    const claim = tpl.possibleClaims[Math.floor(Math.random() * tpl.possibleClaims.length)];
    return {
      id: tpl.id,
      name: tpl.name,
      lastName: tpl.lastName,
      title: tpl.title,
      portrait: tpl.portrait,
      laserPortrait: tpl.laserPortrait,
      requestText: claim.text,
      targetItemId: claim.targetItem,
      isFalseClaim: claim.isFalse,
      falseReason: claim.reason || '',
      deposits: tpl.deposits,
      sanity: 60,
      maxSanity: 60,
      served: false,
      arrived: idx === 0, // First visiting patron is at counter immediately
      wrongPenalty: false
    };
  });

  // Build Ledger Entries & Vault Inventory
  buildRandomizedLedgerAndVault();

  // Update Title Screen Modal
  const titleHeader = document.getElementById('titleLevelHeader');
  const titleDesc = document.getElementById('titleLevelDesc');
  if (titleHeader && titleDesc) {
    if (lvl === 1) {
      titleHeader.innerText = "Level 1: Single-Entry Bookkeeping";
      titleDesc.innerText = "Master Banker! 6 registered patrons hold accounts at your bank, and 3 patrons visit your counter this shift. Inspect the unorganized single-entry scroll with multiple transaction entries per patron, highlight proof, and PAY OUT valid claims or REJECT false claims!";
    } else {
      titleHeader.innerText = "Level 2: Double-Entry Bookkeeping";
      titleDesc.innerText = "Witness Luca Pacioli's accounting revolution! Accounts & drawers are sorted in strict lexicographical order by patron last name (A to Z). Verify ledger proof, process valid payouts, or REJECT fraud instantly!";
    }
  }

  const modal = document.getElementById('titleScreenModal');
  if (isInitial && modal) {
    modal.style.display = 'flex';
    modal.classList.add('show');
  } else if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('show');
  }

  if (lvl === 1) {
    document.getElementById('ledgerTitle').innerText = "Il Memoriale (Single-Entry Ledger)";
    document.getElementById('ledgerSubtitle').innerText = "Unorganized sequential record of all bank flows (Click entry to select proof)";
    document.getElementById('vaultTitle').innerText = "Il Gran Forziere (Giant Vault)";
    document.getElementById('vaultSubtitle').innerText = "Single unorganized vault holding all pledged items";
    renderSingleEntryLedger();
    renderGiantVault();
  } else {
    document.getElementById('ledgerTitle').innerText = "Il Libro Mastro (Double-Entry T-Accounts)";
    document.getElementById('ledgerSubtitle').innerText = "Dual-sided T-accounts indexed in alphabetical order by patron last name (Click T-account to select proof)";
    document.getElementById('vaultTitle').innerText = "I Cassetti dell' Account (Alphabetical Vault Drawers)";
    document.getElementById('vaultSubtitle').innerText = "Vault drawers indexed A–Z by patron last name (Multiple items per drawer)";
    renderDoubleEntryLedger();
    renderCompartmentalizedVault();
  }

  if (!isInitial) {
    startGameShift();
  } else {
    renderCustomers();
  }
}

let openedDrawerId = null;

// Exactly 7 Accounts for Level 2 T-Accounts & Drawers (6 Registered Patrons + 1 Bank Owner Capital Account)
const allLevel2AccountTemplates = [
  {
    id: 'lucrezia',
    name: "Lucrezia Borgia",
    lastName: "Borgia",
    items: [
      { id: 'item_pearl_necklace', name: 'Pearl Necklace', icon: '📿', desc: 'Jewel Safe' },
      { id: 'item_florins_35', name: '35 Gold Florins', icon: '💰', desc: 'Noble Cash Reserve' }
    ],
    depositNote: "In: 1 Pearl Necklace & 35 Florins"
  },
  {
    id: 'sandro',
    name: "Sandro Botticelli",
    lastName: "Botticelli",
    items: [
      { id: 'item_florins_15', name: '15 Gold Florins', icon: '🪙', desc: 'Pigment Fund' },
      { id: 'item_palette', name: 'Silver Palette', icon: '🎨', desc: 'Guild Master Palette' }
    ],
    depositNote: "In: 15 Florins & 1 Silver Palette"
  },
  {
    id: 'contessina',
    name: "Contessina de' Pazzi",
    lastName: "de' Pazzi",
    items: [
      { id: 'item_chalice', name: 'Silver Chalice', icon: '🏆', desc: 'Collateral Pledge' },
      { id: 'item_florins_20', name: '20 Gold Florins', icon: '🪙', desc: 'Cash Reserve Deposit' }
    ],
    depositNote: "In: 1 Silver Chalice & 20 Florins"
  },
  {
    id: 'goldsmith',
    name: "Gianni the Goldsmith",
    lastName: "Goldsmith",
    items: [
      { id: 'item_gold_ingot', name: 'Gold Ingot', icon: '🧱', desc: 'Pure 24k Gold Ingot' },
      { id: 'item_florins_25', name: '25 Gold Florins', icon: '🪙', desc: 'Treasury Cash Deposit' }
    ],
    depositNote: "In: 1 Gold Ingot & 25 Florins"
  },
  {
    id: 'cosimo',
    name: "Cosimo de' Medici",
    lastName: "Medici",
    items: [
      { id: 'item_florins_60', name: '60 Gold Florins', icon: '💰', desc: 'Cash Account (60 Florins Total)' },
      { id: 'item_florins_20', name: '20 Gold Florins', icon: '🪙', desc: 'Secondary Cash Deposit' }
    ],
    depositNote: "In: 40 Florins & 20 Florins Cash"
  },
  {
    id: 'bank_owner',
    name: "Bank Owner Capital",
    lastName: "Owner Capital",
    items: [
      { id: 'item_florins_100', name: '100 Gold Florins', icon: '💰', desc: 'Medici Master Capital Reserve' },
      { id: 'item_gold_ingot', name: 'Gold Ingot', icon: '🧱', desc: 'Bank Reserves Ingot' }
    ],
    depositNote: "In: 100 Florins Capital & 1 Gold Ingot"
  },
  {
    id: 'lorenzo',
    name: "Lorenzo the Scholar",
    lastName: "Scholar",
    items: [
      { id: 'item_ruby_ring', name: 'Ruby Ring', icon: '💍', desc: 'Pledged Asset' },
      { id: 'item_florins_30', name: '30 Gold Florins', icon: '💰', desc: 'Scholarship Fund' }
    ],
    depositNote: "In: 30 Florins & 1 Ruby Ring"
  }
];

function buildRandomizedLedgerAndVault() {
  currentLedgerEntries = [];
  openedDrawerId = null;

  // Real Patron Deposits for ALL 6 registered accounts in patronTemplates
  patronTemplates.forEach(tpl => {
    tpl.deposits.forEach(d => {
      currentLedgerEntries.push({ ownerId: tpl.id, ownerName: tpl.name, date: d.date, note: d.note, value: d.value });
    });
  });

  // Decoy Historical Entries for Single-Entry Scroll Noise
  const decoyEntries = [
    { ownerId: 'amerigo', ownerName: 'Amerigo Vespucci', date: "1482-03-10", note: "Amerigo Vespucci withdrew 40 Florins for naval charts.", value: "Out: 40 Florins" },
    { ownerId: 'wool_guild', ownerName: 'Wool Guild', date: "1482-03-22", note: "Guild of Wool Merchants paid annual vault fee.", value: "In: 8 Florins" },
    { ownerId: 'armourer', ownerName: 'Bartolomeo Armourer', date: "1482-04-20", note: "Bartolomeo Armourer deposited 1 Florentine Dagger.", value: "In: 1 Dagger" },
    { ownerId: 'san_marco', ownerName: 'Monastery San Marco', date: "1482-04-28", note: "Monastery of San Marco withdrew 50 Florins.", value: "Out: 50 Florins" },
    { ownerId: 'filippo', ownerName: 'Master Filippo', date: "1482-05-19", note: "Master Filippo deposited 1 Antique Parchment Codex.", value: "In: 1 Codex" },
    { ownerId: 'silversmith', ownerName: 'Vittorio Silversmith', date: "1482-05-25", note: "Vittorio the Silversmith deposited 1 Silver Candelabra.", value: "In: 1 Candelabra" }
  ];

  currentLedgerEntries = shuffleArray([...currentLedgerEntries, ...decoyEntries]);

  // Giant Vault Items for Level 1
  currentVaultItems = [
    { id: 'item_florins_60', name: '60 Gold Florins', icon: '💰', desc: 'Chest of 60 Florins' },
    { id: 'item_florins_40', name: '40 Gold Florins', icon: '💰', desc: 'Bag of 40 Florins' },
    { id: 'item_florins_35', name: '35 Gold Florins', icon: '💰', desc: 'Bag of 35 Florins' },
    { id: 'item_florins_30', name: '30 Gold Florins', icon: '💰', desc: 'Bag of 30 Florins' },
    { id: 'item_florins_25', name: '25 Gold Florins', icon: '🪙', desc: 'Small Bag of Coins' },
    { id: 'item_florins_20', name: '20 Gold Florins', icon: '🪙', desc: 'Small Pouch of Coins' },
    { id: 'item_florins_15', name: '15 Gold Florins', icon: '🪙', desc: 'Small Coin Pouch' },
    { id: 'item_florins_100', name: '100 Gold Florins', icon: '💰', desc: 'Heavy Coin Chest' },
    { id: 'item_chalice', name: 'Silver Chalice', icon: '🏆', desc: 'Fine Engraved Chalice' },
    { id: 'item_ruby_ring', name: 'Ruby Ring', icon: '💍', desc: 'Medici Gold Ruby Ring' },
    { id: 'item_pearl_necklace', name: 'Pearl Necklace', icon: '📿', desc: 'Florentine Pearls' },
    { id: 'item_gold_ingot', name: 'Gold Ingot', icon: '🧱', desc: 'Pure 24k Gold Ingot' },
    { id: 'item_palette', name: 'Silver Palette', icon: '🎨', desc: 'Guild Master Palette' },
    { id: 'item_codex', name: 'Parchment Codex', icon: '📜', desc: 'Illuminated Manuscript' },
    { id: 'item_dagger', name: 'Florentine Dagger', icon: '🗡️', desc: 'Engraved Steel Blade' }
  ];

  // Level 2 Drawers Config: Sort Accounts Lexicographically by Patron Last Name
  const sortedAccounts = [...allLevel2AccountTemplates].sort((a, b) => a.lastName.localeCompare(b.lastName));

  currentDrawers = sortedAccounts.map((acc, idx) => {
    const drawerLetter = String.fromCharCode(65 + idx);
    return {
      id: `drawer_${acc.id}`,
      label: `Drawer ${drawerLetter}: ${acc.lastName.toUpperCase()}, ${acc.name.split(' ')[0]}`,
      ownerName: acc.name,
      ownerId: acc.id,
      items: acc.items,
      depositNote: acc.depositNote
    };
  });
}

let shiftActiveSeconds = 0;

function startGameShift() {
  const modal = document.getElementById('titleScreenModal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }

  isShiftStarted = true;
  isRulesOpen = false;
  shiftActiveSeconds = 0;
  startTime = Date.now();
  try { playSound('coin'); } catch(e) {}

  // Customer 1 Arrives Immediately
  if (activeCustomers && activeCustomers.length > 0) {
    activeCustomers[0].arrived = true;
  }
  renderCustomers();
  showFloatingText(`🔔 Patron ${activeCustomers[0].name} Has Arrived!`, "success");

  arrivalTimers.forEach(t => clearTimeout(t));
  arrivalTimers = [];
}

// Render Customers
function renderCustomers() {
  const container = document.getElementById('customersGrid');
  container.innerHTML = '';

  activeCustomers.forEach(cust => {
    const card = document.createElement('div');
    card.id = `customer-card-${cust.id}`;
    
    if (!cust.arrived) {
      card.className = 'customer-card queue-waiting';
      card.innerHTML = `
        <div class="portrait-frame" style="opacity: 0.4;">
          <img class="portrait-img" src="${cust.portrait}" alt="${cust.name}">
        </div>
        <div class="customer-info-wrapper">
          <div class="customer-name" style="opacity: 0.6;">${cust.name}</div>
          <div class="customer-title">${cust.title}</div>
          <div class="request-speech-bubble" style="opacity: 0.6;">"Approaching Bank Counter..."</div>
          <div class="arrival-badge">⏳ Waiting in Line</div>
        </div>
      `;
    } else {
      card.className = `customer-card ${cust.sanity <= 0 && !cust.served ? 'enraged' : ''}`;
      if (selectedCustomer === cust.id) {
        card.style.borderColor = '#55ff55';
      }

      const currentImg = (cust.sanity <= 0 && !cust.served) ? cust.laserPortrait : cust.portrait;
      const requestMsg = isShiftStarted ? `"${cust.requestText}"` : `"Master Banker, click 'Open Counter & Begin Shift' when ready!"`;

      card.innerHTML = `
        <div class="portrait-frame">
          <img id="img-${cust.id}" class="portrait-img" src="${currentImg}" alt="${cust.name}">
        </div>
        <div class="customer-info-wrapper">
          <div class="customer-header-row">
            <div>
              <div class="customer-name">${cust.name}</div>
              <div class="customer-title">${cust.title}</div>
            </div>
            <div class="customer-actions">
              ${!isShiftStarted ? `
                <button class="btn-gold" style="font-weight: bold; width: 100%; font-size: 0.82rem; padding: 4px 8px;" onclick="startGameShift()">🏛️ Open Counter & Begin Shift</button>
              ` : `
                <button class="btn-serve" ${cust.served ? 'disabled' : ''} onclick="selectCustomer('${cust.id}')">
                  ${cust.served ? '✓ SERVED' : (selectedCustomer === cust.id ? 'SELECTED' : 'Select Patron')}
                </button>
              `}
            </div>
          </div>
          <div class="request-speech-bubble">${requestMsg}</div>
          
          <div class="sanity-wrapper">
            <div class="sanity-header">
              <span>Sanity / Patience</span>
              <span id="sanity-num-${cust.id}">${Math.ceil(cust.sanity)}s</span>
            </div>
            <div class="sanity-bar-outer">
              <div id="sanity-bar-${cust.id}" class="sanity-bar-inner ${getSanityClass(cust)}" style="width: ${(cust.sanity / cust.maxSanity) * 100}%;"></div>
            </div>
          </div>
        </div>
      `;
    }

    container.appendChild(card);
  });
}

function getSanityClass(cust) {
  if (cust.sanity <= 0) return 'enraged';
  if (cust.sanity < 20) return 'danger';
  if (cust.sanity < 40) return 'warning';
  return '';
}

function selectCustomer(custIds) {
  if (isGameOver) return;
  selectedCustomer = custIds;
  renderCustomers();
  checkDeliveryButtonState();
}

// Render Single-Entry Ledger (Level 1)
function renderSingleEntryLedger() {
  const container = document.getElementById('ledgerContent');
  container.className = 'single-entry-scroll';
  container.innerHTML = '';

  currentLedgerEntries.forEach((entry, idx) => {
    const card = document.createElement('div');
    const isSelected = selectedLedgerEntries.includes(idx);
    card.className = `entry-card ${isSelected ? 'selected-proof' : ''}`;
    card.onclick = () => toggleLedgerSelection(idx);

    card.innerHTML = `
      <div class="entry-date">${entry.date}</div>
      <div class="entry-note">${entry.note}</div>
      <div class="entry-value">${entry.value}</div>
    `;
    container.appendChild(card);
  });
}

// Toggle Ledger Selection
function toggleLedgerSelection(idx) {
  if (isGameOver) return;
  playSound('coin');
  const pos = selectedLedgerEntries.indexOf(idx);
  if (pos >= 0) {
    selectedLedgerEntries.splice(pos, 1);
  } else {
    selectedLedgerEntries.push(idx);
  }

  if (currentLevel === 1) renderSingleEntryLedger();
  else renderDoubleEntryLedger();

  checkDeliveryButtonState();
}

// Render Giant Vault (Level 1)
function renderGiantVault() {
  const container = document.getElementById('vaultContent');
  container.className = 'giant-vault-container';
  container.innerHTML = `<div class="items-grid" id="itemsGrid"></div>`;

  const grid = document.getElementById('itemsGrid');
  currentVaultItems.forEach(item => {
    const tile = document.createElement('div');
    tile.className = `item-tile ${selectedVaultItem && selectedVaultItem.id === item.id ? 'selected' : ''}`;
    tile.onclick = () => selectVaultItem(item);

    tile.innerHTML = `
      <div class="item-icon">${item.icon}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-desc">${item.desc}</div>
    `;
    grid.appendChild(tile);
  });
}

// Render Double-Entry Ledger (Level 2) - T-Accounts
function renderDoubleEntryLedger() {
  const container = document.getElementById('ledgerContent');
  container.className = 'double-entry-container';
  container.innerHTML = '';

  currentDrawers.forEach((drawer, idx) => {
    const tCard = document.createElement('div');
    const isSelected = selectedLedgerEntries.includes(idx);
    tCard.className = `t-account-card ${isSelected ? 'selected-proof' : ''}`;
    tCard.onclick = () => toggleLedgerSelection(idx);

    const itemsSummary = drawer.items.map(it => `${it.icon} ${it.name}`).join(' + ');

    tCard.innerHTML = `
      <div class="t-account-name">${drawer.ownerName.toUpperCase()} ACCOUNT</div>
      <div class="t-account-grid">
        <div class="t-account-col">
          <div class="t-col-header debit">DEBIT / DARE (Vault Asset Location)</div>
          <div class="t-item">
            <strong>Compartment:</strong> Drawer ${String.fromCharCode(65 + idx)}<br>
            <strong>Physical Inventory:</strong> ${itemsSummary}<br>
            <small style="color: #664d36;">(Record: ${drawer.depositNote})</small>
          </div>
        </div>
        <div class="t-account-col">
          <div class="t-col-header credit">CREDIT / AVERE (Client Claim)</div>
          <div class="t-item">
            <strong>Claim Account:</strong> Deposit Liability<br>
            <strong>Owner:</strong> ${drawer.ownerName}<br>
            <small style="color: #664d36;">Verified Ledger Balance</small>
          </div>
        </div>
      </div>
    `;
    container.appendChild(tCard);
  });
}

// Render Compartmentalized Vault (Level 2) - Closed Drawers -> Click to Open & Inspect Contents
function renderCompartmentalizedVault() {
  const container = document.getElementById('vaultContent');
  container.className = 'giant-vault-container';
  container.innerHTML = `<div class="compartment-grid" id="compartmentGrid"></div>`;

  const grid = document.getElementById('compartmentGrid');
  currentDrawers.forEach(drawer => {
    const isOpened = openedDrawerId === drawer.id;
    const drawerCard = document.createElement('div');
    drawerCard.className = `drawer-card ${isOpened ? 'open' : ''}`;

    drawerCard.onclick = (e) => {
      // Toggle drawer open state if not clicking directly on an item tile
      if (!e.target.closest('.item-tile')) {
        toggleDrawerOpen(drawer.id);
      }
    };

    if (!isOpened) {
      drawerCard.innerHTML = `
        <div class="drawer-header-label">${drawer.label}</div>
        <div class="drawer-handle">🔑 PULL</div>
        <div class="drawer-status">🔒 Closed Drawer (Click to Inspect)</div>
      `;
    } else {
      const itemsList = drawer.items || [];
      const itemsHtml = itemsList.map(it => `
        <div class="item-tile ${selectedVaultItem && selectedVaultItem.id === it.id ? 'selected' : ''}" data-item-id="${it.id}" style="width: 100%; margin-bottom: 6px;">
          <div class="item-icon">${it.icon}</div>
          <div class="item-name">${it.name}</div>
          <div class="item-desc">${it.desc}</div>
        </div>
      `).join('');

      drawerCard.innerHTML = `
        <div class="drawer-header-label" style="color: #55ff55;">${drawer.label} (OPEN)</div>
        <div class="drawer-contents-wrapper" style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
          ${itemsHtml}
        </div>
        <div class="drawer-status" style="margin-top: 6px;">📂 ${itemsList.length} Item(s) Matched to T-Account</div>
      `;

      // Attach item selection listener to each item tile inside the drawer
      const tileEls = drawerCard.querySelectorAll('.item-tile');
      tileEls.forEach(tileEl => {
        const itemId = tileEl.getAttribute('data-item-id');
        const matchedItem = itemsList.find(it => it.id === itemId);
        if (matchedItem) {
          tileEl.onclick = (e) => {
            e.stopPropagation();
            selectVaultItem(matchedItem);
          };
        }
      });
    }

    grid.appendChild(drawerCard);
  });
}

function toggleDrawerOpen(drawerId) {
  if (isGameOver) return;
  playSound('coin');
  if (openedDrawerId === drawerId) {
    openedDrawerId = null;
  } else {
    openedDrawerId = drawerId;
  }
  renderCompartmentalizedVault();

  if (openedDrawerId) {
    setTimeout(() => {
      const openEl = document.querySelector('.drawer-card.open');
      if (openEl) {
        openEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }
}

function selectVaultItem(item) {
  if (isGameOver) return;
  playSound('coin');
  selectedVaultItem = item;
  document.getElementById('selectedItemName').innerText = `${item.icon} ${item.name}`;
  
  if (currentLevel === 1) renderGiantVault();
  else renderCompartmentalizedVault();

  checkDeliveryButtonState();
}

function checkDeliveryButtonState() {
  const deliverBtn = document.getElementById('deliverBtn');
  const rejectBtn = document.getElementById('rejectBtn');

  const hasCustomer = selectedCustomer !== null;
  const hasVaultItem = selectedVaultItem !== null;
  const hasLedgerProof = selectedLedgerEntries.length > 0;

  if (deliverBtn) deliverBtn.disabled = !(hasCustomer && hasVaultItem && hasLedgerProof);
  if (rejectBtn) rejectBtn.disabled = !(hasCustomer && hasLedgerProof);
}

// Delivery Handler (For Valid Claims)
function deliverSelectedItem() {
  if (!selectedCustomer || !selectedVaultItem || isGameOver || !isShiftStarted) return;

  const customer = activeCustomers.find(c => c.id === selectedCustomer);
  if (!customer || customer.served || !customer.arrived) return;

  // Check if player selected ledger proof matching this customer
  const hasMatchingLedgerProof = checkLedgerProofForCustomer(customer);

  if (!customer.isFalseClaim && selectedVaultItem.id === customer.targetItemId && hasMatchingLedgerProof) {
    // CORRECT PAYOUT
    playSound('victory');
    customer.served = true;
    showFloatingText(`+100 SUCCESS! ${customer.name} Satisfied`, 'success');

    triggerNextQueueArrival(customer);
    resetSelections();

    const allServed = activeCustomers.every(c => c.served);
    if (allServed) {
      setTimeout(showVictoryModal, 600);
    }
  } else {
    // WRONG PAYOUT / ACCEPTED FRAUDULENT CLAIM
    playSound('wrong');
    customer.wrongPenalty = true;
    if (customer.isFalseClaim) {
      showFloatingText(`FRAUD AUDIT FAIL! ${customer.name} Paid Fraudulent Claim! (2x Sanity Drain)`, 'damage');
    } else {
      showFloatingText(`WRONG ITEM OR PROOF! ${customer.name} Impatient! (2x Sanity Drain)`, 'damage');
    }

    // Keep selectedCustomer and selectedLedgerEntries active! Only reset the wrong vault item so player can retry immediately
    selectedVaultItem = null;
    document.getElementById('selectedItemName').innerText = "None Selected";
    if (currentLevel === 1) renderGiantVault();
    else renderCompartmentalizedVault();
    checkDeliveryButtonState();
  }
}

// Reject Handler (For False Claims)
function rejectCurrentClaim() {
  if (!selectedCustomer || isGameOver || !isShiftStarted) return;

  const customer = activeCustomers.find(c => c.id === selectedCustomer);
  if (!customer || customer.served || !customer.arrived) return;

  const hasMatchingLedgerProof = checkLedgerProofForCustomer(customer);

  if (customer.isFalseClaim && hasMatchingLedgerProof) {
    // SUCCESSFUL AUDIT REJECTION
    playSound('victory');
    customer.served = true;
    showFloatingText(`🛡️ AUDIT SUCCESS! False Claim Rejected (${customer.falseReason})`, 'success');

    triggerNextQueueArrival(customer);
    resetSelections();

    const allServed = activeCustomers.every(c => c.served);
    if (allServed) {
      setTimeout(showVictoryModal, 600);
    }
  } else {
    // WRONG REJECTION (Legitimate claim rejected or wrong ledger proof)
    playSound('wrong');
    customer.wrongPenalty = true;
    showFloatingText(`REJECTION ERROR! ${customer.name}'s Claim Was Valid! (2x Sanity Drain)`, 'damage');

    // Keep selectedCustomer and selectedLedgerEntries active!
    checkDeliveryButtonState();
  }
}

function checkLedgerProofForCustomer(customer) {
  if (selectedLedgerEntries.length === 0) return false;

  if (currentLevel === 1) {
    return selectedLedgerEntries.some(idx => {
      const entry = currentLedgerEntries[idx];
      return entry && entry.ownerId === customer.id;
    });
  } else {
    return selectedLedgerEntries.some(idx => {
      const drawer = currentDrawers[idx];
      return drawer && drawer.ownerId === customer.id;
    });
  }
}

function triggerNextQueueArrival(servedCust) {
  const idx = activeCustomers.findIndex(c => c.id === servedCust.id);
  if (idx >= 0 && idx + 1 < activeCustomers.length) {
    const nextCust = activeCustomers[idx + 1];
    if (!nextCust.arrived) {
      nextCust.arrived = true;
      showFloatingText(`🔔 Patron ${nextCust.name} Has Arrived!`, 'success');
    }
  }
}

function resetSelections() {
  renderCustomers();
  selectedCustomer = null;
  selectedVaultItem = null;
  selectedLedgerEntries = [];
  document.getElementById('selectedItemName').innerText = "None Selected";

  if (currentLevel === 1) {
    renderSingleEntryLedger();
    renderGiantVault();
  } else {
    renderDoubleEntryLedger();
    renderCompartmentalizedVault();
  }

  checkDeliveryButtonState();
}

// Timer Loop
function startTimerLoop() {
  if (gameTimer) clearInterval(gameTimer);

  gameTimer = setInterval(() => {
    if (!isShiftStarted || isRulesOpen || isGameOver) {
      drawLasers();
      return;
    }

    shiftActiveSeconds++;

    // Customer 2 arrives after 15 active shift seconds
    if (shiftActiveSeconds === 15 && activeCustomers[1] && !activeCustomers[1].arrived) {
      activeCustomers[1].arrived = true;
      renderCustomers();
      showFloatingText(`🔔 Patron ${activeCustomers[1].name} Has Arrived!`, "success");
      try { playSound('coin'); } catch(e) {}
    }

    // Customer 3 arrives after 30 active shift seconds
    if (shiftActiveSeconds === 30 && activeCustomers[2] && !activeCustomers[2].arrived) {
      activeCustomers[2].arrived = true;
      renderCustomers();
      showFloatingText(`🔔 Patron ${activeCustomers[2].name} Has Arrived!`, "success");
      try { playSound('coin'); } catch(e) {}
    }

    let laserShootingCount = 0;

    activeCustomers.forEach(cust => {
      if (cust.arrived && !cust.served) {
        // Sanity drop rate: 1 pt/s normally, 2 pt/s if wrong payout penalty
        const rate = cust.wrongPenalty ? 2 : 1;
        cust.sanity = Math.max(0, cust.sanity - rate);

        if (cust.sanity <= 0) {
          laserShootingCount++;
        }
      }
    });

    // Bank Reputation Damage
    if (laserShootingCount > 0) {
      playSound('laser');
      bankReputation = Math.max(0, bankReputation - (laserShootingCount * 2));
      updateReputationUI();

      if (bankReputation <= 0) {
        triggerGameOver();
      }
    }

    renderSanityBars();
    drawLasers();
  }, 1000);
}

function renderSanityBars() {
  activeCustomers.forEach(cust => {
    const numEl = document.getElementById(`sanity-num-${cust.id}`);
    const barEl = document.getElementById(`sanity-bar-${cust.id}`);
    const imgEl = document.getElementById(`img-${cust.id}`);
    const cardEl = document.getElementById(`customer-card-${cust.id}`);

    if (numEl) numEl.innerText = `${Math.ceil(cust.sanity)}s`;
    if (barEl) {
      barEl.style.width = `${(cust.sanity / cust.maxSanity) * 100}%`;
      barEl.className = `sanity-bar-inner ${getSanityClass(cust)}`;
    }

    // Toggle Laser Eye Portrait when Sanity = 0
    if (cust.sanity <= 0 && !cust.served) {
      if (imgEl && imgEl.src !== cust.laserPortrait) {
        imgEl.src = cust.laserPortrait;
      }
      if (cardEl && !cardEl.classList.contains('enraged')) {
        cardEl.classList.add('enraged');
      }
    } else {
      if (imgEl && imgEl.src !== cust.portrait) {
        imgEl.src = cust.portrait;
      }
      if (cardEl && cardEl.classList.contains('enraged')) {
        cardEl.classList.remove('enraged');
      }
    }
  });
}

function updateReputationUI() {
  const bar = document.getElementById('reputationBar');
  const txt = document.getElementById('reputationHpText');
  if (bar) bar.style.width = `${bankReputation}%`;
  if (txt) txt.innerText = `${bankReputation} HP`;
}

// Red Laser Particle Canvas Renderer
function drawLasers() {
  const canvas = document.getElementById('laserCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const repBar = document.getElementById('reputationBar');
  if (!repBar) return;
  const repRect = repBar.getBoundingClientRect();
  const targetX = repRect.left + repRect.width / 2;
  const targetY = repRect.top + repRect.height / 2;

  activeCustomers.forEach(cust => {
    if (cust.sanity <= 0 && !cust.served) {
      const card = document.getElementById(`customer-card-${cust.id}`);
      if (card) {
        const cardRect = card.getBoundingClientRect();
        const startX = cardRect.left + cardRect.width / 2;
        const startY = cardRect.top + 80;

        // Draw Laser Beams
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = 'rgba(255, 42, 42, 0.8)';
        ctx.lineWidth = 6 + Math.random() * 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(targetX + (Math.random() * 20 - 10), targetY + (Math.random() * 10 - 5), 4 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffaa00';
        ctx.fill();
      }
    }
  });
}

function showFloatingText(msg, type) {
  const text = document.createElement('div');
  text.className = `floating-text ${type}`;
  text.innerText = msg;
  text.style.left = `${window.innerWidth / 2 - 120}px`;
  text.style.top = `${window.innerHeight / 2 - 50}px`;
  document.body.appendChild(text);
  setTimeout(() => text.remove(), 1500);
}

// Modal Handlers
function openRulesModal() {
  isRulesOpen = true;
  document.getElementById('rulesModal').classList.add('show');
}

function closeRulesModal() {
  isRulesOpen = false;
  document.getElementById('rulesModal').classList.remove('show');
}

function triggerGameOver() {
  isGameOver = true;
  playSound('wrong');
  document.getElementById('endGameTitle').innerText = "🏛️ Bank Reputation Destroyed!";
  document.getElementById('endGameBody').innerHTML = `
    <p style="color: #8b0000; font-weight: bold; font-size: 1.2rem;">LASER CATASTROPE!</p>
    <p>Enraged patrons shot lasers and completely burned the Medici Bank's reputation to 0 HP!</p>
    <br>
    <p><strong>Audit Lesson</strong>: Unverified claims or fraudulent payouts ruin bank solvency and reputation!</p>
  `;
  document.getElementById('nextLevelOrResetBtn').innerText = "🔄 Retry Level";
  document.getElementById('endGameModal').classList.add('show');
}

function showVictoryModal() {
  isGameOver = true;
  playSound('victory');
  const elapsed = Math.round((Date.now() - startTime) / 1000);

  document.getElementById('endGameTitle').innerText = "🎉 Bank Preserved & Audited!";
  document.getElementById('endGameBody').innerHTML = `
    <p style="color: #005500; font-weight: bold; font-size: 1.3rem;">LEVEL ${currentLevel} COMPLETED!</p>
    <br>
    <p><strong>Shift Completion Time:</strong> ${elapsed} seconds</p>
    <p><strong>Bank Reputation Preserved:</strong> ${bankReputation} HP / 100 HP</p>
    <br>
    <p><strong>Pedagogical Insight:</strong> ${currentLevel === 1 ? 
      "In Single-Entry Bookkeeping, verifying claims requires hunting through a long unorganized scroll to prevent fraud!" : 
      "In Double-Entry Bookkeeping, T-accounts pair Assets (Debit) with Client Claims (Credit), exposing false claims instantly!"}</p>
  `;

  document.getElementById('nextLevelOrResetBtn').innerText = currentLevel === 1 ? "🚀 Proceed to Level 2 (Double-Entry)" : "🔄 Replay Level 2";
  document.getElementById('endGameModal').classList.add('show');
}

function handleEndGameAction() {
  document.getElementById('endGameModal').classList.remove('show');
  if (bankReputation <= 0) {
    resetCurrentLevel();
  } else if (currentLevel === 1) {
    switchLevel(2);
  } else {
    resetCurrentLevel();
  }
}
