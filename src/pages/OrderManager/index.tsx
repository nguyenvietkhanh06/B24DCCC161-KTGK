import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import OrderToolbar from './components/OrderToolbar';
import OrderTable from './components/OrderTable';
import OrderForm from './components/OrderForm';

const OrderManagerPage: React.FC = () => {
  const { orders, loading, loadAllData } = useModel('useOrderStore');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderManager.OrderItem | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: any }>({ key: '', order: null });

  useEffect(() => { loadAllData(); }, []);
  const filteredData = orders.filter(item => {
    const matchSearch = item.id.toLowerCase().includes(searchText.toLowerCase()) || 
                        item.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus ? item.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: 24 }}>
      <Card 
        title="Hệ thống Quản lý đơn hàng" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingOrder(null); setIsFormVisible(true); }}>
            Tạo đơn hàng
          </Button>
        }
      >
        {}
        <OrderToolbar 
          onSearch={setSearchText}
          onFilter={setFilterStatus}
          onSort={(val) => {
            if (val === 'date') setSortConfig({ key: 'orderDate', order: 'descend' });
            else if (val === 'amount') setSortConfig({ key: 'totalAmount', order: 'descend' });
            else setSortConfig({ key: '', order: null });
          }}
        />
        {}
        <OrderTable 
          dataSource={filteredData} 
          loading={loading}
          sortConfig={sortConfig}
          onEdit={(record) => { setEditingOrder(record); setIsFormVisible(true); }}
          reload={loadAllData}
        />
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