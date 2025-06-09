import axios, {AxiosResponse} from 'axios';
import {GlucoseResponse, GlucoseRequest} from './types';

const BASE_URL = 'https://qa-api.habitsapi.com/api';

export const glucoseAPI = {
  getGlucoseData: async (
    request: GlucoseRequest,
    token: string,
    userId: string,
  ): Promise<GlucoseResponse> => {
    try {
      const response: AxiosResponse<GlucoseResponse> = await axios.post(
        `${BASE_URL}/glucose/getByUserAndDateRange?userId=${userId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(
          response.data.message || 'Failed to fetch glucose data',
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error(
            'Unauthorized: Please check your authentication token',
          );
        }
        if (error.response?.status === 404) {
          throw new Error('No glucose data found for the selected date');
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        'An unexpected error occurred while fetching glucose data',
      );
    }
  },
};
