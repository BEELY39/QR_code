export interface SocialUserProfile {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  provider: 'google';
}

export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SocialUserProfile | null;
  error: string | null;
}
