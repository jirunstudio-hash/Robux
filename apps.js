// State Sistem
let appState = {
  balance: 115475,
  targetUser: {
    displayName: "Jirun",
    name: "sultancoins7",
    avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-11F24FE35A13710777B0AC655D187A13-Png/150/150/AvatarHeadshot/Webp/noFilter",
    joinYear: 2026
  },
  amount: 25
};

// Elemen Navigasi & Gambar
const headerBalanceDisplay = document.getElementById("headerBalanceDisplay");
const modalBalanceNumber = document.getElementById("modalBalanceNumber");
const btnSettingsGear = document.getElementById("btnSettingsGear");
const galleryFileInput = document.getElementById("galleryFileInput");
const bodyGalleryImage = document.getElementById("bodyGalleryImage");
const emptyImagePrompt = document.getElementById("emptyImagePrompt");
const btnPromptUpload = document.getElementById("btnPromptUpload");

// Elemen Modal Kirim
const openSendRobuxBtn = document.getElementById("openSendRobuxBtn");
const sendModalOverlay = document.getElementById("sendModalOverlay");
const btnCloseModal = document.getElementById("btnCloseModal");

const step1Target = document.getElementById("step1Target");
const step2Amount = document.getElementById("step2Amount");
const step3Confirm = document.getElementById("step3Confirm");
const step4Success = document.getElementById("step4Success");

const targetUsernameInput = document.getElementById("targetUsernameInput");
const btnDetectUser = document.getElementById("btnDetectUser");
const detectStatusText = document.getElementById("detectStatusText");
const quickFriendsList = document.getElementById("quickFriendsList");

const robuxManualInput = document.getElementById("robuxManualInput");
const presetBtns = document.querySelectorAll(".preset-btn");
const btnGotoStep3 = document.getElementById("btnGotoStep3");
const btnBackToStep2 = document.getElementById("btnBackToStep2");
const btnExecuteSend = document.getElementById("btnExecuteSend");
const btnSuccessOk = document.getElementById("btnSuccessOk");

function setStep(step) {
  [step1Target, step2Amount, step3Confirm, step4Success].forEach(s => s.classList.add("hidden"));
  step.classList.remove("hidden");
}

function updateBalanceUI() {
  const formatted = appState.balance.toLocaleString("en-US");
  headerBalanceDisplay.textContent = formatted;
  modalBalanceNumber.textContent = formatted;
}

// ==============================================================
// 1. FITUR UPLOAD FOTO BAWAH VIA GALERI (IKON ⚙)
// ==============================================================
btnSettingsGear.addEventListener("click", () => {
  galleryFileInput.click(); // Langsung buka galeri / file manager
});

if (btnPromptUpload) {
  btnPromptUpload.addEventListener("click", () => {
    galleryFileInput.click();
  });
}

galleryFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target.result;
      bodyGalleryImage.src = imgUrl;
      bodyGalleryImage.style.display = "block";
      emptyImagePrompt.style.display = "none";
      // Simpan ke memori browser agar saat di-refresh foto tidak hilang
      localStorage.setItem("savedRobloxBodyImage", imgUrl);
    };
    reader.readAsDataURL(file);
  }
});

// Cek apakah ada foto yang tersimpan sebelumnya
window.addEventListener("DOMContentLoaded", () => {
  const savedImg = localStorage.getItem("savedRobloxBodyImage");
  if (savedImg) {
    bodyGalleryImage.src = savedImg;
    bodyGalleryImage.style.display = "block";
    emptyImagePrompt.style.display = "none";
  } else {
    bodyGalleryImage.style.display = "none";
    emptyImagePrompt.style.display = "block";
  }
  loadQuickFriends();
  updateBalanceUI();
});

// ==============================================================
// 2. DETEKSI USERNAME TARGET DARI API ROBLOX
// ==============================================================
async function detectUser(username) {
  if (!username) return;
  detectStatusText.textContent = "Mendeteksi akun Roblox...";
  detectStatusText.style.color = "#0070f3";

  try {
    const res = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!res.ok) {
      detectStatusText.textContent = data.error || "Pengguna tidak ditemukan.";
      detectStatusText.style.color = "#ef4444";
      return;
    }

    appState.targetUser = {
      displayName: data.displayName,
      name: data.name,
      avatarUrl: data.avatarUrl,
      joinYear: data.joinYear || 2026
    };

    // Tampilkan di Step 2
    document.getElementById("step2TargetName").textContent = data.displayName;
    document.getElementById("step2TargetAvatar").src = data.avatarUrl;
    detectStatusText.textContent = "";

    setStep(step2Amount);
  } catch (err) {
    detectStatusText.textContent = "Gagal menghubungi server Roblox.";
    detectStatusText.style.color = "#ef4444";
  }
}

btnDetectUser.addEventListener("click", () => {
  detectUser(targetUsernameInput.value.trim());
});

targetUsernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") detectUser(targetUsernameInput.value.trim());
});

// ==============================================================
// 3. INPUT MANUAL ROBUX & PRESET PILIHAN (25, 50, 100, 200)
// ==============================================================
// Input Manual (Ketik Angka Bebas)
robuxManualInput.addEventListener("input", (e) => {
  const val = parseInt(e.target.value) || 0;
  appState.amount = val;

  presetBtns.forEach(btn => {
    if (parseInt(btn.getAttribute("data-val")) === val) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
});

// Pilih Opsi Preset
presetBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    presetBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const val = parseInt(btn.getAttribute("data-val"));
    appState.amount = val;
    robuxManualInput.value = val;
  });
});

// Lanjut ke Konfirmasi (Step 3)
btnGotoStep3.addEventListener("click", () => {
  if (appState.amount <= 0) {
    alert("Masukkan nominal Robux yang valid.");
    return;
  }

  const t = appState.targetUser;
  document.getElementById("step3DisplayName").textContent = t.displayName;
  document.getElementById("step3UsernameTag").textContent = `@${t.name}`;
  document.getElementById("step3Avatar").src = t.avatarUrl;
  document.getElementById("step3DisplayAmount").textContent = appState.amount;
  document.getElementById("step3JoinYear").textContent = `ⓘ Bergabung pada tahun ${t.joinYear}`;

  setStep(step3Confirm);
});

btnBackToStep2.addEventListener("click", () => {
  setStep(step2Amount);
});

// ==============================================================
// 4. EKSEKUSI KIRIM (POTONG SALDO & SUKSES CENTANG)
// ==============================================================
btnExecuteSend.addEventListener("click", () => {
  appState.balance -= appState.amount;
  updateBalanceUI();

  document.getElementById("successSentAmount").textContent = appState.amount;
  setStep(step4Success);
});

btnSuccessOk.addEventListener("click", () => {
  sendModalOverlay.classList.add("hidden");
  setStep(step1Target);
});

// Buka / Tutup Modal Kirim Robux
openSendRobuxBtn.addEventListener("click", () => {
  setStep(step1Target);
  sendModalOverlay.classList.remove("hidden");
});

btnCloseModal.addEventListener("click", () => {
  sendModalOverlay.classList.add("hidden");
});

// Daftar Teman Cepat
function loadQuickFriends() {
  const friends = [
    { name: "Sub2Swift", displayName: "Sub2Swift", avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-11F24FE35A13710777B0AC655D187A13-Png/150/150/AvatarHeadshot/Webp/noFilter" },
    { name: "sad_boy", displayName: "sad_boy", avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C9AA74A7C18BD9C7A179BC58509F9C62-Png/150/150/AvatarHeadshot/Webp/noFilter" },
    { name: "Mila", displayName: "Mila", avatarUrl: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-F74254DF57463DA6ED56D60DE2B7218F-Png/150/150/AvatarHeadshot/Webp/noFilter" }
  ];

  quickFriendsList.innerHTML = "";
  friends.forEach(f => {
    const row = document.createElement("div");
    row.className = "friend-pill-row";
    row.innerHTML = `
      <img src="${f.avatarUrl}" alt="">
      <span style="font-weight: 600; font-size: 13.5px;">${f.displayName}</span>
    `;
    row.addEventListener("click", () => {
      detectUser(f.name);
    });
    quickFriendsList.appendChild(row);
  });
}
