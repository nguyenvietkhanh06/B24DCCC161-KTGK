import { useState, useCallback } from 'react';
import { getOrders, getInitData, addOrder, updateOrder } from '@/services/OrderManager/api';
import { message } from 'antd';

export default function useOrderStore() {
  const [orders, setOrders] = useState<OrderManager.OrderItem[]>([]);
  const [customers, setCustomers] = useState<OrderManager.Customer[]>([]);
  const [products, setProducts] = useState<OrderManager.Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [initRes, orderRes] = await Promise.all([getInitData(), getOrders()]);
      
      const rawInitData = initRes?.data || initRes;
      
      const finalCustomers = rawInitData?.customers || rawInitData?.data?.customers || [];
      const finalProducts = rawInitData?.products || rawInitData?.data?.products || [];

      setCustomers(finalCustomers);
      setProducts(finalProducts);

      const rawOrderData = orderRes?.data || orderRes;
      const finalOrders = Array.isArray(rawOrderData) 
        ? rawOrderData 
        : (rawOrderData?.data || []);

      setOrders(finalOrders);

      console.log('--- KIỂM TRA DỮ LIỆU SAU KHI BÓC TÁCH ---');
      console.log('Khách hàng:', finalCustomers.length);
      console.log('Sản phẩm:', finalProducts.length);

    } catch (error) {
      console.error('Lỗi loadAllData:', error);
      message.error('Lỗi tải dữ và liệu hệ thống');
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateTotal = (selectedProductIds: string[]) => {
    
    if (!products) return 0;
    return (selectedProductIds || []).reduce((sum, id) => {
      const product = products.find(p => p.id === id);
      return sum + (product?.price || 0);
    }, 0);
  };

  const isIdDuplicate = (id: string) => {
    return (orders || []).some(order => order.id === id);
  };

  return {
    orders,
    customers,
    products,
    loading,
    loadAllData,
    calculateTotal,
    isIdDuplicate,
    setOrders
  };
}