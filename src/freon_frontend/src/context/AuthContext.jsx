import { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { freon_backend } from 'declarations/freon_backend';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [authClient, setAuthClient] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize AuthClient and check login
  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        setPrincipal(principal);
        await fetchProfile(principal);
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
      const principalToQuery = Principal.fromText(principalObj.toText());
      const result = await freon_backend.get_user(principalToQuery);
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
    if (!authClient) return;
    
    const localCanisterId = process.env.CANISTER_ID_INTERNET_IDENTITY || "";
    const identityProvider =
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://localhost:4943/?canisterId=${localCanisterId}#authorize`;

    authClient.login({
      identityProvider,
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        setPrincipal(principal);
        await fetchProfile(principal);
      },
    });
  }

  // Logout
  function logout() {
    if (!authClient) return;
    
    authClient.logout();
    setPrincipal(null);
    setProfile(null);
    setError('');
  }

  // Register new user
  async function register(username, bio, imageUrl) {
    if (!principal) throw new Error('Not authenticated');
    
    setError('');
    try {
      const principalToRegister = Principal.fromText(principal.toText());
      const ok = await freon_backend.register_user(
        principalToRegister,
        username,
        bio,
        imageUrl
      );
      if (ok) {
        await fetchProfile(principal);
        return true;
      } else {
        setError('User already registered.');
        return false;
      }
    } catch (e) {
      setError('Registration failed.');
      return false;
    }
  }

  // Update user profile
  async function updateProfile(username, bio, imageUrl) {
    if (!principal) throw new Error('Not authenticated');
    
    setError('');
    try {
      const principalToUpdate = Principal.fromText(principal.toText());
      const ok = await freon_backend.update_user_profile(
        principalToUpdate,
        username,
        bio,
        imageUrl
      );
      if (ok) {
        await fetchProfile(principal);
        return true;
      } else {
        setError('Failed to update profile.');
        return false;
      }
    } catch (e) {
      setError('Profile update failed.');
      return false;
    }
  }

  // Refresh profile
  async function refreshProfile() {
    if (principal) {
      await fetchProfile(principal);
    }
  }

  const value = {
    authClient,
    principal,
    profile,
    loading,
    error,
    setError,
    login,
    logout,
    register,
    updateProfile,
    refreshProfile,
    isAuthenticated: !!principal,
    hasProfile: !!profile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
