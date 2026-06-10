import api from './axios'

export const getPlans = () => api.get('/maintenance/plans')
export const createPlan = (data) => api.post('/maintenance/plans', data)
export const getMyContracts = () => api.get('/maintenance/contracts/mine')
export const getAllContracts = () => api.get('/maintenance/contracts')
export const createContract = (data) => api.post('/maintenance/contracts', data)