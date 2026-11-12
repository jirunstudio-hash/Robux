// State Sistem
let appState = {
  balance: 115475, // Saldo awal Foto 1
  currentSelectedAmount: 25,
  targetUser: {
    displayName: "Jirun",
    username: "sultancoins7",
    avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-11F24FE35A13710777B0AC655D187A13-Png/150/150/AvatarHeadshot/Webp/noFilter",
    joinYear: 2026
  }
};

// Elemen DOM Trigger & Modal
const hotspotHeaderKirim = document.getElementById("hotspotHeaderKirim");
const hotspotSidebarKirim = document.getElementById("hotspotSidebarKirim");
const modalOverlay = document.getElementById("modalOverlay");
const btnCloseModal = document.getElementById("btnCloseModal");
const modalBalanceDisplay = document.getElementById("modalBalanceDisplay");

// Step Panels
const step1Search = document.getElementById("step1Search");
const step2Amount = document.getElementById("step2Amount");
const step3Confirm = document.getElementById("step3Confirm");
const step4Success = document.getElementById("step4Success");

// Step 1 Elemen
const targetSearchInput = document.getElementById("targetSearchInput");
const emptyFriendsPlaceholder = document.getElementById("emptyFriendsPlaceholder");
const foundUserContainer = document.getElementById("foundUserContainer");
const targetUserCard = document.getElementById("targetUserCard");
const detectedAvatar = document.getElementById("detectedAvatar");
const detectedDisplayName = document.getElementById("detectedDisplayName");
const detectedUsername = document.getElementById("detectedUsername");

// Step 2 Elemen
const step2Avatar = document.getElementById("step2Avatar");
const step2Name = document.getElementById("step2Name");
const manualAmountInput = document.getElementById("manualAmountInput");
const presetPills = document.querySelectorAll(".preset-pill");
const btnNextToConfirm = document.getElementById("btnNextToConfirm");

// Step 3 Elemen
const step3Avatar = document.getElementById("step3Avatar");
const step3Name = document.getElementById("step3Name");
const step3Handle = document.getElementById("step3Handle");
const confirmAmountText = document.getElementById("confirmAmountText");
const btnSubmitSend = document.getElementById("btnSubmitSend");
const btnSendText = document.getElementById("btnSendText");
const btnSpinner = document.getElementById("btnSpinner");
const btnEditBack = document.getElementById("btnEditBack");

// Step 4 Elemen
const successSentAmount = document.getElementById("successSentAmount");
const btnOkDone = document.getElementById("btnOkDone");

// Ganti Step Modal
function showStep(step) {
  [step1Search, step2Amount, step3Confirm, step4Success].forEach(s => s.classList.add("hidden"));
  step.classList.remove("hidden");
}

// Update Saldo Modal
function renderBalance() {
  modalBalanceDisplay.textContent = appState.balance.toLocaleString("id-ID");
}

// Buka Modal (Dari Header atau Sidebar Kiri)
function openModal() {
  resetModalToStart();
  modalOverlay.classList.remove("hidden");
}

hotspotHeaderKirim.addEventListener("click", openModal);
hotspotSidebarKirim.addEventListener("click", openModal);
btnCloseModal.addEventListener("click", () => modalOverlay.classList.add("hidden"));

// ==============================================================
// 1. PENCARIAN & DETEKSI AKUN REAL-TIME (FOTO 1 -> FOTO 2)
// ==============================================================
let searchDebounce = null;

targetSearchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();

  clearTimeout(searchDebounce);
  if (!query) {
    emptyFriendsPlaceholder.classList.remove("hidden");
    foundUserContainer.classList.add("hidden");
    return;
  }

  // Cari ke API Roblox
  searchDebounce = setTimeout(async () => {
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
      // Fallback lokal jika API offline saat tes
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

// Klik Target Terdeteksi -> Pindah ke Step 2 (Foto 3)
targetUserCard.addEventListener("click", () => {
  step2Name.textContent = appState.targetUser.displayName;
  step2Avatar.src = appState.targetUser.avatarUrl;
  manualAmountInput.value = appState.currentSelectedAmount;

  showStep(step2Amount);
});

// ==============================================================
// 2. INPUT MANUAL ROBUX & PRESET PILIHAN (FOTO 3)
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
    alert("Masukkan nominal Robux terlebih dahulu.");
    return;
  }

  // Siapkan data konfirmasi (Foto 4)
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
// 3. EKSEKUSI KIRIM + LOADING PUTAR (FOTO 4 -> FOTO 5 -> FOTO 6)
// ==============================================================
btnSubmitSend.addEventListener("click", () => {
  // 1. Tampilkan animasi loading spinner (Foto 5)
  btnSendText.classList.add("hidden");
  btnSpinner.classList.remove("hidden");
  btnSubmitSend.disabled = true;

  setTimeout(() => {
    // 2. Kurangi saldo
    appState.balance -= appState.currentSelectedAmount;
    renderBalance();

    // 3. Matikan loading
    btnSendText.classList.remove("hidden");
    btnSpinner.classList.add("hidden");
    btnSubmitSend.disabled = false;

    // 4. Masuk ke layar sukses (Foto 6)
    successSentAmount.textContent = appState.currentSelectedAmount;
    showStep(step4Success);
  }, 1200);
});

// ==============================================================
// 4. KLIK OK -> KEMBALI KE AWAL (FOTO 1) & TARGET TER-REFRESH
// ==============================================================
function resetModalToStart() {
  targetSearchInput.value = "";
  emptyFriendsPlaceholder.classList.remove("hidden");
  foundUserContainer.classList.add("hidden");
  showStep(step1Search);
}

btnOkDone.addEventListener("click", () => {
  // Sesuai permintaan Anda: masuk ke tampilan awal dan langsung ke-refresh untuk target baru
  resetModalToStart();
});

// Inisialisasi Awal
renderBalance();
