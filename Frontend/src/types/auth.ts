export type UserRole = 'it' | 'doctor' | 'topographer';

export interface LoginCredentials {
  username: string;
  password: string;
  role: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  username: string | null;
  firstName?: string | null;  
  lastName?: string | null;   
}
