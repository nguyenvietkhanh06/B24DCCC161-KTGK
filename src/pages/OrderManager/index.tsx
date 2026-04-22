import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import OrderTable from './components/OrderTable';
import OrderForm from './components/OrderForm'; 

const OrderManagerPage: React.FC = () => {
  const { loadAllData } = useModel('useOrderStore');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderManager.OrderItem | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Card 
        title="Hệ thống Quản lý đơn hàng" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              console.log("Click nút Tạo đơn"); 
              setEditingOrder(null);
              setIsFormVisible(true);
            }}
          >
            Tạo đơn hàng mới
          </Button>
        }
      >
        <OrderTable onEdit={(order) => {
          setEditingOrder(order);
          setIsFormVisible(true);
        }} />
      </Card>

      {}
      <OrderForm 
        visible={isFormVisible} 
        setVisible={setIsFormVisible} 
        record={editingOrder} 
        reload={loadAllData} 
      />
    </div>
  );
};

export default OrderManagerPage;