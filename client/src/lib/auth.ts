import { create } from 'zustand';

interface AuthState {
  role: string | null;
  setRole: (role: string | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}));

export const login = async (username: string, password: string) => {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid credentials');
  }

  const data = await res.json();
  return data.role;
};
