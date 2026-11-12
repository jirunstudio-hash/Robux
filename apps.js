// State Sistem
let state = {
  balance: 113500,
  selectedAmount: 25,
  recipient: {
    displayName: "Jirun",
    username: "sultancoins7",
    avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-11F24FE35A13710777B0AC655D187A13-Png/150/150/AvatarHeadshot/Webp/noFilter"
  }
};

// Nav & Balance Elements
const navBalance = document.getElementById("navBalance");
const modalBalanceDisplay = document.getElementById("modalBalanceDisplay");
const openSendModalBtn = document.getElementById("openSendModalBtn");
const openSettingsBtn = document.getElementById("openSettingsBtn");

// Modals
const sendRobuxModal = document.getElementById("sendRobuxModal");
const settingsModal = document.getElementById("settingsModal");
const closeSendModal = document.getElementById("closeSendModal");
const closeSettingsModal = document.getElementById("closeSettingsModal");

// Steps in Send Modal
const stepFriends = document.getElementById("stepFriends");
const stepAmount = document.getElementById("stepAmount");
const stepConfirm = document.getElementById("stepConfirm");
const stepSuccess = document.getElementById("stepSuccess");

// Update Tampilan Saldo
function updateBalanceDisplays() {
  const formatted = state.balance.toLocaleString("id-ID");
  navBalance.textContent = formatted;
  modalBalanceDisplay.textContent = formatted;
}

// Buka / Tutup Modal
openSendModalBtn.addEventListener("click", () => {
  showStep(stepFriends);
  sendRobuxModal.classList.remove("hidden");
});

closeSendModal.addEventListener("click", () => sendRobuxModal.classList.add("hidden"));
openSettingsBtn.addEventListener("click", () => settingsModal.classList.remove("hidden"));
closeSettingsModal.addEventListener("click", () => settingsModal.classList.add("hidden"));

// Helper Navigasi Antar Step
function showStep(stepElement) {
  [stepFriends, stepAmount, stepConfirm, stepSuccess].forEach(s => s.classList.add("hidden"));
  stepElement.classList.remove("hidden");
}

// ==========================================
// 1. KLIK TEMAN DI LIST (Foto 2 -> Foto 3)
// ==========================================
document.querySelectorAll(".friend-item").forEach(item => {
  item.addEventListener("click", () => {
    state.recipient.displayName = item.getAttribute("data-name");
    state.recipient.username = item.getAttribute("data-username");
    state.recipient.avatarUrl = item.getAttribute("data-avatar");

    // Pasang data ke Step 2
    document.getElementById("targetNameStep2").textContent = state.recipient.displayName;
    document.getElementById("targetAvatarStep2").src = state.recipient.avatarUrl;

    showStep(stepAmount);
  });
});

// ==========================================
// 2. PILIH NOMINAL PRESET (Foto 3)
// ==========================================
const presetButtons = document.querySelectorAll(".preset-pill");
presetButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    presetButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.selectedAmount = parseInt(btn.getAttribute("data-val"));
    document.getElementById("chosenAmountText").textContent = state.selectedAmount;
  });
});

document.getElementById("btnGotoConfirm").addEventListener("click", () => {
  // Pasang data ke Step 3 (Konfirmasi)
  document.getElementById("targetAvatarStep3").src = state.recipient.avatarUrl;
  document.getElementById("targetNameStep3").textContent = state.recipient.displayName;
  document.getElementById("targetUserTagStep3").textContent = `@${state.recipient.username}`;
  document.getElementById("finalRobuxAmount").textContent = state.selectedAmount;

  showStep(stepConfirm);
});

// Tombol Edit di Konfirmasi (Kembali ke Step 2)
document.getElementById("btnEditBack").addEventListener("click", () => {
  showStep(stepAmount);
});

// ==========================================
// 3. EKSEKUSI KIRIM (Foto 4 -> Foto 5 Potong Saldo)
// ==========================================
document.getElementById("btnExecuteSend").addEventListener("click", () => {
  // Potong saldo
  state.balance -= state.selectedAmount;
  updateBalanceDisplays();

  document.getElementById("successSentVal").textContent = state.selectedAmount;
  showStep(stepSuccess);
});

document.getElementById("btnSuccessOk").addEventListener("click", () => {
  sendRobuxModal.classList.add("hidden");
  showStep(stepFriends);
});

// ==========================================
// 4. SETTINGS & FETCH PROFILE (Foto 6)
// ==========================================
const cfgDisplayName = document.getElementById("cfgDisplayName");
const cfgUsername = document.getElementById("cfgUsername");
const cfgBalanceAmount = document.getElementById("cfgBalanceAmount");
const cfgBtnFetch = document.getElementById("cfgBtnFetch");

cfgBtnFetch.addEventListener("click", async () => {
  const uName = cfgUsername.value.trim();
  if (!uName) return alert("Masukkan username");

  cfgBtnFetch.textContent = "Fetching...";
  try {
    const res = await fetch(`/api/user?username=${encodeURIComponent(uName)}`);
    const data = await res.json();
    if (res.ok) {
      cfgDisplayName.value = data.displayName || data.name;
      state.recipient.avatarUrl = data.avatarUrl;
      alert("Profil berhasil diambil!");
    } else {
      alert(data.error || "Gagal mengambil akun");
    }
  } catch (e) {
    alert("Gagal koneksi ke API");
  } finally {
    cfgBtnFetch.textContent = "🔍 Fetch Profile";
  }
});

document.getElementById("cfgSaveBtn").addEventListener("click", () => {
  state.balance = parseInt(cfgBalanceAmount.value) || 0;
  state.recipient.displayName = cfgDisplayName.value;
  state.recipient.username = cfgUsername.value;
  updateBalanceDisplays();
  settingsModal.classList.add("hidden");
});

// Inisialisasi awal
updateBalanceDisplays();
