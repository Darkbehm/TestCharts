export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginRequestBody {
  mail: string;
  pass: string;
}

export interface Company {
  _id: string;
  name: string;
  key: string;
  picture: {
    _id: string;
    public_url_firebase: string;
    local_short_url: string;
  };
  logo: Array<{
    _id: string;
    public_url_firebase: string;
    local_short_url: string;
  }>;
}

export interface AuthResponse {
  _id: string;
  user: string;
  email: string;
  surveyStart: boolean;
  company: Company;
  token: string;
}

export interface AuthUser {
  id: string;
  user: string;
  email: string;
  surveyStart: boolean;
  company: Company;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthError {
  title?: string;
  message: string;
  code?: string;
}

export interface APIErrorResponse {
  code: number;
  message: string;
  success: boolean;
  error: {
    title: string;
    message: string;
  };
  i18n: string;
  global: Record<string, any>;
}
