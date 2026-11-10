export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'applicant' | 'admin';
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

