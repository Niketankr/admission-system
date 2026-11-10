import { User, AuthResponse } from '../models/user.model';

export class AuthService {
  private apiUrl = '/api/auth';
  private tokenKey = 'admission_token';
  private userKey = 'admission_user';

  login(email: string, password: string): Promise<AuthResponse> {
    return fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(res => res.json());
  }

  register(name: string, email: string, password: string, role: 'applicant' | 'admin' = 'applicant'): Promise<AuthResponse> {
    return fetch(`${this.apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    }).then(res => res.json());
  }

  saveSession(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }
}

