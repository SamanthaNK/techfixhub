import api from './axios'

export const getPrograms = (params) => api.get('/training', { params })
export const getProgramById = (id) => api.get(`/training/${id}`)
export const enrollInProgram = (id) => api.post(`/training/${id}/enroll`)
export const getMyEnrollments = () => api.get('/training/my-enrollments')
export const createProgram = (data) => api.post('/training', data)
export const updateProgram = (id, data) => api.put(`/training/${id}`, data)