import axios, {AxiosError} from 'axios';
import {
  LoginCredentials,
  AuthResponse,
  AuthError,
  LoginRequestBody,
  AuthUser,
  APIErrorResponse,
} from './types';

const API_BASE_URL = 'https://qa-api.habitsapi.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: async (
    credentials: LoginCredentials,
  ): Promise<{response: AuthResponse; user: AuthUser}> => {
    try {
      // Convert credentials to API format
      const requestBody: LoginRequestBody = {
        mail: credentials.email,
        pass: credentials.password,
      };

      const response = await api.post<AuthResponse>('/login', requestBody);
      const apiResponse = response.data;

      // Transform response to our internal user format
      const user: AuthUser = {
        id: apiResponse._id,
        user: apiResponse.user,
        email: apiResponse.email,
        surveyStart: apiResponse.surveyStart,
        company: apiResponse.company,
      };

      return {
        response: apiResponse,
        user,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // Handle specific API error format
        const apiError = error.response.data as APIErrorResponse;

        let errorTitle = 'Error';
        let errorMessage =
          'Credenciales inválidas. Verifica tu email y contraseña.';

        if (apiError && apiError.error) {
          // Use the specific error title and message from the API
          errorTitle = apiError.error.title || 'Error';
          errorMessage = apiError.error.message || errorMessage;
        } else if (apiError && apiError.message) {
          // Fallback to the general message
          errorMessage = apiError.message;
        }

        const authError: AuthError = {
          title: errorTitle,
          message: errorMessage,
          code: error.response.status?.toString(),
        };

        console.log('API Error Details:', {
          status: error.response.status,
          apiError,
          finalError: authError,
        });

        throw authError;
      } else if (error instanceof AxiosError) {
        // Network or other axios errors
        const authError: AuthError = {
          title: 'Error de Conexión',
          message: 'Error de conexión. Verifica tu conexión a internet.',
          code: 'NETWORK_ERROR',
        };
        throw authError;
      } else {
        // Unknown errors
        throw {
          title: 'Error Inesperado',
          message:
            error instanceof Error
              ? error.message
              : 'Error inesperado. Inténtalo de nuevo.',
        } as AuthError;
      }
    }
  },
};
