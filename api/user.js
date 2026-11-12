export default async function handler(req, res) {
  // Hanya menerima metode GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Parameter username diperlukan' });
  }

  try {
    // 1. Minta User ID dari username ke API resmi Roblox
    const userLookupResponse = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });

    const userData = await userLookupResponse.json();

    if (!userData.data || userData.data.length === 0) {
      return res.status(404).json({ error: 'Akun tidak ditemukan' });
    }

    const user = userData.data[0];

    // 2. Ambil thumbnail headshot publik
    const thumbResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`
    );
    const thumbData = await thumbResponse.json();
    const avatarUrl = thumbData.data?.[0]?.imageUrl || '';

    // 3. Kembalikan data publik yang aman ke frontend
    return res.status(200).json({
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      avatarUrl: avatarUrl
    });

  } catch (error) {
    return res.status(500).json({ error: 'Gagal menghubungi server Roblox' });
  }
}
