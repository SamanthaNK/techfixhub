import api from './axios'

export const submitRepair = (data) => api.post('/repairs', data)
export const getMyRepairs = () => api.get('/repairs/my-repairs')
export const trackRepair = (trackingId) => api.get(`/repairs/track/${trackingId}`)
export const getRepairById = (id) => api.get(`/repairs/${id}`)
export const getAllRepairs = (params) => api.get('/repairs', { params })
export const updateRepairStatus = (id, data) => api.patch(`/repairs/${id}/status`, data)