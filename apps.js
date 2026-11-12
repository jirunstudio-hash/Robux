// State Sistem (Saldo Awal 10.000)
let appState = {
  balance: 10000,
  currentSelectedAmount: 0,
  targetUser: {
    displayName: "Jirun",
    username: "sultancoins7",
    avatarUrl: "",
    joinYear: 2026
  }
};

// Elemen DOM
const dynBalanceSpans = document.querySelectorAll(".dyn-balance");
const btnOnlyKirimText = document.getElementById("btnOnlyKirimText"); // HANYA TEKS KIRIM
const btnOpenSettings = document.getElementById("btnOpenSettings");   // IKON ⚙
const navUserAvatar = document.getElementById("navUserAvatar");
const navAvatarPlaceholder = document.getElementById("navAvatarPlaceholder");
const sideUserAvatar = document.getElementById("sideUserAvatar");
const sideAvatarPlaceholder = document.getElementById("sideAvatarPlaceholder");
const promoBannerCard = document.getElementById("promoBannerCard");

// Modal Pengaturan (⚙)
const settingsModalOverlay = document.getElementById("settingsModalOverlay");
const btnCloseSettings = document.getElementById("btnCloseSettings");
const settingBalanceInput = document.getElementById("settingBalanceInput");
const btnSaveBalance = document.getElementById("btnSaveBalance");
const btnAddPills = document.querySelectorAll(".btn-add-pill");

// File Upload
const btnTriggerAvatarUpload = document.getElementById("btnTriggerAvatarUpload");
const avatarFileInput = document.getElementById("avatarFileInput");
const btnTriggerBannerUpload = document.getElementById("btnTriggerBannerUpload");
const bannerFileInput = document.getElementById("bannerFileInput");

// Modal Kirim Robux
const modalOverlay = document.getElementById("modalOverlay");
const btnCloseModal = document.getElementById("btnCloseModal");
const modalBalanceDisplay = document.getElementById("modalBalanceDisplay");

// Steps
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
const step3JoinYear = document.getElementById("step3JoinYear");
const confirmAmountText = document.getElementById("confirmAmountText");
const btnSubmitSend = document.getElementById("btnSubmitSend");
const btnSendText = document.getElementById("btnSendText");
const btnSpinner = document.getElementById("btnSpinner");
const btnEditBack = document.getElementById("btnEditBack");

// Step 4
const successSentAmount = document.getElementById("successSentAmount");
const btnOkDone = document.getElementById("btnOkDone");

// Update Tampilan Saldo
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

function resizeAmountInput() {
  const len = manualAmountInput.value.length || 1;
  manualAmountInput.style.width = `${len + 0.2}ch`;
}

function resetModalState() {
  targetSearchInput.value = "";
  emptyFriendsPlaceholder.classList.remove("hidden");
  foundUserContainer.classList.add("hidden");
  appState.currentSelectedAmount = 0;
  manualAmountInput.value = "0";
  resizeAmountInput();
  presetPills.forEach(p => p.classList.remove("active"));
  showStep(step1Search);
}

// Pasang Foto Profil dari LocalStorage / File
function applyAvatarImage(imgData) {
  navUserAvatar.src = imgData;
  sideUserAvatar.src = imgData;
  navUserAvatar.classList.remove("hidden");
  sideUserAvatar.classList.remove("hidden");
  navAvatarPlaceholder.classList.add("hidden");
  sideAvatarPlaceholder.classList.add("hidden");
}

// ==============================================================
// 1. PENGATURAN (IKON ⚙): UPLOAD FOTO & UBAH SALDO
// ==============================================================
btnOpenSettings.addEventListener("click", () => {
  settingBalanceInput.value = appState.balance;
  settingsModalOverlay.classList.remove("hidden");
});

btnCloseSettings.addEventListener("click", () => {
  settingsModalOverlay.classList.add("hidden");
});

// Upload Foto Profil Jirun dari Galeri
btnTriggerAvatarUpload.addEventListener("click", () => avatarFileInput.click());
avatarFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgData = event.target.result;
      applyAvatarImage(imgData);
      localStorage.setItem("savedCustomAvatar", imgData);
      alert("Foto profil berhasil dipasang!");
    };
    reader.readAsDataURL(file);
  }
});

// Upload Foto Banner Promo dari Galeri
btnTriggerBannerUpload.addEventListener("click", () => bannerFileInput.click());
bannerFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const bannerData = event.target.result;
      promoBannerCard.style.backgroundImage = `url('${bannerData}')`;
      localStorage.setItem("savedCustomBanner", bannerData);
      alert("Foto banner berhasil dipasang!");
    };
    reader.readAsDataURL(file);
  }
});

// Cek Apakah User Pernah Upload Sebelumnya
window.addEventListener("DOMContentLoaded", () => {
  const savedAvatar = localStorage.getItem("savedCustomAvatar");
  if (savedAvatar) {
    applyAvatarImage(savedAvatar);
  }
  const savedBanner = localStorage.getItem("savedCustomBanner");
  if (savedBanner) {
    promoBannerCard.style.backgroundImage = `url('${savedBanner}')`;
  }
  updateAllBalanceUI();
});

// Tambah Saldo Cepat
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
// 2. HANYA TEKS '↑ Kirim' DI KONTEN YANG BUKA POPUP
// ==============================================================
btnOnlyKirimText.addEventListener("click", () => {
  resetModalState();
  modalOverlay.classList.remove("hidden");
});

btnCloseModal.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

// ==============================================================
// 3. DETEKSI AKUN REAL-TIME DARI ROBLOX API
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
      appState.targetUser = {
        displayName: query,
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
  
  appState.currentSelectedAmount = 0;
  manualAmountInput.value = "0";
  resizeAmountInput();
  presetPills.forEach(p => p.classList.remove("active"));

  showStep(step2Amount);
});

// ==============================================================
// 4. INPUT MANUAL MURNI KEYBOARD (NO WHEEL & NO GARIS)
// ==============================================================
manualAmountInput.addEventListener("wheel", (e) => {
  e.preventDefault();
}, { passive: false });

manualAmountInput.addEventListener("input", (e) => {
  let val = e.target.value.replace(/[^0-9]/g, "");

  if (val.length > 1 && val.startsWith("0")) {
    val = val.replace(/^0+/, "");
  }

  if (!val) {
    val = "0";
  }

  manualAmountInput.value = val;
  appState.currentSelectedAmount = parseInt(val) || 0;

  presetPills.forEach(btn => {
    if (parseInt(btn.getAttribute("data-val")) === appState.currentSelectedAmount) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  resizeAmountInput();
});

manualAmountInput.addEventListener("focus", () => {
  if (manualAmountInput.value === "0") {
    manualAmountInput.select();
  }
});

// Preset Buttons (25, 50, 100, 200)
presetPills.forEach(pill => {
  pill.addEventListener("click", () => {
    presetPills.forEach(p => p.classList.remove("active"));
    pill.classList.add("active");

    const val = parseInt(pill.getAttribute("data-val"));
    appState.currentSelectedAmount = val;
    manualAmountInput.value = val.toString();
    resizeAmountInput();
  });
});

// Lanjut ke Konfirmasi
btnNextToConfirm.addEventListener("click", () => {
  if (appState.currentSelectedAmount <= 0) {
    alert("Masukkan nominal Robux yang lebih dari 0.");
    return;
  }

  step3Name.textContent = appState.targetUser.displayName;
  step3Handle.textContent = `@${appState.targetUser.username}`;
  step3Avatar.src = appState.targetUser.avatarUrl;
  step3JoinYear.textContent = `ⓘ Bergabung pada tahun ${appState.targetUser.joinYear}`;
  confirmAmountText.textContent = appState.currentSelectedAmount;

  showStep(step3Confirm);
});

btnEditBack.addEventListener("click", () => {
  showStep(step2Amount);
});

// ==============================================================
// 5. PROSES KIRIM: LOADING TEPAT 5 DETIK
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
  }, 5000);
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
