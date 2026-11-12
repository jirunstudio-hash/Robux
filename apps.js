// State Sistem
let appState = {
  currentUser: null,
  balance: 113500,
  selectedRecipient: null,
  transferAmount: 25,
  friendsList: []
};

// Elemen DOM Website Utama
const accountDetectorInput = document.getElementById("accountDetectorInput");
const navAvatar = document.getElementById("navAvatar");
const navDisplayName = document.getElementById("navDisplayName");
const sideAvatar = document.getElementById("sideAvatar");
const sideDisplayName = document.getElementById("sideDisplayName");
const sideFriendsBadge = document.getElementById("sideFriendsBadge");
const headerBalanceDisplay = document.getElementById("headerBalanceDisplay");
const modalBalanceNumber = document.getElementById("modalBalanceNumber");

// Elemen Modal & Steps
const btnOpenKirimModal = document.getElementById("btnOpenKirimModal");
const modalOverlay = document.getElementById("modalOverlay");
const btnCloseModal = document.getElementById("btnCloseModal");

const stepSelectFriend = document.getElementById("stepSelectFriend");
const stepChooseAmount = document.getElementById("stepChooseAmount");
const stepConfirmSend = document.getElementById("stepConfirmSend");
const stepSuccess = document.getElementById("stepSuccess");

const friendsContainer = document.getElementById("friendsContainer");
const modalFriendsCount = document.getElementById("modalFriendsCount");
const friendFilterInput = document.getElementById("friendFilterInput");

// Helper Pergantian Langkah Modal
function switchStep(activeStep) {
  [stepSelectFriend, stepChooseAmount, stepConfirmSend, stepSuccess].forEach(step => {
    step.classList.add("hidden");
  });
  activeStep.classList.remove("hidden");
}

function updateBalanceUI() {
  const formatted = appState.balance.toLocaleString("id-ID");
  headerBalanceDisplay.textContent = formatted;
  modalBalanceNumber.textContent = formatted;
}

// ==============================================================
// DETEKSI AKUN AKURAT DARI API ROBLOX
// ==============================================================
async function detectRobloxAccount(username) {
  try {
    const res = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Akun tidak ditemukan");
      return;
    }

    appState.currentUser = data;
    appState.friendsList = data.friends || [];

    // 1. Terapkan ke Tampilan Website Utama (Foto 1)
    navDisplayName.textContent = data.displayName;
    sideDisplayName.textContent = data.displayName;
    sideFriendsBadge.textContent = data.friendsCount;
    modalFriendsCount.textContent = data.friendsCount;

    if (data.avatarUrl) {
      navAvatar.src = data.avatarUrl;
      sideAvatar.src = data.avatarUrl;
    }

    // 2. Render Daftar Teman Asli ke Modal (Foto 2)
    renderFriendsList(appState.friendsList);

  } catch (err) {
    console.error("Gagal mendeteksi akun:", err);
  }
}

// Render Teman Asli dari API
function renderFriendsList(friends) {
  friendsContainer.innerHTML = "";

  if (friends.length === 0) {
    friendsContainer.innerHTML = `<div style="text-align:center; padding:20px; font-size:12px; color:#64748b;">Tidak ada teman ditemukan pada akun ini.</div>`;
    return;
  }

  friends.forEach(friend => {
    const row = document.createElement("div");
    row.className = "friend-row";
    row.innerHTML = `
      <img src="${friend.avatarUrl || 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-11F24FE35A13710777B0AC655D187A13-Png/150/150/AvatarHeadshot/Webp/noFilter'}" alt="">
      <span class="friend-name">${friend.displayName || friend.name}</span>
    `;

    // Klik Teman -> Masuk ke Step 2 (Foto 3)
    row.addEventListener("click", () => {
      appState.selectedRecipient = friend;

      document.getElementById("step2DisplayName").textContent = friend.displayName;
      document.getElementById("step2Avatar").src = friend.avatarUrl;

      switchStep(stepChooseAmount);
    });

    friendsContainer.appendChild(row);
  });
}

// Filter Pencarian Teman
friendFilterInput.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = appState.friendsList.filter(f => 
    f.name.toLowerCase().includes(q) || f.displayName.toLowerCase().includes(q)
  );
  renderFriendsList(filtered);
});

// Deteksi Akun saat Enter di Search Bar Header
accountDetectorInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    detectRobloxAccount(accountDetectorInput.value.trim());
  }
});

// ==============================================================
// ALUR MODAL (Foto 2 -> Foto 3 -> Foto 4 -> Foto 5)
// ==============================================================
btnOpenKirimModal.addEventListener("click", () => {
  switchStep(stepSelectFriend);
  modalOverlay.classList.remove("hidden");
});

btnCloseModal.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

// Presets Nominal (25, 50, 100, 200)
document.querySelectorAll(".preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    appState.transferAmount = parseInt(btn.getAttribute("data-amount"));
    document.getElementById("displaySelectedAmount").textContent = appState.transferAmount;
  });
});

// Lanjut ke Konfirmasi (Foto 4)
document.getElementById("btnNextToConfirm").addEventListener("click", () => {
  const r = appState.selectedRecipient;
  document.getElementById("step3DisplayName").textContent = r.displayName;
  document.getElementById("step3UsernameTag").textContent = `@${r.name}`;
  document.getElementById("step3Avatar").src = r.avatarUrl;
  document.getElementById("step3AmountNumber").textContent = appState.transferAmount;
  
  // Tampilkan tahun join penerima atau default akun
  document.getElementById("step3JoinYear").textContent = `ⓘ Bergabung pada tahun ${appState.currentUser?.joinYear || 2026}`;

  switchStep(stepConfirmSend);
});

// Tombol Edit (Kembali ke Foto 3)
document.getElementById("btnBackToStep2").addEventListener("click", () => {
  switchStep(stepChooseAmount);
});

// Eksekusi Kirim (Foto 5 Sukses & Pengurangan Saldo)
document.getElementById("btnExecuteSend").addEventListener("click", () => {
  appState.balance -= appState.transferAmount;
  updateBalanceUI();

  document.getElementById("successAmountText").textContent = appState.transferAmount;
  switchStep(stepSuccess);
});

document.getElementById("btnSuccessDone").addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
  switchStep(stepSelectFriend);
});

// Inisialisasi Deteksi Akun Default Awal
detectRobloxAccount("sultancoins7");
updateBalanceUI();
