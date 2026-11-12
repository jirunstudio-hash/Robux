// State Sistem
let appState = {
  balance: 115475,
  currentSelectedAmount: 25,
  targetUser: {
    displayName: "Jirun",
    username: "sultancoins7",
    avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-11F24FE35A13710777B0AC655D187A13-Png/150/150/AvatarHeadshot/Webp/noFilter",
    joinYear: 2026
  }
};

// Elemen Tampilan Utama
const dynBalanceSpans = document.querySelectorAll(".dyn-balance");
const openSendFromHeader = document.getElementById("openSendFromHeader");
const btnOpenSendContent = document.getElementById("btnOpenSendContent");
const btnOpenSettings = document.getElementById("btnOpenSettings");

// Modal Pengaturan (⚙)
const settingsModalOverlay = document.getElementById("settingsModalOverlay");
const btnCloseSettings = document.getElementById("btnCloseSettings");
const settingBalanceInput = document.getElementById("settingBalanceInput");
const btnSaveBalance = document.getElementById("btnSaveBalance");
const btnAddPills = document.querySelectorAll(".btn-add-pill");

// Modal Kirim Robux
const modalOverlay = document.getElementById("modalOverlay");
const btnCloseModal = document.getElementById("btnCloseModal");
const modalBalanceDisplay = document.getElementById("modalBalanceDisplay");

// Steps Modal
const step1Search = document.getElementById("step1Search");
const step2Amount = document.getElementById("step2Amount");
const step3Confirm = document.getElementById("step3Confirm");
const step4Success = document.getElementById("step4Success");

// Step 1
const targetSearchInput = document.getElementById("targetSearchInput");
const emptyFriendsPlaceholder = document.getElementById("emptyFriendsPlaceholder");
const foundUserContainer = document.getElementById("foundUserContainer");
const targetUserCard = document.getElementById("targetUserCard");
const detectedAvatar = document.getElementById("detectedAvatar");
const detectedDisplayName = document.getElementById("detectedDisplayName");
const detectedUsername = document.getElementById("detectedUsername");

// Step 2
const step2Avatar = document.getElementById("step2Avatar");
const step2Name = document.getElementById("step2Name");
const manualAmountInput = document.getElementById("manualAmountInput");
const presetPills = document.querySelectorAll(".preset-pill");
const btnNextToConfirm = document.getElementById("btnNextToConfirm");

// Step 3
const step3Avatar = document.getElementById("step3Avatar");
const step3Name = document.getElementById("step3Name");
const step3Handle = document.getElementById("step3Handle");
const confirmAmountText = document.getElementById("confirmAmountText");
const btnSubmitSend = document.getElementById("btnSubmitSend");
const btnSendText = document.getElementById("btnSendText");
const btnSpinner = document.getElementById("btnSpinner");
const btnEditBack = document.getElementById("btnEditBack");

// Step 4
const successSentAmount = document.getElementById("successSentAmount");
const btnOkDone = document.getElementById("btnOkDone");

// Update Seluruh Saldo di Layar
function updateAllBalanceUI() {
  const formatted = appState.balance.toLocaleString("id-ID");
  dynBalanceSpans.forEach(el => el.textContent = formatted);
  modalBalanceDisplay.textContent = formatted;
  settingBalanceInput.value = appState.balance;
}

function showStep(step) {
  [step1Search, step2Amount, step3Confirm, step4Success].forEach(s => s.classList.add("hidden"));
  step.classList.remove("hidden");
}

function resetModalState() {
  targetSearchInput.value = "";
  emptyFriendsPlaceholder.classList.remove("hidden");
  foundUserContainer.classList.add("hidden");
  showStep(step1Search);
}

// ==============================================================
// 1. MODAL PENGATURAN: UBAH / TAMBAH SALDO (IKON ⚙)
// ==============================================================
btnOpenSettings.addEventListener("click", () => {
  settingBalanceInput.value = appState.balance;
  settingsModalOverlay.classList.remove("hidden");
});

btnCloseSettings.addEventListener("click", () => {
  settingsModalOverlay.classList.add("hidden");
});

btnAddPills.forEach(pill => {
  pill.addEventListener("click", () => {
    const addVal = parseInt(pill.getAttribute("data-add"));
    let cur = parseInt(settingBalanceInput.value) || 0;
    settingBalanceInput.value = cur + addVal;
  });
});

btnSaveBalance.addEventListener("click", () => {
  const newBal = parseInt(settingBalanceInput.value) || 0;
  appState.balance = newBal;
  updateAllBalanceUI();
  settingsModalOverlay.classList.add("hidden");
});

// ==============================================================
// 2. BUKA MODAL KIRIM (DARI HEADER ATAU TOMBOL KIRIM KONTEN)
// ==============================================================
[openSendFromHeader, btnOpenSendContent].forEach(btn => {
  btn.addEventListener("click", () => {
    resetModalState();
    modalOverlay.classList.remove("hidden");
  });
});

btnCloseModal.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

// ==============================================================
// 3. DETEKSI TARGET REAL-TIME
// ==============================================================
let searchTimer = null;

targetSearchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  clearTimeout(searchTimer);

  if (!query) {
    emptyFriendsPlaceholder.classList.remove("hidden");
    foundUserContainer.classList.add("hidden");
    return;
  }

  searchTimer = setTimeout(async () => {
    try {
      const res = await fetch(`/api/user?username=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok) {
        appState.targetUser = {
          displayName: data.displayName || data.name,
          username: data.name,
          avatarUrl: data.avatarUrl,
          joinYear: data.joinYear || 2026
        };

        detectedDisplayName.textContent = appState.targetUser.displayName;
        detectedUsername.textContent = `@${appState.targetUser.username}`;
        detectedAvatar.src = appState.targetUser.avatarUrl;

        emptyFriendsPlaceholder.classList.add("hidden");
        foundUserContainer.classList.remove("hidden");
      } else {
        emptyFriendsPlaceholder.classList.remove("hidden");
        foundUserContainer.classList.add("hidden");
      }
    } catch (err) {
      // Fallback preview
      appState.targetUser = {
        displayName: "Jirun",
        username: query,
        avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-11F24FE35A13710777B0AC655D187A13-Png/150/150/AvatarHeadshot/Webp/noFilter",
        joinYear: 2026
      };
      detectedDisplayName.textContent = appState.targetUser.displayName;
      detectedUsername.textContent = `@${appState.targetUser.username}`;
      detectedAvatar.src = appState.targetUser.avatarUrl;
      emptyFriendsPlaceholder.classList.add("hidden");
      foundUserContainer.classList.remove("hidden");
    }
  }, 300);
});

// Klik Target Terdeteksi
targetUserCard.addEventListener("click", () => {
  step2Name.textContent = appState.targetUser.displayName;
  step2Avatar.src = appState.targetUser.avatarUrl;
  manualAmountInput.value = appState.currentSelectedAmount;
  showStep(step2Amount);
});

// ==============================================================
// 4. INPUT NOMINAL ROBUX (MANUAL / PRESET)
// ==============================================================
manualAmountInput.addEventListener("input", (e) => {
  const val = parseInt(e.target.value) || 0;
  appState.currentSelectedAmount = val;

  presetPills.forEach(btn => {
    if (parseInt(btn.getAttribute("data-val")) === val) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
});

presetPills.forEach(pill => {
  pill.addEventListener("click", () => {
    presetPills.forEach(p => p.classList.remove("active"));
    pill.classList.add("active");

    const val = parseInt(pill.getAttribute("data-val"));
    appState.currentSelectedAmount = val;
    manualAmountInput.value = val;
  });
});

btnNextToConfirm.addEventListener("click", () => {
  if (appState.currentSelectedAmount <= 0) {
    alert("Masukkan nominal Robux yang valid.");
    return;
  }

  step3Name.textContent = appState.targetUser.displayName;
  step3Handle.textContent = `@${appState.targetUser.username}`;
  step3Avatar.src = appState.targetUser.avatarUrl;
  confirmAmountText.textContent = appState.currentSelectedAmount;

  showStep(step3Confirm);
});

btnEditBack.addEventListener("click", () => {
  showStep(step2Amount);
});

// ==============================================================
// 5. PROSES KIRIM & ANIMASI LOADING
// ==============================================================
btnSubmitSend.addEventListener("click", () => {
  btnSendText.classList.add("hidden");
  btnSpinner.classList.remove("hidden");
  btnSubmitSend.disabled = true;

  setTimeout(() => {
    appState.balance -= appState.currentSelectedAmount;
    updateAllBalanceUI();

    btnSendText.classList.remove("hidden");
    btnSpinner.classList.add("hidden");
    btnSubmitSend.disabled = false;

    successSentAmount.textContent = appState.currentSelectedAmount;
    showStep(step4Success);
  }, 1200);
});

// ==============================================================
// 6. TEKAN "OK" -> KEMBALI KE TAMPILAN AWAL
// ==============================================================
btnOkDone.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
  resetModalState();
});

// Inisialisasi awal
updateAllBalanceUI();
