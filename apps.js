const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');
const statusMessage = document.getElementById('statusMessage');
const profileCard = document.getElementById('profileCard');

const avatarImg = document.getElementById('avatarImg');
const displayName = document.getElementById('displayName');
const username = document.getElementById('username');
const userId = document.getElementById('userId');

searchBtn.addEventListener('click', async () => {
  const query = usernameInput.value.trim();
  if (!query) {
    statusMessage.textContent = 'Silakan masukkan username terlebih dahulu.';
    return;
  }

  statusMessage.textContent = 'Mencari data...';
  profileCard.classList.add('hidden');

  try {
    // Memanggil serverless/backend lokal untuk menghindari CORS
    const response = await fetch(`/api/user?username=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!response.ok) {
      statusMessage.textContent = data.error || 'Pengguna tidak ditemukan.';
      return;
    }

    // Tampilkan data ke elemen HTML
    displayName.textContent = data.displayName;
    username.textContent = `@${data.name}`;
    userId.textContent = data.id;
    avatarImg.src = data.avatarUrl || '';

    statusMessage.textContent = '';
    profileCard.classList.remove('hidden');
  } catch (error) {
    statusMessage.textContent = 'Terjadi kesalahan saat menghubungi server.';
  }
});
