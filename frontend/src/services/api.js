const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Generic fetch wrapper with JSON headers and optional Bearer token
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth_logout'));
    }
    const error = new Error(data.message || 'An error occurred during API request');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// Authentication API methods
export const authService = {
  signup: async (name, email, password) => {
    return await fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  login: async (email, password) => {
    return await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  getMe: async () => {
    return await fetchAPI('/auth/me', {
      method: 'GET'
    });
  }
};

// Task API methods
export const taskService = {
  getTasks: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await fetchAPI(`/tasks${queryString}`, { method: 'GET' });
  },

  getAnalytics: async () => {
    return await fetchAPI('/tasks/analytics', { method: 'GET' });
  },

  getTaskById: async (id) => {
    return await fetchAPI(`/tasks/${id}`, { method: 'GET' });
  },

  createTask: async (taskData) => {
    return await fetchAPI('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  updateTask: async (id, taskData) => {
    return await fetchAPI(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  },

  updateTaskStatus: async (id, status) => {
    return await fetchAPI(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  deleteTask: async (id) => {
    return await fetchAPI(`/tasks/${id}`, { method: 'DELETE' });
  }
};
