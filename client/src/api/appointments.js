import api from './axios'

export const bookAppointment = (data) => api.post('/appointments', data)
export const getMyAppointments = () => api.get('/appointments/my-appointments')
export const getAllAppointments = () => api.get('/appointments')
export const updateAppointmentStatus = (id, data) => api.patch(`/appointments/${id}/status`, data)