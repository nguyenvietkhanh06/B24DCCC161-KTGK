import React, { useState } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { updateOrder } from '@/services/OrderManager/api';

const { Search } = Input;

interface Props {
  onEdit: (order: OrderManager.OrderItem) => void;
}

const OrderTable: React.FC<Props> = ({ onEdit }) => {
  const { orders, loading, loadAllData } = useModel('useOrderStore');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  
  const handleCancel = async (id: string) => {
    try {
      await updateOrder(id, { status: 'canceled' as any }); 
      message.success('Đã hủy đơn hàng thành công');
      loadAllData();
    } catch (error) {
      message.error('Không thể hủy đơn hàng');
    }
  };

  
  const filteredData = orders.filter(item => {
    const matchSearch = item.id.toLowerCase().includes(searchText.toLowerCase()) || 
                        item.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus ? item.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { 
      title: 'Ngày đặt', 
      dataIndex: 'orderDate', 
      key: 'orderDate',
      sorter: (a: any, b: any) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (val: number) => `${val.toLocaleString()} đ`,
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = { pending: 'orange', shipping: 'blue', completed: 'green', canceled: 'red' };
        const labels = { pending: 'Chờ xác nhận', shipping: 'Đang giao', completed: 'Hoàn thành', canceled: 'Đã hủy' };
        return <Tag color={(colors as any)[status]}>{(labels as any)[status]}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: OrderManager.OrderItem) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} 
            disabled={record.status === 'canceled'} 
            title={record.status === 'canceled' ? "Đơn hàng đã hủy không thể sửa" : "Chỉnh sửa"}
            />
          
          {}
          <Popconfirm
            title="Bạn có chắc chắn muốn hủy đơn hàng này không?"
            onConfirm={() => handleCancel(record.id)}
            disabled={record.status !== 'pending'} 
            okText="Đồng ý"
            cancelText="Không"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              disabled={record.status !== 'pending'} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Search 
            placeholder="Tìm mã hoặc khách hàng" 
            onSearch={setSearchText} 
            style={{ width: 250 }} 
            allowClear
          />
          <Select 
            placeholder="Lọc trạng thái" 
            style={{ width: 150 }} 
            allowClear 
            onChange={setFilterStatus}
          >
            <Select.Option value="pending">Chờ xác nhận</Select.Option>
            <Select.Option value="shipping">Đang giao</Select.Option>
            <Select.Option value="completed">Hoàn thành</Select.Option>
            <Select.Option value="canceled">Đã hủy</Select.Option>
          </Select>
        </Space>
      </Space>
      
      <Table 
        dataSource={filteredData} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
      />
    </>
  );
};

export default OrderTable;