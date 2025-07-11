import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  APODResponse,
  MarsRoverResponse,
  NEOResponse,
  EPICImage,
  MediaSearchResponse,
  HealthResponse,
  APODParams,
  MarsPhotosParams,
  NEOParams,
  EPICParams,
  SearchParams
} from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    if (error.response?.status && error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    throw error;
  }
);

export const nasaApi = {
  async getAPOD(params: APODParams = {}): Promise<APODResponse | APODResponse[]> {
    try {
      const response: AxiosResponse<APODResponse | APODResponse[]> = await api.get('/api/apod', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch APOD');
    }
  },

  async getMarsPhotos(params: MarsPhotosParams = {}): Promise<MarsRoverResponse> {
    try {
      const response: AxiosResponse<MarsRoverResponse> = await api.get('/api/mars-photos', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch Mars photos');
    }
  },

  async getNearEarthObjects(params: NEOParams = {}): Promise<NEOResponse> {
    try {
      const response: AxiosResponse<NEOResponse> = await api.get('/api/neo', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch NEO data');
    }
  },

  async getEarthImages(params: EPICParams = {}): Promise<EPICImage[]> {
    try {
      const response: AxiosResponse<EPICImage[]> = await api.get('/api/epic', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch Earth images');
    }
  },

  async searchMedia(query: string, params: Omit<SearchParams, 'q'> = {}): Promise<MediaSearchResponse> {
    try {
      const response: AxiosResponse<MediaSearchResponse> = await api.get('/api/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to search media');
    }
  },

  async getHealth(): Promise<HealthResponse> {
    try {
      const response: AxiosResponse<HealthResponse> = await api.get('/api/health');
      return response.data;
    } catch (error: any) {
      throw new Error('API health check failed');
    }
  }
};

export default api; 