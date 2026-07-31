export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
}

export interface TokenPayload {
  userId: number;
  userEmail: string;
  userRole: string;
    exp?: number;
}
