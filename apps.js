// State Sistem
let appState = {
  balance: 113500,
  targetUser: {
    displayName: "Jirun",
    name: "sultancoins7",
    avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-11F24FE35A13710777B0AC655D187A13-Png/150/150/AvatarHeadshot/Webp/noFilter",
    joinYear: 2026
  },
  amount: 25,
  friendsList: []
};

// Elemen DOM
const headerBalance = document.getElementById("headerBalance");
const modalBalanceDisplay = document.getElementById("modalBalanceDisplay");
const btnOpenKirim = document.getElementById("btnOpenKirim");
const modalOverlay = document.getElementById("modalOverlay");
const btnCloseModal = document.getElementById("btnCloseModal");

// Step Containers
const stepSearchTarget = document.getElementById("stepSearchTarget");
const stepInputAmount = document.getElementById("stepInputAmount");
const stepConfirmSend = document.getElementById("stepConfirmSend");
const stepSuccess = document.getElementById("stepSuccess");

// Step 1: Input Search & Filter
const targetUsernameInput = document.getElementById("targetUsernameInput");
const btnFetchTarget = document.getElementById("btnFetchTarget");
const searchStatus = document.getElementById("searchStatus");
const friendsPickerList = document.getElementById("friendsPickerList");
const modalFriendsCount = document.getElementById("modalFriendsCount");

// Step 2: Amount & Presets
const robuxManualInput = document.getElementById("robuxManualInput");
const presetPills = document.querySelectorAll(".preset-pill");
const btnGoToConfirm = document.getElementById("btnGoToConfirm");

// Step 3 & 4
const btnSendFinal = document.getElementById("btnSendFinal");
const btnEditBack = document.getElementById("btnEditBack");
const btnSuccessOk = document.getElementById("btnSuccessOk");

function setStep(step) {
  [stepSearchTarget, stepInputAmount, stepConfirmSend, stepSuccess].forEach(s => s.classList.add("hidden"));
  step.classList.remove("hidden");
}

function refreshBalance() {
  const formatted = appState.balance.toLocaleString("id-ID");
  headerBalance.textContent = formatted;
  modalBalanceDisplay.textContent = formatted;
}

// ==============================================================
// 1. DETEKSI AKUN TARGET SECARA AKURAT DARI API
// ==============================================================
async function detectTargetUser(username) {
  if (!username) return;
  searchStatus.textContent = "Mendeteksi akun Roblox...";
  searchStatus.style.color = "#0070f3";

  try {
    const res = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!res.ok) {
      searchStatus.textContent = data.error || "Pengguna tidak ditemukan.";
      searchStatus.style.color = "#ef4444";
      return;
    }

    // Set Akun Target yang Terdeteksi
    appState.targetUser = {
      displayName: data.displayName,
      name: data.name,
      avatarUrl: data.avatarUrl,
      joinYear: data.joinYear || 2026
    };

    // Buka Langkah Input Robux (Foto 3)
    document.getElementById("targetNameStep2").textContent = data.displayName;
    document.getElementById("targetAvatarStep2").src = data.avatarUrl;
    searchStatus.textContent = "";

    setStep(stepInputAmount);

  } catch (err) {
    searchStatus.textContent = "Gagal menghubungi server Roblox.";
    searchStatus.style.color = "#ef4444";
  }
}

btnFetchTarget.addEventListener("click", () => {
  detectTargetUser(targetUsernameInput.value.trim());
});

targetUsernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    detectTargetUser(targetUsernameInput.value.trim());
  }
});

// Render Teman di Modal (Bisa dipilih langsung)
function loadInitialFriends() {
  const dummyFriends = [
    { name: "Sub2Swift", displayName: "Sub2Swift", avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-11F24FE35A13710777B0AC655D187A13-Png/150/150/AvatarHeadshot/Webp/noFilter" },
    { name: "sad_boy", displayName: "sad_boy", avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C9AA74A7C18BD9C7A179BC58509F9C62-Png/150/150/AvatarHeadshot/Webp/noFilter" },
    { name: "Mila", displayName: "Mila", avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-F74254DF57463DA6ED56D60DE2B7218F-Png/150/150/AvatarHeadshot/Webp/noFilter" },
    { name: "05samuel_2017", displayName: "05samuel_2017", avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-B1DFBFF37A179C933C710A88F11BAE24-Png/150/150/AvatarHeadshot/Webp/noFilter" }
  ];

  modalFriendsCount.textContent = dummyFriends.length;
  friendsPickerList.innerHTML = "";

  dummyFriends.forEach(f => {
    const row = document.createElement("div");
    row.className = "friend-row";
    row.innerHTML = `
      <img src="${f.avatarUrl}" alt="">
      <span style="font-weight: 600; font-size: 14px;">${f.displayName}</span>
    `;
    row.addEventListener("click", () => {
      // Deteksi akun teman yang diklik
      detectTargetUser(f.name);
    });
    friendsPickerList.appendChild(row);
  });
}

// ==============================================================
// 2. INPUT MANUAL ROBUX & PRESET PILIHAN (25, 50, 100, 200)
// ==============================================================
// Input Manual (Ketik Angka Bebas)
robuxManualInput.addEventListener("input", (e) => {
  const val = parseInt(e.target.value) || 0;
  appState.amount = val;

  // Hapus tanda aktif di tombol preset jika angka diketik bebas
  presetPills.forEach(btn => {
    if (parseInt(btn.getAttribute("data-val")) === val) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
});

// Pilih Opsi Preset (25, 50, 100, 200)
presetPills.forEach(btn => {
  btn.addEventListener("click", () => {
    presetPills.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const val = parseInt(btn.getAttribute("data-val"));
    appState.amount = val;
    robuxManualInput.value = val; // Update kolom input manual
  });
});

// Lanjut ke Konfirmasi (Foto 4)
btnGoToConfirm.addEventListener("click", () => {
  if (appState.amount <= 0) {
    alert("Masukkan nominal Robux yang valid.");
    return;
  }

  const t = appState.targetUser;
  document.getElementById("targetNameStep3").textContent = t.displayName;
  document.getElementById("targetUsernameStep3").textContent = `@${t.name}`;
  document.getElementById("targetAvatarStep3").src = t.avatarUrl;
  document.getElementById("confirmAmountDisplay").textContent = appState.amount;
  document.getElementById("targetJoinYearStep3").textContent = `ⓘ Bergabung pada tahun ${t.joinYear}`;

  setStep(stepConfirmSend);
});

// Tombol Edit (Kembali ke Foto 3)
btnEditBack.addEventListener("click", () => {
  setStep(stepInputAmount);
});

// ==============================================================
// 3. EKSEKUSI KIRIM (Foto 5 Sukses Centang & Kurangi Saldo)
// ==============================================================
btnSendFinal.addEventListener("click", () => {
  appState.balance -= appState.amount;
  refreshBalance();

  document.getElementById("successRobuxNumber").textContent = appState.amount;
  setStep(stepSuccess);
});

btnSuccessOk.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
  setStep(stepSearchTarget);
});

// Buka & Tutup Modal
btnOpenKirim.addEventListener("click", () => {
  setStep(stepSearchTarget);
  modalOverlay.classList.remove("hidden");
});

btnCloseModal.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

// Inisialisasi
loadInitialFriends();
refreshBalance();
