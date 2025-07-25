import { useEffect, useState } from 'react';
import { freon_backend } from 'declarations/freon_backend';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

function App() {
  const [authClient, setAuthClient] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: '', bio: '', image_url: '' });
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Initialize AuthClient and check login
  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        setPrincipal(principal);
        fetchProfile(principal);
      } else {
        setLoading(false);
      }
    });
  }, []);

  // Fetch user profile from backend
  async function fetchProfile(principalObj) {
    setLoading(true);
    setError('');
    try {
      // Ensure principal is a Principal object
      const principalToQuery = Principal.fromText(principalObj.toText());
      const result = await freon_backend.get_user(principalToQuery);
      // Candid optional returns [profile] or []
      console.log('get_user result:', result);
      if (Array.isArray(result) && result.length > 0 && result[0]) {
        setProfile(result[0]);
      } else {
        setProfile(null);
      }
    } catch (e) {
      setError('Failed to fetch profile.');
      setProfile(null);
    }
    setLoading(false);
  }

  // Login with Internet Identity
  function login() {
    authClient.login({
      identityProvider:
        process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/#authorize"
          : "http://localhost:4943/?canisterId=vizcg-th777-77774-qaaea-cai#authorize",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        setPrincipal(principal);
        fetchProfile(principal);
      },
    });
  }

  // Logout
  function logout() {
    authClient.logout();
    setPrincipal(null);
    setProfile(null);
    setForm({ username: '', bio: '', image_url: '' });
    setError('');
  }

  // Handle registration form submit
  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    try {
      // Ensure principal is a Principal object
      const principalToRegister = Principal.fromText(principal.toText());
      const ok = await freon_backend.register_user(
        principalToRegister,
        form.username,
        form.bio,
        form.image_url
      );
      if (ok) {
        fetchProfile(principal);
      } else {
        setError('User already registered.');
      }
    } catch (e) {
      setError('Registration failed.');
    }
  }

  // Refresh profile
  async function handleRefresh() {
    setRefreshing(true);
    await fetchProfile(principal);
    setRefreshing(false);
  }

  if (loading) return <main>Loading...</main>;

  if (!principal) {
    return (
      <main>
        <img src="/logo2.svg" alt="DFINITY logo" />
        <h2>Welcome to Freon</h2>
        <button onClick={login}>Login with Internet Identity</button>
      </main>
    );
  }

  if (profile) {
    return (
      <main>
        <img src={profile.image_url || '/logo2.svg'} alt="avatar" width={80} height={80} />
        <h2>{profile.username}</h2>
        <p>{profile.bio}</p>
        <p><b>Principal:</b> {principal.toText()}</p>
        <button onClick={logout}>Logout</button>
        <button onClick={handleRefresh} disabled={refreshing} style={{ marginLeft: 8 }}>
          {refreshing ? 'Refreshing...' : 'Refresh Profile'}
        </button>
        <hr style={{ margin: '2em 0' }} />
        {/* Placeholder for future features */}
        <button disabled title="Coming soon!">Edit Profile</button>
        <button disabled title="Coming soon!" style={{ marginLeft: 8 }}>Explore Users</button>
      </main>
    );
  }

  // Registration form
  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <h2>Register your profile</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          required
        /><br />
        <textarea
          placeholder="Bio"
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
        /><br />
        <input
          type="text"
          placeholder="Avatar Image URL"
          value={form.image_url}
          onChange={e => setForm({ ...form, image_url: e.target.value })}
        /><br />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={logout}>Logout</button>
    </main>
  );
}

export default App;
