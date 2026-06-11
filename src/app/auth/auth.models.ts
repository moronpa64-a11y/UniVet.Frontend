export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn?: number;
  user?: {
    id: number;
    nombre: string;
    email: string;
  };
}
