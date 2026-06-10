import api from './axios'

export const submitContact = (data) => api.post('/contact', data)
export const getMessages = (params) => api.get('/contact', { params })
export const markMessageRead = (id) => api.patch(`/contact/${id}/read`)