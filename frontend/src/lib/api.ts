import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to inject auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if it's invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: {
    email: string;
    password: string;
    username: string;
    full_name?: string;
  }) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// User API
export const userApi = {
  updateProfile: async (userData: {
    username?: string;
    email?: string;
    full_name?: string;
  }) => {
    const response = await api.put('/api/users/me', userData);
    return response.data;
  },
  deleteAccount: async () => {
    await api.delete('/api/users/me');
  },
  getCurrentUser: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  }
};

// Journal API
export const journalApi = {
  getEntries: async () => {
    const response = await api.get('/api/journals');
    return response.data;
  },
  createEntry: async (data: {
    title: string;
    content: string;
    mood_tag_ids?: number[];
  }) => {
    const response = await api.post('/api/journals', data);
    return response.data;
  },
  updateEntry: async (id: number, data: {
    title?: string;
    content?: string;
    mood_tag_ids?: number[];
  }) => {
    const response = await api.put(`/api/journals/${id}`, data);
    return response.data;
  },
  deleteEntry: async (id: number) => {
    await api.delete(`/api/journals/${id}`);
  },
};

// Workout API
export const workoutApi = {
  getWorkouts: async () => {
    const response = await api.get('/api/workouts');
    return response.data;
  },
  createWorkout: async (data: {
    name: string;
    description?: string;
    duration_minutes: number;
    exercise_ids?: number[];
  }) => {
    const response = await api.post('/api/workouts', data);
    return response.data;
  },
  updateWorkout: async (id: number, data: {
    name?: string;
    description?: string;
    duration_minutes?: number;
    exercise_ids?: number[];
  }) => {
    const response = await api.put(`/api/workouts/${id}`, data);
    return response.data;
  },
  deleteWorkout: async (id: number) => {
    await api.delete(`/api/workouts/${id}`);
  },
};

// Habits API
export const habitsApi = {
  getHabits: async () => {
    const response = await api.get('/api/habits');
    return response.data;
  },
  createHabit: async (data: {
    name: string;
    description?: string;
    frequency: string;
  }) => {
    const response = await api.post('/api/habits', data);
    return response.data;
  },
  updateHabit: async (id: number, data: {
    name?: string;
    description?: string;
    frequency?: string;
  }) => {
    const response = await api.put(`/api/habits/${id}`, data);
    return response.data;
  },
  deleteHabit: async (id: number) => {
    await api.delete(`/api/habits/${id}`);
  },
};

// Water Intake API
export const waterIntakeApi = {
  getIntakes: async () => {
    const response = await api.get('/api/water-intake');
    return response.data;
  },
  addIntake: async (data: { amount_ml: number }) => {
    const response = await api.post('/api/water-intake', data);
    return response.data;
  },
};

// Steps API
export const stepsApi = {
  getDailySteps: async (date: string) => {
    const response = await api.get(`/api/steps/daily/${date}`);
    return response.data;
  },
  updateDailySteps: async (date: string, count: number) => {
    const response = await api.put(`/api/steps/daily/${date}`, { count });
    return response.data;
  },
  updateStepsGoal: async (dailyStepsGoal: number) => {
    const response = await api.put('/api/steps/goal', { daily_steps_goal: dailyStepsGoal });
    return response.data;
  }
}; 