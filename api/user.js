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

    // 2. Ambil Profil Detail Akurat (Tanggal Bergabung / Created)
    const profileRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const profileData = await profileRes.json();
    const joinYear = new Date(profileData.created).getFullYear();

    // 3. Ambil Avatar Headshot Pengguna
    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`
    );
    const thumbData = await thumbRes.json();
    const avatarUrl = thumbData.data?.[0]?.imageUrl || '';

    // 4. Ambil Daftar Teman Asli Akun Tersebut
    const friendsRes = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends`);
    const friendsData = await friendsRes.json();
    
    // Ambil maksimal 15 teman pertama
    const rawFriends = (friendsData.data || []).slice(0, 15);
    let friends = [];

    if (rawFriends.length > 0) {
      const friendIds = rawFriends.map(f => f.id).join(',');
      const friendsThumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${friendIds}&size=150x150&format=Png&isCircular=false`
      );
      const friendsThumbData = await friendsThumbRes.json();
      const thumbMap = {};
      (friendsThumbData.data || []).forEach(t => { thumbMap[t.targetId] = t.imageUrl; });

      friends = rawFriends.map(f => ({
        id: f.id,
        name: f.name,
        displayName: f.displayName,
        avatarUrl: thumbMap[f.id] || ''
      }));
    }

    // Kembalikan data lengkap dan akurat
    return res.status(200).json({
      id: profileData.id,
      name: profileData.name,
      displayName: profileData.displayName,
      created: profileData.created,
      joinYear: joinYear,
      avatarUrl: avatarUrl,
      friendsCount: friendsData.data ? friendsData.data.length : 0,
      friends: friends
    });

  } catch (error) {
    return res.status(500).json({ error: 'Gagal mendeteksi akun dari Roblox API' });
  }
}
