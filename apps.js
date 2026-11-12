const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');
const statusMessage = document.getElementById('statusMessage');

// Elemen Tampilan Profil
const avatarImg = document.getElementById('avatarImg');
const displayName = document.getElementById('displayName');
const usernameTag = document.getElementById('usernameTag');
const profileSection = document.getElementById('profileSection');
const successSection = document.getElementById('successSection');

// Tombol & Nominal
const btnSend = document.getElementById('btnSend');
const btnOk = document.getElementById('btnOk');
const headerBalance = document.getElementById('headerBalance');
const sentAmount = document.getElementById('sentAmount');

let currentBalance = 113500;
let transferAmount = 25;

// Fungsi Cari Pengguna ke Backend
async function fetchRobloxUser() {
  const query = usernameInput.value.trim();
  if (!query) {
    statusMessage.textContent = 'Masukkan username Roblox.';
    return;
  }

  statusMessage.textContent = 'Mencari...';
  statusMessage.style.color = '#64748b';

  try {
    const response = await fetch(`/api/user?username=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!response.ok) {
      statusMessage.textContent = data.error || 'Pengguna tidak ditemukan.';
      statusMessage.style.color = '#ef4444';
      return;
    }

    // Masukkan data hasil fetch
    displayName.textContent = data.displayName || data.name;
    usernameTag.textContent = `@${data.name}`;
    if (data.avatarUrl) {
      avatarImg.src = data.avatarUrl;
    }

    statusMessage.textContent = '';
    
    // Pastikan card konfirmasi kembali tampil jika sebelumnya di layar sukses
    profileSection.classList.remove('hidden');
    successSection.classList.add('hidden');
  } catch (error) {
    statusMessage.textContent = 'Gagal menghubungi server.';
    statusMessage.style.color = '#ef4444';
  }
}

searchBtn.addEventListener('click', fetchRobloxUser);
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fetchRobloxUser();
});

// Aksi Klik "Kirim" -> Tampilkan Gambar 5 (Centang Sukses)
btnSend.addEventListener('click', () => {
  if (currentBalance >= transferAmount) {
    currentBalance -= transferAmount;
    // Format ke string ribuan (contoh: 113.475)
    headerBalance.textContent = currentBalance.toLocaleString('id-ID');
  }

  sentAmount.textContent = transferAmount;
  profileSection.classList.add('hidden');
  successSection.classList.remove('hidden');
});

// Aksi Klik "OK" di layar sukses
btnOk.addEventListener('click', () => {
  successSection.classList.add('hidden');
  profileSection.classList.remove('hidden');
});
