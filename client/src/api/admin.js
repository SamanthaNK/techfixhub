import api from './axios'

export const getDashboard = () => api.get('/admin/dashboard')
export const getUsers = (params) => api.get('/admin/users', { params })
export const toggleUserStatus = (id) => api.patch(`/admin/users/${id}/toggle-status`)
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role })

export const getInventory = (params) => api.get('/inventory', { params })
export const createInventoryItem = (data) => api.post('/inventory', data)
export const updateInventoryItem = (id, data) => api.put(`/inventory/${id}`, data)
export const adjustStock = (id, adjustment) => api.patch(`/inventory/${id}/stock`, { adjustment })