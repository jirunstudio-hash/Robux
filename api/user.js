export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Parameter username diperlukan' });
  }

  try {
    // 1. Ambil User ID dari Username
    const lookupRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
    });
    const lookupData = await lookupRes.json();

    if (!lookupData.data || lookupData.data.length === 0) {
      return res.status(404).json({ error: 'Pengguna Roblox tidak ditemukan' });
    }

    const userId = lookupData.data[0].id;

    // 2. Ambil Profil Detail & Tanggal Bergabung
    const profileRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const profileData = await profileRes.json();
    const joinYear = new Date(profileData.created).getFullYear();

    // 3. Ambil Avatar Headshot Pengguna
    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`
    );
    const thumbData = await thumbRes.json();
    const avatarUrl = thumbData.data?.[0]?.imageUrl || '';

    // Kembalikan Data Lengkap
    return res.status(200).json({
      id: profileData.id,
      name: profileData.name,
      displayName: profileData.displayName,
      joinYear: joinYear,
      avatarUrl: avatarUrl
    });

  } catch (error) {
    return res.status(500).json({ error: 'Gagal menghubungi server Roblox' });
  }
}
