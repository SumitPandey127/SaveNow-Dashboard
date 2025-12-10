// ---------- MEMBER DATABASE ----------
const memberDatabase = {}; // stores all members separately

// ---------- DEFAULT STATE ----------
const state = {
  totalSavings: 0,
  couponsPurchased: 0,
  membershipName: "Power12 – 1 Month",
  membershipExpiry: new Date("2025-12-31T23:59:59"),
};

// ---------- PRODUCTS ----------
const products = [
  { id: 1, name: "Weekly Groceries", price: 1200, cashbackPercent: 10 },
  { id: 2, name: "Fashion Order", price: 2500, cashbackPercent: 12 },
  { id: 3, name: "Electronics", price: 1800, cashbackPercent: 8 },
  { id: 4, name: "Food Delivery", price: 600, cashbackPercent: 15 },
];

// ---------- ELEMENTS ----------
const metricTotalSavingsEl = document.getElementById("metricTotalSavings");
const metricCouponsEl = document.getElementById("metricCoupons");
const metricMembershipTypeEl = document.getElementById("metricMembershipType");
const metricTimeRemainingEl = document.getElementById("metricTimeRemaining");
const membershipPlanLabelEl = document.getElementById("membershipPlanLabel");
const membershipStatusBadgeEl = document.getElementById("membershipStatusBadge");
const countdownTextEl = document.getElementById("countdownText");

const dashTotalSavingsEl = document.getElementById("dashTotalSavings");
const dashCouponsEl = document.getElementById("dashCoupons");
const dashMembershipNameEl = document.getElementById("dashMembershipName");
const dashValidityEl = document.getElementById("dashValidity");

const productsGridEl = document.getElementById("productsGrid");
const membershipSelectEl = document.getElementById("membershipSelect");
const applyMembershipBtn = document.getElementById("applyMembershipBtn");
const buyCouponBtn = document.getElementById("buyCouponBtn");
const billUploadEl = document.getElementById("billUpload");
const filesListEl = document.getElementById("filesList");

// ---------- MEMBER LOADING ----------
function loadMember(id) {
  if (!memberDatabase[id]) {
    // create new record
    memberDatabase[id] = {
      totalSavings: 0,
      couponsPurchased: 0,
      membershipName: "Power12 – 1 Month",
      membershipExpiry: new Date("2025-12-31T23:59:59"),
    };
  }

  const data = memberDatabase[id];

  state.totalSavings = data.totalSavings;
  state.couponsPurchased = data.couponsPurchased;
  state.membershipName = data.membershipName;
  state.membershipExpiry = new Date(data.membershipExpiry);

  document.getElementById("memberId").textContent = id;

  renderState();
}

// save data for current member
function saveMemberData() {
  const id = document.getElementById("memberId").textContent;
  if (!id || id === "Not Loaded") return;

  memberDatabase[id] = {
    totalSavings: state.totalSavings,
    couponsPurchased: state.couponsPurchased,
    membershipName: state.membershipName,
    membershipExpiry: state.membershipExpiry,
  };
}

// ---------- HELPERS ----------
function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function timeRemaining(expiry) {
  const now = new Date();
  const diff = expiry - now;

  if (diff <= 0) return { expired: true, text: "Expired" };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { expired: false, text: `${days}d ${hours}h ${minutes}m` };
}

// ---------- UI RENDER ----------
function renderState() {
  metricTotalSavingsEl.textContent = formatCurrency(state.totalSavings);
  metricCouponsEl.textContent = state.couponsPurchased;
  metricMembershipTypeEl.textContent = state.membershipName;
  membershipPlanLabelEl.textContent = state.membershipName;

  const remaining = timeRemaining(state.membershipExpiry);
  metricTimeRemainingEl.textContent = remaining.text;
  countdownTextEl.textContent = remaining.text;

  if (remaining.expired) {
    membershipStatusBadgeEl.textContent = "Expired";
    membershipStatusBadgeEl.className = "badge-expired";
  } else {
    membershipStatusBadgeEl.textContent = "Active";
    membershipStatusBadgeEl.className = "badge-active";
  }

  dashTotalSavingsEl.textContent = formatCurrency(state.totalSavings);
  dashCouponsEl.textContent = state.couponsPurchased;
  dashMembershipNameEl.textContent = state.membershipName;

  dashValidityEl.textContent =
    state.membershipExpiry.toLocaleDateString() + " · " + remaining.text;
}

// ---------- PRODUCTS ----------
function renderProducts() {
  productsGridEl.innerHTML = "";

  products.forEach((p) => {
    const box = document.createElement("div");
    box.className = "product-card";

    box.innerHTML = `
      <div class="product-name">${p.name}</div>
      <div>${formatCurrency(p.price)} | 
      <span class="product-cashback">${p.cashbackPercent}% cashback</span></div>
    `;

    const btn = document.createElement("button");
    btn.textContent = "Buy (Demo)";
    btn.onclick = () => buyProduct(p);

    box.appendChild(btn);
    productsGridEl.appendChild(box);
  });
}

// ---------- BUY PRODUCT ----------
function buyProduct(product) {
  const cashback = Math.round((product.price * product.cashbackPercent) / 100);

  state.totalSavings += cashback;
  state.couponsPurchased += 1;

  saveMemberData();
  renderState();
}

// ---------- MEMBERSHIP UPDATE ----------
function updateMembership() {
  const [name, tier, expiry] = membershipSelectEl.value.split("|");

  state.membershipName = name.trim();
  state.membershipExpiry = new Date(expiry.trim() + "T23:59:59");

  saveMemberData();
  renderState();
}

// ---------- UPLOAD ----------
function renderFileList(files) {
  filesListEl.innerHTML = "";

  for (const file of files) {
    const line = document.createElement("div");
    line.className = "file-item";
    line.innerHTML = `
      <span>${file.name}</span>
      <span class="file-tag">Uploaded</span>
    `;
    filesListEl.appendChild(line);
  }
}

// ---------- INIT ----------
function init() {

  renderProducts();
  renderState();

  document.getElementById("loadMemberBtn").onclick = () => {
    const id = document.getElementById("memberIdInput").value.trim();
    if (!id) return alert("Enter a valid Member ID");
    loadMember(id);
  };

  applyMembershipBtn.onclick = updateMembership;

  buyCouponBtn.onclick = () => {
    state.couponsPurchased += 1;
    saveMemberData();
    renderState();
  };

  billUploadEl.onchange = (e) => renderFileList(e.target.files);

  setInterval(renderState, 20000);
}

init();
