import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.example.com';

async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem('authToken');
}

async function request(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  auth: {
    sendOTP: async (phone: string) => {
      return request('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
    },
    verifyOTP: async (phone: string, otp: string) => {
      return request('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
    },
  },

  user: {
    getProfile: async () => {
      return request('/api/user/profile');
    },
    updateProfile: async (data: any) => {
      return request('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  shg: {
    getMembers: async () => {
      return request('/api/shg/members');
    },
  },

  projects: {
    getList: async () => {
      return request('/api/projects');
    },
    getDetails: async (id: string) => {
      return request(`/api/projects/${id}`);
    },
  },

  schemes: {
    getList: async () => {
      return request('/api/schemes');
    },
    apply: async (formData: FormData) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/schemes/apply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return response.json();
    },
  },

  finance: {
    getLoans: async () => {
      return request('/api/finance/loans');
    },
    getTransactions: async () => {
      return request('/api/finance/transactions');
    },
  },

  complaints: {
    submit: async (formData: FormData) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return response.json();
    },
    getList: async () => {
      return request('/api/complaints');
    },
    escalate: async (id: string) => {
      return request(`/api/complaints/${id}/escalate`, {
        method: 'POST',
      });
    },
  },

  training: {
    getModules: async () => {
      return request('/api/training');
    },
    markComplete: async (moduleId: string) => {
      return request(`/api/training/${moduleId}/complete`, {
        method: 'POST',
      });
    },
  },

  attendance: {
    checkIn: async (data: any) => {
      return request('/api/attendance/checkin', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    checkOut: async (data: any) => {
      return request('/api/attendance/checkout', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getHistory: async () => {
      return request('/api/attendance/history');
    },
  },

  notifications: {
    getList: async () => {
      return request('/api/notifications');
    },
    markRead: async (id: string) => {
      return request(`/api/notifications/${id}/read`, {
        method: 'POST',
      });
    },
  },
};
