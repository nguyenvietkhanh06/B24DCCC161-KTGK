import axios from '@/utils/axios';

export const getInitData = () => axios.get('/api/order-manager/init-data');
export const getOrders = () => axios.get('/api/order-manager/orders');
export const addOrder = (data: OrderManager.OrderItem) => axios.post('/api/order-manager/orders', data);
export const updateOrder = (id: string, data: Partial<OrderManager.OrderItem>) => 
  axios.put(`/api/order-manager/orders/${id}`, data);