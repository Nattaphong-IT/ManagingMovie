export interface User {
  id: string;
  username: string;
  role: 'MANAGER' | 'TEAMLEADER' | 'FLOORSTAFF';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
